import { createHash, randomUUID } from 'node:crypto';
import { createReadStream, promises as fs } from 'node:fs';
import type { Readable } from 'node:stream';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppRelease } from './entities/app-release.entity';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';
import {
  PLATFORM_RULES,
  RELEASE_PLATFORMS,
  type ReleasePlatform,
} from './release-platform';
import { ReleaseStorage } from './release-storage';

/** Lo único que usamos del archivo que multer deja en disco. */
export interface UploadedFile {
  path: string;
  originalname: string;
  size: number;
}

/** Versión publicada tal como la ve la landing. */
export interface PublicRelease {
  platform: ReleasePlatform;
  version: string;
  notes: string | null;
  sizeBytes: number;
  sha256: string;
  publishedAt: Date;
  /** Ruta relativa a la API; la landing le antepone su `API_URL`. */
  downloadPath: string;
}

export interface ReleaseDownload {
  stream: Readable;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

@Injectable()
export class ReleasesService {
  private readonly logger = new Logger(ReleasesService.name);

  constructor(
    @InjectRepository(AppRelease)
    private readonly releases: Repository<AppRelease>,
    private readonly storage: ReleaseStorage,
  ) {}

  /** La última versión publicada de cada plataforma que ya tiene instalable. */
  async findLatestPublished(): Promise<PublicRelease[]> {
    const rows = await this.releases.find({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
    });
    const latest = new Map<ReleasePlatform, AppRelease>();
    for (const row of rows) {
      if (!latest.has(row.platform)) latest.set(row.platform, row);
    }
    return RELEASE_PLATFORMS.flatMap((platform) => {
      const row = latest.get(platform);
      return row ? [this.toPublic(row)] : [];
    });
  }

  findAll(): Promise<AppRelease[]> {
    return this.releases.find({ order: { createdAt: 'DESC' } });
  }

  async create(
    dto: CreateReleaseDto,
    file: UploadedFile | undefined,
    uploadedBy: string,
  ): Promise<AppRelease> {
    if (!file) {
      throw new BadRequestException('Adjunta el archivo instalable');
    }
    // El temporal lo borra `CleanupUploadInterceptor` si algo falla; aquí solo
    // hay que deshacer el archivo definitivo si no llega a registrarse.
    let stored = false;
    const key = `${randomUUID()}${PLATFORM_RULES[dto.platform].extension}`;
    try {
      await this.assertValidFile(dto.platform, file);

      const duplicate = await this.releases.existsBy({
        platform: dto.platform,
        version: dto.version,
      });
      if (duplicate) {
        throw new ConflictException(
          `Ya existe la versión ${dto.version} para ${dto.platform}`,
        );
      }

      const sha256 = await this.hashFile(file.path);
      await this.storage.put(file.path, key);
      stored = true;

      return await this.releases.save(
        this.releases.create({
          platform: dto.platform,
          version: dto.version,
          notes: dto.notes?.trim() || null,
          fileKey: key,
          fileName: `salud-movil-${dto.version}${PLATFORM_RULES[dto.platform].extension}`,
          sizeBytes: file.size,
          sha256,
          isPublished: dto.isPublished ?? true,
          uploadedBy,
        }),
      );
    } catch (error) {
      if (stored) await this.storage.remove(key).catch(() => undefined);
      throw error;
    }
  }

  async update(id: string, dto: UpdateReleaseDto): Promise<AppRelease> {
    const release = await this.getOrFail(id);
    if (dto.notes !== undefined) release.notes = dto.notes.trim() || null;
    if (dto.isPublished !== undefined) release.isPublished = dto.isPublished;
    return this.releases.save(release);
  }

  async remove(id: string): Promise<void> {
    const release = await this.getOrFail(id);
    await this.releases.remove(release);
    // La fila ya no existe; si el archivo no se puede borrar solo queda un
    // huérfano en disco, nunca una versión sin archivo.
    await this.storage.remove(release.fileKey).catch((error: unknown) => {
      this.logger.error(
        `No se pudo borrar el archivo ${release.fileKey}`,
        error instanceof Error ? error.stack : String(error),
      );
    });
  }

  /** Descarga de la última versión publicada de una plataforma. */
  async openLatest(platform: ReleasePlatform): Promise<ReleaseDownload> {
    const release = await this.releases.findOne({
      where: { platform, isPublished: true },
      order: { createdAt: 'DESC' },
    });
    if (!release) {
      throw new NotFoundException('Aún no hay una versión disponible');
    }

    let stream: Readable;
    try {
      stream = await this.storage.open(release.fileKey);
    } catch (error) {
      this.logger.error(
        `Falta el archivo de la versión ${release.id} (${release.fileKey})`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new NotFoundException('El archivo no está disponible por ahora');
    }

    // El contador no debe retrasar ni romper la descarga.
    void this.releases
      .increment({ id: release.id }, 'downloadCount', 1)
      .catch(() => undefined);

    return {
      stream,
      fileName: release.fileName,
      mimeType: PLATFORM_RULES[release.platform].mimeType,
      sizeBytes: release.sizeBytes,
    };
  }

  private async getOrFail(id: string): Promise<AppRelease> {
    const release = await this.releases.findOneBy({ id });
    if (!release) throw new NotFoundException('Versión no encontrada');
    return release;
  }

  private toPublic(row: AppRelease): PublicRelease {
    return {
      platform: row.platform,
      version: row.version,
      notes: row.notes,
      sizeBytes: row.sizeBytes,
      sha256: row.sha256,
      publishedAt: row.createdAt,
      downloadPath: `/releases/${row.platform}/download`,
    };
  }

  private async assertValidFile(
    platform: ReleasePlatform,
    file: UploadedFile,
  ): Promise<void> {
    const rule = PLATFORM_RULES[platform];
    if (!file.originalname.toLowerCase().endsWith(rule.extension)) {
      throw new BadRequestException(
        `Para ${platform} el archivo debe ser un ${rule.extension}`,
      );
    }
    if (file.size === 0) {
      throw new BadRequestException('El archivo está vacío');
    }
    if (rule.magic) {
      const handle = await fs.open(file.path, 'r');
      try {
        const head = Buffer.alloc(rule.magic.length);
        await handle.read(head, 0, head.length, 0);
        if (!head.equals(rule.magic)) {
          throw new BadRequestException(
            `El archivo no es un ${rule.extension} válido`,
          );
        }
      } finally {
        await handle.close();
      }
    }
  }

  private hashFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = createHash('sha256');
      createReadStream(path)
        .on('data', (chunk) => hash.update(chunk))
        .on('error', reject)
        .on('end', () => resolve(hash.digest('hex')));
    });
  }
}

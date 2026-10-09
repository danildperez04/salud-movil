import { createReadStream, promises as fs } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Readable } from 'node:stream';

/**
 * Dónde viven los archivos instalables. El resto del módulo solo conoce esta
 * clase: para guardarlos en S3 o Supabase Storage basta otra implementación y
 * cambiar el `useFactory` en `ReleasesModule`.
 */
export abstract class ReleaseStorage {
  /** Mueve un archivo temporal ya subido al almacenamiento definitivo. */
  abstract put(tempPath: string, key: string): Promise<void>;
  /** Abre el archivo para descargarlo. Falla si no existe. */
  abstract open(key: string): Promise<Readable>;
  /** Borra el archivo. No falla si ya no existe. */
  abstract remove(key: string): Promise<void>;
}

/** Claves que genera la propia API (`<uuid>.<ext>`); cualquier otra se rechaza. */
const SAFE_KEY = /^[0-9a-f-]{36}\.[a-z0-9]{2,5}$/;

export class LocalReleaseStorage extends ReleaseStorage {
  private readonly root: string;

  constructor(root: string) {
    super();
    this.root = resolve(root);
  }

  /** Carpeta donde multer deja la subida antes de validarla; mismo disco que `root`. */
  get tempDir(): string {
    return join(this.root, '.tmp');
  }

  async put(tempPath: string, key: string): Promise<void> {
    await fs.mkdir(this.root, { recursive: true });
    const target = this.pathFor(key);
    try {
      await fs.rename(tempPath, target);
    } catch (error) {
      // `.tmp` y `root` están en el mismo volumen, así que esto solo ocurre si
      // alguien monta `.tmp` aparte. Se copia y se borra el temporal.
      if ((error as NodeJS.ErrnoException).code !== 'EXDEV') throw error;
      await fs.copyFile(tempPath, target);
      await fs.unlink(tempPath);
    }
  }

  async open(key: string): Promise<Readable> {
    const path = this.pathFor(key);
    await fs.access(path);
    return createReadStream(path);
  }

  async remove(key: string): Promise<void> {
    await fs.rm(this.pathFor(key), { force: true });
  }

  private pathFor(key: string): string {
    if (!SAFE_KEY.test(key)) {
      throw new Error(`Clave de almacenamiento inválida: ${key}`);
    }
    return join(this.root, key);
  }
}

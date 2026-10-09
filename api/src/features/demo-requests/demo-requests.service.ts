import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, MoreThan, Repository } from 'typeorm';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto';
import { ListDemoRequestsQueryDto } from './dto/list-demo-requests-query.dto';
import { UpdateDemoRequestDto } from './dto/update-demo-request.dto';
import { DemoRequest } from './entities/demo-request.entity';
import {
  DEMO_REQUEST_STATUSES,
  type DemoRequestStatus,
} from './demo-request-status';

export interface DemoRequestPage {
  items: DemoRequest[];
  total: number;
  page: number;
  pageSize: number;
}

/** Cuántas solicitudes hay en cada estado (incluye los que están en cero). */
export type DemoRequestStats = Record<DemoRequestStatus, number>;

const DEFAULT_PAGE_SIZE = 20;
/** Ventana en la que un mismo correo no genera una segunda solicitud pendiente. */
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class DemoRequestsService {
  private readonly logger = new Logger(DemoRequestsService.name);

  constructor(
    @InjectRepository(DemoRequest)
    private readonly requests: Repository<DemoRequest>,
  ) {}

  /**
   * Registra una solicitud pública. Nunca revela si se guardó o se descartó
   * (señuelo lleno, correo repetido): el visitante siempre ve el mismo éxito.
   */
  async createPublic(dto: CreateDemoRequestDto): Promise<void> {
    if (dto.website) {
      this.logger.warn('Solicitud de demo descartada: el señuelo traía datos');
      return;
    }

    const email = dto.email.toLowerCase();
    const duplicate = await this.requests.existsBy({
      email,
      status: 'pending',
      createdAt: MoreThan(new Date(Date.now() - DUPLICATE_WINDOW_MS)),
    });
    if (duplicate) return;

    const saved = await this.requests.save(
      this.requests.create({
        name: dto.name,
        email,
        organization: dto.organization,
        jobTitle: dto.jobTitle ?? null,
        phoneNumber: dto.phoneNumber ?? null,
        message: dto.message ?? null,
      }),
    );
    // Solo el id: el log no debe llevar datos personales.
    this.logger.log(`Nueva solicitud de demo ${saved.id}`);
  }

  async findAll(query: ListDemoRequestsQueryDto): Promise<DemoRequestPage> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;

    const qb = this.requests
      .createQueryBuilder('r')
      .orderBy('r.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (query.status) {
      qb.andWhere('r.status = :status', { status: query.status });
    }
    const search = query.search?.trim();
    if (search) {
      // `%`, `_` y `\` del texto buscado son literales, no comodines.
      const pattern = `%${search.replace(/[\\%_]/g, '\\$&')}%`;
      qb.andWhere(
        new Brackets((where) => {
          where
            .where('r.name ILIKE :pattern', { pattern })
            .orWhere('r.email ILIKE :pattern', { pattern })
            .orWhere('r.organization ILIKE :pattern', { pattern });
        }),
      );
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, pageSize };
  }

  async stats(): Promise<DemoRequestStats> {
    const rows = await this.requests
      .createQueryBuilder('r')
      .select('r.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('r.status')
      .getRawMany<{ status: DemoRequestStatus; count: string }>();

    const stats = Object.fromEntries(
      DEMO_REQUEST_STATUSES.map((status) => [status, 0]),
    ) as DemoRequestStats;
    for (const row of rows) stats[row.status] = Number(row.count);
    return stats;
  }

  async update(id: string, dto: UpdateDemoRequestDto): Promise<DemoRequest> {
    const request = await this.getOrFail(id);
    if (dto.status !== undefined) request.status = dto.status;
    if (dto.adminNotes !== undefined) {
      request.adminNotes = dto.adminNotes || null;
    }
    return this.requests.save(request);
  }

  async remove(id: string): Promise<void> {
    const request = await this.getOrFail(id);
    await this.requests.remove(request);
  }

  private async getOrFail(id: string): Promise<DemoRequest> {
    const request = await this.requests.findOneBy({ id });
    if (!request) throw new NotFoundException('Solicitud no encontrada');
    return request;
  }
}

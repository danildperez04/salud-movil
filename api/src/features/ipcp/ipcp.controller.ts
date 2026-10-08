import { Controller, Get, Param, Query, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IpcpService, IpcpBatchFilters, IpcpBatchResult } from './ipcp.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';
import { User } from '../users/entities/user.entity';
import { HealthcareWorker } from '../users/entities/healthcare-worker.entity';

/**
 * Montado sobre `patients` como el resto de sub-recursos de un paciente, para
 * que el panel y el móvil usen el mismo prefijo que citas o indicadores.
 *
 * `me/ipcp` se declara antes que `:id/ipcp` porque, al revés, `:id` se tragaría
 * el literal `me`. Es el mismo orden que usa `health-indicators`.
 */
@Controller('patients')
export class IpcpController {
  constructor(
    private readonly ipcpService: IpcpService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(HealthcareWorker)
    private readonly healthcareWorkerRepository: Repository<HealthcareWorker>,
  ) {}

  /** IPCP del propio paciente (HU-34; la pantalla es de jarey). */
  @Get('me/ipcp')
  @Roles('patient')
  forSelf(@CurrentUser() currentUser: JwtPayload) {
    return this.ipcpService.forSelf(currentUser);
  }

  /** IPCP de un paciente (HU-32, HU-33). */
  @Get(':id/ipcp')
  @Roles('admin', 'health_staff')
  forPatient(
    @Param('id') patientId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.ipcpService.forPatient(patientId, currentUser);
  }

  /** Lista paginada de IPCP con filtros (HU-32, HU-33 - listado). */
  @Get('ipcp')
  @Roles('admin', 'health_staff')
  async getBatch(
    @CurrentUser() currentUser: JwtPayload,
    @Query('level') level?: 'high' | 'moderate' | 'low',
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'score' | 'level' | 'name',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<IpcpBatchResult> {
    // Solo admin ve todo; health_staff solo su centro
    let centerId: string | undefined;
    if (currentUser.role !== 'admin') {
      const worker = await this.healthcareWorkerRepository.findOne({
        where: { id: currentUser.sub },
        relations: { healthCenter: true },
      });
      centerId = worker?.healthCenter?.id;
      if (!centerId) {
        throw new ForbiddenException(
          'El personal de salud debe pertenecer a un centro de salud',
        );
      }
    }

    return this.ipcpService.getBatch({
      level,
      search,
      centerId,
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }
}

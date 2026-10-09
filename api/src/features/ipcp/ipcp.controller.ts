import { Controller, Get, Param, Query } from '@nestjs/common';
import { IpcpService } from './ipcp.service';
import { IpcpBatchQueryDto } from './dto/ipcp-batch-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

/**
 * Montado sobre `patients` como el resto de sub-recursos de un paciente, para
 * que el panel y el móvil usen el mismo prefijo que citas o indicadores.
 *
 * El orden de las rutas importa: `me/ipcp` e `ipcp` son literales y se
 * declaran antes que `:id/ipcp`, porque al revés `:id` se comería `me`. Es el
 * mismo criterio que usa `health-indicators`. Fuera de este controlador hay un
 * orden que cuidar también: `GET /patients/ipcp` compite con
 * `GET /patients/:id` de `PatientsController`, y Express resuelve por orden de
 * registro, así que `IpcpModule` debe importarse antes que `PatientsModule`
 * en `AppModule` (ahí está comentado). El e2e `test/ipcp.e2e-spec.ts` bloquea
 * esa regresión.
 */
@Controller('patients')
export class IpcpController {
  constructor(private readonly ipcpService: IpcpService) {}

  /** IPCP del propio paciente (HU-34; la pantalla es de jarey). */
  @Get('me/ipcp')
  @Roles('patient')
  forSelf(@CurrentUser() currentUser: JwtPayload) {
    return this.ipcpService.forSelf(currentUser);
  }

  /** Listado paginado de IPCP con filtros (HU-32, HU-33). */
  @Get('ipcp')
  @Roles('admin', 'health_staff')
  getBatch(
    @CurrentUser() currentUser: JwtPayload,
    @Query() query: IpcpBatchQueryDto,
  ) {
    return this.ipcpService.getBatchForUser(currentUser, query);
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
}

import { Controller, Get, Param } from '@nestjs/common';
import { IpcpService } from './ipcp.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

/**
 * Montado sobre `patients` como el resto de sub-recursos de un paciente, para
 * que el panel y el móvil usen el mismo prefijo que citas o indicadores.
 *
 * `me/ipcp` se declara antes que `:id/ipcp` porque, al revés, `:id` se tragaría
 * el literal `me`. Es el mismo orden que usa `health-indicators`.
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

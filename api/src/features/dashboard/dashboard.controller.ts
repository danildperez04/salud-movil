import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /** Sustituye a los contadores que el panel tenía inventados. */
  @Get('stats')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Estadísticas del panel para admin o personal de salud',
  })
  @ApiResponse({
    status: 200,
    description: 'Contadores: pacientes, personal, citas, etc.',
  })
  stats(@CurrentUser() currentUser: JwtPayload) {
    return this.dashboardService.stats(currentUser);
  }
}

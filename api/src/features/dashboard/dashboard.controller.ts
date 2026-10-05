import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /** Sustituye a los contadores que el panel tenía inventados. */
  @Get('stats')
  @Roles('admin', 'health_staff')
  stats(@CurrentUser() currentUser: JwtPayload) {
    return this.dashboardService.stats(currentUser);
  }
}

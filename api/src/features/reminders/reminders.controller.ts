import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RemindersService } from './reminders.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@ApiTags('reminders')
@ApiBearerAuth()
@Controller('patients')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get('me/reminders')
  @Roles('patient')
  @ApiOperation({
    summary: 'Listar recordatorios próximos del paciente autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Recordatorios dentro de la ventana (días por defecto 7).',
  })
  listForMe(
    @CurrentUser() currentUser: JwtPayload,
    @Query('windowDays') windowDays?: string,
  ) {
    return this.remindersService.listForMe(
      currentUser,
      this.parseWindow(windowDays),
    );
  }

  @Get(':id/reminders')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Listar recordatorios de un paciente (personal o admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Recordatorios dentro de la ventana solicitada.',
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  listForPatient(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Query('windowDays') windowDays?: string,
  ) {
    return this.remindersService.listForPatient(
      id,
      currentUser,
      this.parseWindow(windowDays),
    );
  }

  private parseWindow(windowDays?: string): number | undefined {
    if (windowDays === undefined) {
      return undefined;
    }
    const parsed = parseInt(windowDays, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
}

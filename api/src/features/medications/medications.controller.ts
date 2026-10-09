import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@ApiTags('medications')
@ApiBearerAuth()
@Controller('patients')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  // === Paciente (HU-24/26) ===

  @Get('me/medications')
  @Roles('patient')
  @ApiOperation({ summary: 'Listar medicamentos del paciente autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Medicamentos del paciente con sus recordatorios.',
  })
  listForMe(@CurrentUser() currentUser: JwtPayload) {
    return this.medicationsService.listForMe(currentUser);
  }

  @Post('me/medications/:medicationId/reminders/:reminderId/confirm')
  @Roles('patient')
  @ApiOperation({
    summary: 'Confirmar la toma de un recordatorio de medicamento (paciente)',
  })
  @ApiResponse({ status: 200, description: 'Recordatorio confirmado.' })
  @ApiResponse({
    status: 404,
    description: 'Medicamento o recordatorio no encontrado.',
  })
  confirmReminder(
    @Param('medicationId') medicationId: string,
    @Param('reminderId') reminderId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.medicationsService.confirmReminder(
      currentUser,
      medicationId,
      reminderId,
    );
  }

  // === Personal / Admin (HU-21/22/23) ===

  @Post(':id/medications')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Crear un medicamento para un paciente (personal o admin)',
  })
  @ApiResponse({
    status: 201,
    description: 'Medicamento creado con sus recordatorios.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o paciente no encontrado.',
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  create(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateMedicationDto,
  ) {
    return this.medicationsService.create(id, currentUser, dto);
  }

  @Get(':id/medications')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Listar medicamentos de un paciente (personal o admin)',
  })
  @ApiResponse({ status: 200, description: 'Medicamentos con recordatorios.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  list(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.medicationsService.list(id, currentUser);
  }

  @Patch(':id/medications/:medicationId')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Actualizar un medicamento de un paciente (personal o admin)',
  })
  @ApiResponse({ status: 200, description: 'Medicamento actualizado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({
    status: 404,
    description: 'Medicamento o paciente no encontrado.',
  })
  update(
    @Param('id') id: string,
    @Param('medicationId') medicationId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateMedicationDto,
  ) {
    return this.medicationsService.update(id, medicationId, currentUser, dto);
  }

  @Delete(':id/medications/:medicationId')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Eliminar un medicamento de un paciente (personal o admin)',
  })
  @ApiResponse({ status: 200, description: 'Medicamento eliminado.' })
  @ApiResponse({
    status: 404,
    description: 'Medicamento o paciente no encontrado.',
  })
  remove(
    @Param('id') id: string,
    @Param('medicationId') medicationId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.medicationsService.remove(id, medicationId, currentUser);
  }
}

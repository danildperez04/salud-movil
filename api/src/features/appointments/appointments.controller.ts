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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { UpdateAppointmentStateDto } from './dto/update-appointment-state.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('patients')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // === Paciente (HU-18/19) ===

  @Get('me/appointments/upcoming')
  @Roles('patient')
  @ApiOperation({ summary: 'Listar citas próximas del paciente autenticado' })
  @ApiResponse({ status: 200, description: 'Citas próximas del paciente.' })
  myUpcoming(@CurrentUser() currentUser: JwtPayload) {
    return this.appointmentsService.myUpcoming(currentUser);
  }

  @Post(':id/appointments')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Crear una cita para un paciente (personal o admin)',
  })
  @ApiResponse({ status: 201, description: 'Cita creada.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos, horario ocupado o paciente no encontrado.',
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  create(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(id, currentUser, dto);
  }

  @Get(':id/appointments')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Listar todas las citas de un paciente (personal o admin)',
  })
  @ApiResponse({ status: 200, description: 'Listado de citas del paciente.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  list(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.appointmentsService.list(id, currentUser);
  }

  @Get(':id/appointments/upcoming')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Listar citas próximas de un paciente (personal o admin)',
  })
  @ApiResponse({ status: 200, description: 'Citas próximas del paciente.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  upcoming(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.appointmentsService.upcoming(id, currentUser);
  }

  @Patch(':id/appointments/:appointmentId')
  @Roles('admin', 'health_staff')
  @ApiOperation({ summary: 'Actualizar una cita (personal o admin)' })
  @ApiResponse({ status: 200, description: 'Cita actualizada.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o conflicto de horario.',
  })
  @ApiResponse({ status: 404, description: 'Cita o paciente no encontrado.' })
  update(
    @Param('id') id: string,
    @Param('appointmentId') appointmentId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, appointmentId, currentUser, dto);
  }

  @Delete(':id/appointments/:appointmentId')
  @Roles('admin', 'health_staff')
  @ApiOperation({ summary: 'Eliminar una cita (personal o admin)' })
  @ApiResponse({ status: 200, description: 'Cita eliminada.' })
  @ApiResponse({ status: 404, description: 'Cita o paciente no encontrado.' })
  remove(
    @Param('id') id: string,
    @Param('appointmentId') appointmentId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.appointmentsService.remove(id, appointmentId, currentUser);
  }

  @Post(':id/appointments/:appointmentId/cancel')
  @Roles('admin', 'health_staff')
  @ApiOperation({ summary: 'Cancelar una cita con motivo (personal o admin)' })
  @ApiResponse({ status: 200, description: 'Cita cancelada.' })
  @ApiResponse({ status: 400, description: 'Motivo inválido.' })
  @ApiResponse({ status: 404, description: 'Cita o paciente no encontrado.' })
  cancel(
    @Param('id') id: string,
    @Param('appointmentId') appointmentId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CancelAppointmentDto,
  ) {
    return this.appointmentsService.cancel(id, appointmentId, currentUser, dto);
  }

  @Patch(':id/appointments/:appointmentId/state')
  @Roles('admin', 'health_staff')
  @ApiOperation({ summary: 'Cambiar el estado de una cita (personal o admin)' })
  @ApiResponse({ status: 200, description: 'Estado de la cita actualizado.' })
  @ApiResponse({
    status: 400,
    description: 'Estado inválido o transición no permitida.',
  })
  @ApiResponse({ status: 404, description: 'Cita o paciente no encontrado.' })
  changeState(
    @Param('id') id: string,
    @Param('appointmentId') appointmentId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateAppointmentStateDto,
  ) {
    return this.appointmentsService.changeState(
      id,
      appointmentId,
      currentUser,
      dto,
    );
  }
}

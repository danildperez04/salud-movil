import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { UpdateAppointmentStateDto } from './dto/update-appointment-state.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@Controller('patients')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // === Paciente (HU-18/19) ===

  @Get('me/appointments/upcoming')
  @Roles('patient')
  myUpcoming(@CurrentUser() currentUser: JwtPayload) {
    return this.appointmentsService.myUpcoming(currentUser);
  }

  @Post(':id/appointments')
  @Roles('admin', 'health_staff')
  create(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(id, currentUser, dto);
  }

  @Get(':id/appointments')
  @Roles('admin', 'health_staff')
  list(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.appointmentsService.list(id, currentUser);
  }

  @Get(':id/appointments/upcoming')
  @Roles('admin', 'health_staff')
  upcoming(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.appointmentsService.upcoming(id, currentUser);
  }

  @Patch(':id/appointments/:appointmentId')
  @Roles('admin', 'health_staff')
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
  remove(
    @Param('id') id: string,
    @Param('appointmentId') appointmentId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.appointmentsService.remove(id, appointmentId, currentUser);
  }

  @Post(':id/appointments/:appointmentId/cancel')
  @Roles('admin', 'health_staff')
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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { AppointmentReminder } from './entities/appointment-reminder.entity';
import { AppointmentState } from '../catalogues/entities/appointment-state.entity';
import { AppointmentType } from '../catalogues/entities/appointment-type.entity';
import { NotificationState } from '../catalogues/entities/notification-state.entity';
import { HealthcareWorker } from '../users/entities/healthcare-worker.entity';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      AppointmentReminder,
      AppointmentState,
      AppointmentType,
      NotificationState,
      HealthcareWorker,
    ]),
    PatientsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}

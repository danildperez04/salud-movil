import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { MedicationReminder } from '../medications/entities/medication-reminder.entity';
import { AppointmentReminder } from '../appointments/entities/appointment-reminder.entity';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicationReminder, AppointmentReminder]),
    PatientsModule,
  ],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}

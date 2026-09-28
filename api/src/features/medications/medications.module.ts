import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { Medication } from './entities/medication.entity';
import { MedicationSchedule } from './entities/medication-schedule.entity';
import { MedicationScheduleDay } from './entities/medication-schedule-day.entity';
import { MedicationReminder } from './entities/medication-reminder.entity';
import { RouteAdministration } from '../catalogues/entities/route-administration.entity';
import { NotificationState } from '../catalogues/entities/notification-state.entity';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medication,
      MedicationSchedule,
      MedicationScheduleDay,
      MedicationReminder,
      RouteAdministration,
      NotificationState,
    ]),
    PatientsModule,
  ],
  controllers: [MedicationsController],
  providers: [MedicationsService],
})
export class MedicationsModule {}

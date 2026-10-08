import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { IpcpController } from './ipcp.controller';
import { IpcpService } from './ipcp.service';
import { HealthIndicator } from '../health-indicators/entities/health-indicator.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { MedicationReminder } from '../medications/entities/medication-reminder.entity';
import { MedicationSchedule } from '../medications/entities/medication-schedule.entity';
import { ClinicalRange } from '../catalogues/entities/clinical-range.entity';
import { ClinicalRangeBand } from '../catalogues/entities/clinical-range-band.entity';
import { ClinicalRangeBandsService } from '../catalogues/clinical-range-bands.service';
import { PatientsModule } from '../patients/patients.module';
import { User } from '../users/entities/user.entity';
import { Patient } from '../users/entities/patient.entity';
import { TypeIndicator } from '../catalogues/entities/type-indicator.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CacheModule.register({
      ttl: 3600,
      max: 1000,
    }),
    TypeOrmModule.forFeature([
      HealthIndicator,
      Appointment,
      MedicationReminder,
      MedicationSchedule,
      ClinicalRange,
      ClinicalRangeBand,
      User,
      Patient,
      TypeIndicator,
    ]),
    PatientsModule,
  ],
  controllers: [IpcpController],
  providers: [IpcpService, ClinicalRangeBandsService],
})
export class IpcpModule {}

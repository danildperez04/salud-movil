import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Patient } from '../users/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { MedicationReminder } from '../medications/entities/medication-reminder.entity';
import { ClinicalRange } from '../catalogues/entities/clinical-range.entity';
import { ClinicalRangeBand } from '../catalogues/entities/clinical-range-band.entity';
import { ClinicalRangeBandsService } from '../catalogues/clinical-range-bands.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      User,
      Appointment,
      MedicationReminder,
      ClinicalRange,
      ClinicalRangeBand,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, ClinicalRangeBandsService],
})
export class DashboardModule {}

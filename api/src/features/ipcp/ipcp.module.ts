import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HealthIndicator,
      Appointment,
      MedicationReminder,
      MedicationSchedule,
      ClinicalRange,
      ClinicalRangeBand,
    ]),
    // El scoping por centro de salud no se reimplementa: se reutiliza
    // `PatientsService.findRecordForScope()`, que ya responde 404 —no 403—
    // fuera del centro del usuario.
    PatientsModule,
  ],
  controllers: [IpcpController],
  providers: [IpcpService, ClinicalRangeBandsService],
})
export class IpcpModule {}

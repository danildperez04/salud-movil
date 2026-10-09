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
import { Patient } from '../users/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { IPCP_CACHE_TTL_MS } from './ipcp.constants';

@Module({
  imports: [
    // El cron de `recalculateAllIpcp` es el que mantiene precalculado el
    // índice; sin ScheduleModule no corre y la primera carga del panel paga
    // el cálculo completo.
    ScheduleModule.forRoot(),
    // `ttl` va en **milisegundos** (así lo documenta `CacheModuleOptions`):
    // 3600 aquí serían 3,6 segundos, no una hora.
    CacheModule.register({ ttl: IPCP_CACHE_TTL_MS }),
    TypeOrmModule.forFeature([
      HealthIndicator,
      Appointment,
      MedicationReminder,
      MedicationSchedule,
      ClinicalRange,
      ClinicalRangeBand,
      Patient,
      User,
    ]),
    // El scoping por centro no se reimplementa: se reutiliza
    // `PatientsService.findRecordForScope()` en las rutas de un paciente.
    PatientsModule,
  ],
  controllers: [IpcpController],
  providers: [IpcpService, ClinicalRangeBandsService],
  exports: [IpcpService],
})
export class IpcpModule {}

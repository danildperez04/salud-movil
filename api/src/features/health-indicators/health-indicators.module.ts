import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthIndicatorsController } from './health-indicators.controller';
import { HealthIndicatorsService } from './health-indicators.service';
import { HealthIndicator } from './entities/health-indicator.entity';
import { TypeIndicator } from '../catalogues/entities/type-indicator.entity';
import { ClinicalRange } from '../catalogues/entities/clinical-range.entity';
import { ClinicalRangeBand } from '../catalogues/entities/clinical-range-band.entity';
import { ClinicalRangeBandsService } from '../catalogues/clinical-range-bands.service';
import { User } from '../users/entities/user.entity';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HealthIndicator,
      TypeIndicator,
      ClinicalRange,
      ClinicalRangeBand,
      User,
    ]),
    PatientsModule,
  ],
  controllers: [HealthIndicatorsController],
  providers: [HealthIndicatorsService, ClinicalRangeBandsService],
  exports: [ClinicalRangeBandsService],
})
export class HealthIndicatorsModule {}

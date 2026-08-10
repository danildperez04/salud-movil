import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecord } from './entities/medical-record.entity';
import { MedicalVisit } from './entities/medical-visit.entity';
import { HealthcareWorker } from '../users/entities/healthcare-worker.entity';
import { User } from '../users/entities/user.entity';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MedicalRecord,
      MedicalVisit,
      HealthcareWorker,
      User,
    ]),
    PatientsModule,
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
})
export class MedicalRecordsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Patient } from '../users/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { Caregiver } from '../users/entities/caregiver.entity';
import { PatientCaregiver } from '../users/entities/patient-caregiver.entity';
import { Role } from '../catalogues/entities/role.entity';
import { Municipality } from '../catalogues/entities/municipality.entity';
import { Genre } from '../catalogues/entities/genre.entity';
import { RelationshipType } from '../catalogues/entities/relationship-type.entity';
import { HealthCenter } from '../health-centers/entities/health-center.entity';
import { MedicalRecord } from '../medical-records/entities/medical-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      User,
      Caregiver,
      PatientCaregiver,
      Role,
      Municipality,
      Genre,
      RelationshipType,
      HealthCenter,
      MedicalRecord,
    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CaregiversController } from './caregivers.controller';
import { CaregiversService } from './caregivers.service';
import { User } from './entities/user.entity';
import { HealthcareWorker } from './entities/healthcare-worker.entity';
import { Caregiver } from './entities/caregiver.entity';
import { PatientCaregiver } from './entities/patient-caregiver.entity';
import { Patient } from './entities/patient.entity';
import { Role } from '../catalogues/entities/role.entity';
import { Municipality } from '../catalogues/entities/municipality.entity';
import { Major } from '../catalogues/entities/major.entity';
import { HealthCenter } from '../health-centers/entities/health-center.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      HealthcareWorker,
      Caregiver,
      PatientCaregiver,
      Patient,
      Role,
      Municipality,
      Major,
      HealthCenter,
    ]),
  ],
  controllers: [UsersController, CaregiversController],
  providers: [UsersService, CaregiversService],
})
export class UsersModule {}

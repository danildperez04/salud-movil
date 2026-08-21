import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Role } from '../features/catalogues/entities/role.entity';
import { Genre } from '../features/catalogues/entities/genre.entity';
import { Major } from '../features/catalogues/entities/major.entity';
import { HealthCenterType } from '../features/catalogues/entities/health-center-type.entity';
import { Department } from '../features/catalogues/entities/department.entity';
import { Municipality } from '../features/catalogues/entities/municipality.entity';
import { HealthCenter } from '../features/health-centers/entities/health-center.entity';
import { User } from '../features/users/entities/user.entity';
import { HealthcareWorker } from '../features/users/entities/healthcare-worker.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Genre,
      Major,
      HealthCenterType,
      Department,
      Municipality,
      HealthCenter,
      User,
      HealthcareWorker,
    ]),
  ],
  providers: [SeedService],
})
export class DatabaseModule {}

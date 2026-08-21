import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CaregiversController } from './caregivers.controller';
import { User } from './entities/user.entity';
import { HealthcareWorker } from './entities/healthcare-worker.entity';
import { Role } from '../catalogues/entities/role.entity';
import { Municipality } from '../catalogues/entities/municipality.entity';
import { Major } from '../catalogues/entities/major.entity';
import { HealthCenter } from '../health-centers/entities/health-center.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      HealthcareWorker,
      Role,
      Municipality,
      Major,
      HealthCenter,
    ]),
  ],
  controllers: [UsersController, CaregiversController],
  providers: [UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogueController } from './catalogue.controller';
import { CatalogueService } from './catalogue.service';
import { Genre } from './entities/genre.entity';
import { RelationshipType } from './entities/relationship-type.entity';
import { Major } from './entities/major.entity';
import { Department } from './entities/department.entity';
import { Municipality } from './entities/municipality.entity';
import { HealthCenter } from '../health-centers/entities/health-center.entity';
import { TypeIndicator } from './entities/type-indicator.entity';
import { AppointmentState } from './entities/appointment-state.entity';
import { AppointmentType } from './entities/appointment-type.entity';
import { NotificationState } from './entities/notification-state.entity';
import { RouteAdministration } from './entities/route-administration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Genre,
      RelationshipType,
      Major,
      Department,
      Municipality,
      HealthCenter,
      TypeIndicator,
      AppointmentState,
      AppointmentType,
      NotificationState,
      RouteAdministration,
    ]),
  ],
  controllers: [CatalogueController],
  providers: [CatalogueService],
})
export class CatalogueModule {}

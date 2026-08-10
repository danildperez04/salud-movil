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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Genre,
      RelationshipType,
      Major,
      Department,
      Municipality,
      HealthCenter,
    ]),
  ],
  controllers: [CatalogueController],
  providers: [CatalogueService],
})
export class CatalogueModule {}

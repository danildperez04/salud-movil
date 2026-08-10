import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { RelationshipType } from './entities/relationship-type.entity';
import { Major } from './entities/major.entity';
import { HealthCenter } from '../health-centers/entities/health-center.entity';
import { Municipality } from './entities/municipality.entity';

@Injectable()
export class CatalogueService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(RelationshipType)
    private readonly relationshipTypeRepository: Repository<RelationshipType>,
    @InjectRepository(Major)
    private readonly majorRepository: Repository<Major>,
    @InjectRepository(HealthCenter)
    private readonly healthCenterRepository: Repository<HealthCenter>,
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
  ) {}

  async genres(): Promise<{ id: number; name: string }[]> {
    return this.genreRepository.find({ order: { id: 'ASC' } });
  }

  async relationshipTypes(): Promise<{ id: number; name: string }[]> {
    return this.relationshipTypeRepository.find({ order: { id: 'ASC' } });
  }

  async majors(): Promise<{ id: number; name: string }[]> {
    return this.majorRepository.find({ order: { id: 'ASC' } });
  }

  async healthCenters(): Promise<{ id: string; name: string }[]> {
    return this.healthCenterRepository.find({
      select: { id: true, name: true },
      order: { name: 'ASC' },
    });
  }

  async municipalities(
    departmentId?: number,
  ): Promise<{ id: number; name: string }[]> {
    return this.municipalityRepository.find({
      where: departmentId ? { department: { id: departmentId } } : {},
      order: { name: 'ASC' },
    });
  }
}

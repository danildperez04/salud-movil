import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { RelationshipType } from './entities/relationship-type.entity';
import { Major } from './entities/major.entity';
import { Department } from './entities/department.entity';
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
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(HealthCenter)
    private readonly healthCenterRepository: Repository<HealthCenter>,
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
  ) {}

  async departments(): Promise<{ id: number; name: string }[]> {
    return this.departmentRepository.find({ order: { name: 'ASC' } });
  }

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
  ): Promise<{ id: number; name: string; departmentId: number }[]> {
    const municipalities = await this.municipalityRepository.find({
      where: departmentId ? { department: { id: departmentId } } : {},
      relations: { department: true },
      order: { name: 'ASC' },
    });
    return municipalities.map((municipality) => ({
      id: municipality.id,
      name: municipality.name,
      departmentId: municipality.department.id,
    }));
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { RelationshipType } from './entities/relationship-type.entity';
import { Major } from './entities/major.entity';
import { Department } from './entities/department.entity';
import { HealthCenter } from '../health-centers/entities/health-center.entity';
import { Municipality } from './entities/municipality.entity';
import { TypeIndicator } from './entities/type-indicator.entity';
import { AppointmentState } from './entities/appointment-state.entity';
import { AppointmentType } from './entities/appointment-type.entity';
import { NotificationState } from './entities/notification-state.entity';
import { RouteAdministration } from './entities/route-administration.entity';

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
    @InjectRepository(TypeIndicator)
    private readonly typeIndicatorRepository: Repository<TypeIndicator>,
    @InjectRepository(AppointmentState)
    private readonly appointmentStateRepository: Repository<AppointmentState>,
    @InjectRepository(AppointmentType)
    private readonly appointmentTypeRepository: Repository<AppointmentType>,
    @InjectRepository(NotificationState)
    private readonly notificationStateRepository: Repository<NotificationState>,
    @InjectRepository(RouteAdministration)
    private readonly routeAdministrationRepository: Repository<RouteAdministration>,
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

  async typeIndicators(): Promise<
    { id: number; name: string; measurementUnit: string }[]
  > {
    return this.typeIndicatorRepository.find({ order: { id: 'ASC' } });
  }

  async appointmentStates(): Promise<{ id: number; name: string }[]> {
    return this.appointmentStateRepository.find({ order: { id: 'ASC' } });
  }

  async appointmentTypes(): Promise<{ id: number; name: string }[]> {
    return this.appointmentTypeRepository.find({ order: { id: 'ASC' } });
  }

  async notificationStates(): Promise<{ id: number; name: string }[]> {
    return this.notificationStateRepository.find({ order: { id: 'ASC' } });
  }

  async routeAdministrations(): Promise<{ id: number; name: string }[]> {
    return this.routeAdministrationRepository.find({ order: { id: 'ASC' } });
  }
}

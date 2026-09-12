import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../features/catalogues/entities/role.entity';
import { Genre } from '../features/catalogues/entities/genre.entity';
import { Major } from '../features/catalogues/entities/major.entity';
import { HealthCenterType } from '../features/catalogues/entities/health-center-type.entity';
import { RelationshipType } from '../features/catalogues/entities/relationship-type.entity';
import { Department } from '../features/catalogues/entities/department.entity';
import { Municipality } from '../features/catalogues/entities/municipality.entity';
import { HealthCenter } from '../features/health-centers/entities/health-center.entity';
import { User } from '../features/users/entities/user.entity';
import { HealthcareWorker } from '../features/users/entities/healthcare-worker.entity';
import {
  ROLES,
  GENRES,
  MAJORS,
  HEALTH_CENTER_TYPES,
  RELATIONSHIP_TYPES,
  DEPARTMENTS,
} from './seed-data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seed();
  }

  async seed(): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await this.seedCatalogues(manager);
      await this.seedHealthCenter(manager);
      await this.seedAdmin(manager);
      await this.seedPersonnel(manager);
    });

    this.logger.log('Semillas de datos aplicadas correctamente');
  }

  private async seedCatalogues(manager: EntityManager): Promise<void> {
    if ((await manager.count(Role)) === 0) {
      await manager.save(
        Role,
        ROLES.map((r) => ({ name: r.name, code: r.code })),
      );
    }
    if ((await manager.count(Genre)) === 0) {
      await manager.save(
        Genre,
        GENRES.map((name) => ({ name })),
      );
    }
    if ((await manager.count(Major)) === 0) {
      await manager.save(
        Major,
        MAJORS.map((name) => ({ name })),
      );
    }
    if ((await manager.count(HealthCenterType)) === 0) {
      await manager.save(
        HealthCenterType,
        HEALTH_CENTER_TYPES.map((name) => ({ name })),
      );
    }
    if ((await manager.count(RelationshipType)) === 0) {
      await manager.save(
        RelationshipType,
        RELATIONSHIP_TYPES.map((name) => ({ name })),
      );
    }

    if ((await manager.count(Department)) === 0) {
      for (const department of DEPARTMENTS) {
        const saved = await manager.save(Department, {
          name: department.name,
        });
        await manager.save(
          Municipality,
          department.municipalities.map((name) => ({
            name,
            department: saved,
          })),
        );
      }
    }
  }

  private async seedHealthCenter(manager: EntityManager): Promise<void> {
    if ((await manager.count(HealthCenter)) > 0) {
      return;
    }
    const municipality = await manager.findOne(Municipality, {
      where: { name: 'Managua' },
    });
    const type = await manager.findOne(HealthCenterType, {
      where: { name: 'Centro de Salud' },
    });
    if (!municipality || !type) {
      throw new Error(
        'No se encontró el municipio o el tipo de centro para el seed',
      );
    }
    await manager.save(HealthCenter, {
      name:
        this.configService.get<string>('SEED_HEALTH_CENTER_NAME') ??
        'Centro de Salud Carlos Núñez Téllez',
      address: 'Managua',
      phoneNumber: '2255-0000',
      municipality,
      healthCenterType: type,
    });
  }

  private async seedAdmin(manager: EntityManager): Promise<void> {
    const role = await manager.findOne(Role, { where: { code: 'admin' } });
    if (!role) {
      throw new Error('No se encontró el rol admin para el seed');
    }
    const existing = await manager.findOne(User, {
      where: { role: { id: role.id } },
    });
    if (existing) {
      return;
    }
    const municipality = await manager.findOne(Municipality, {
      where: { name: 'Managua' },
    });
    if (!municipality) {
      throw new Error('No se encontró el municipio para el seed del admin');
    }
    const email =
      this.configService.get<string>('SEED_ADMIN_EMAIL') ??
      'admin@saludmovil.com';
    const password =
      this.configService.get<string>('SEED_ADMIN_PASSWORD') ?? 'Admin123!';
    await manager.save(User, {
      name: 'Administrador Principal',
      email,
      username: 'admin',
      passwordHash: await bcrypt.hash(password, 10),
      phoneNumber: '0000-0000',
      address: 'Managua',
      role,
      municipality,
    });
    this.logger.log(`Usuario admin creado: ${email} (contraseña: ${password})`);
  }

  private async seedPersonnel(manager: EntityManager): Promise<void> {
    const role = await manager.findOne(Role, {
      where: { code: 'health_staff' },
    });
    if (!role) {
      throw new Error('No se encontró el rol health_staff para el seed');
    }
    const existing = await manager.findOne(User, {
      where: { role: { id: role.id } },
    });
    if (existing) {
      return;
    }
    const municipality = await manager.findOne(Municipality, {
      where: { name: 'Managua' },
    });
    const major = await manager.findOne(Major, {
      where: { name: 'Medicina General' },
    });
    const healthCenter = await manager.findOneBy(HealthCenter, {
      name:
        this.configService.get<string>('SEED_HEALTH_CENTER_NAME') ??
        'Centro de Salud Carlos Núñez Téllez',
    });
    if (!municipality || !major || !healthCenter) {
      throw new Error(
        'No se encontraron los datos de referencia para el seed del personal',
      );
    }
    const email =
      this.configService.get<string>('SEED_PERSONNEL_EMAIL') ??
      'personal@saludmovil.com';
    const password =
      this.configService.get<string>('SEED_PERSONNEL_PASSWORD') ??
      'Personal123!';
    const user = await manager.save(User, {
      name: 'Dr. Ejemplo Pérez',
      email,
      username: 'drperez',
      passwordHash: await bcrypt.hash(password, 10),
      phoneNumber: '8888-8888',
      address: 'Managua',
      role,
      municipality,
    });
    await manager.save(HealthcareWorker, {
      id: user.id,
      licenseNumber: 'LIC-0001',
      employeeId: 'EMP-0001',
      major,
      healthCenter,
      user,
    });
    this.logger.log(
      `Personal de salud de ejemplo creado: ${email} (contraseña: ${password})`,
    );
  }
}

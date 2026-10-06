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
import { TypeIndicator } from '../features/catalogues/entities/type-indicator.entity';
import { AppointmentState } from '../features/catalogues/entities/appointment-state.entity';
import { AppointmentType } from '../features/catalogues/entities/appointment-type.entity';
import { NotificationState } from '../features/catalogues/entities/notification-state.entity';
import { RouteAdministration } from '../features/catalogues/entities/route-administration.entity';
import { ClinicalRange } from '../features/catalogues/entities/clinical-range.entity';
import { ClinicalRangeBand } from '../features/catalogues/entities/clinical-range-band.entity';
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
  TYPE_INDICATORS,
  APPOINTMENT_STATES,
  APPOINTMENT_TYPES,
  NOTIFICATION_STATES,
  ROUTE_ADMINISTRATIONS,
  CLINICAL_RANGES,
  CLINICAL_RANGE_BANDS,
} from './seed-data';

/**
 * Clave del lock consultivo que serializa el seed. Es un entero arbitrario y
 * fijo: solo tiene que coincidir entre procesos de esta aplicación, así que no
 * se usa `hashtext()` (depende de la colación y no es estable).
 */
const SEED_LOCK_KEY = 8_674_321;

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
      // El seed comprueba `count === 0` y después inserta. Con dos procesos
      // arrancando a la vez (los e2e, que levantan la app en paralelo; dos
      // réplicas; un reinicio mientras otro arranca) los dos ven la tabla vacía y
      // los dos insertan, y el segundo muere con violación de clave única.
      //
      // El lock consultivo de transacción serializa a quien siembre: el segundo
      // espera a que el primero confirme, y para entonces los `count` ya nonzero.
      await manager.query('SELECT pg_advisory_xact_lock($1)', [SEED_LOCK_KEY]);

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
    if ((await manager.count(TypeIndicator)) === 0) {
      await manager.save(
        TypeIndicator,
        TYPE_INDICATORS.map((typeIndicator) => ({
          name: typeIndicator.name,
          measurementUnit: typeIndicator.measurementUnit,
        })),
      );
    }
    if ((await manager.count(AppointmentState)) === 0) {
      await manager.save(
        AppointmentState,
        APPOINTMENT_STATES.map((name) => ({ name })),
      );
    }
    if ((await manager.count(AppointmentType)) === 0) {
      await manager.save(
        AppointmentType,
        APPOINTMENT_TYPES.map((name) => ({ name })),
      );
    }
    if ((await manager.count(NotificationState)) === 0) {
      await manager.save(
        NotificationState,
        NOTIFICATION_STATES.map((name) => ({ name })),
      );
    }
    if ((await manager.count(RouteAdministration)) === 0) {
      await manager.save(
        RouteAdministration,
        ROUTE_ADMINISTRATIONS.map((name) => ({ name })),
      );
    }
    if ((await manager.count(ClinicalRange)) === 0) {
      const typeIndicators = await manager.find(TypeIndicator);
      await manager.save(
        ClinicalRange,
        CLINICAL_RANGES.map((range) => {
          const typeIndicator = typeIndicators.find(
            (indicator) => indicator.name === range.typeIndicatorName,
          );
          if (!typeIndicator) {
            throw new Error(
              `No se encontró el tipo de indicador para el rango: ${range.typeIndicatorName}`,
            );
          }
          return {
            typeIndicatorId: typeIndicator.id,
            minValue: range.minValue !== null ? String(range.minValue) : null,
            maxValue: range.maxValue !== null ? String(range.maxValue) : null,
            minValueSecondary:
              range.minValueSecondary !== null
                ? String(range.minValueSecondary)
                : null,
            maxValueSecondary:
              range.maxValueSecondary !== null
                ? String(range.maxValueSecondary)
                : null,
          };
        }),
      );
    }

    if ((await manager.count(ClinicalRangeBand)) === 0) {
      const typeIndicators = await manager.find(TypeIndicator);
      const ranges = await manager.find(ClinicalRange);
      const findRange = (typeIndicatorName: string): ClinicalRange => {
        const typeIndicator = typeIndicators.find(
          (indicator) => indicator.name === typeIndicatorName,
        );
        const range = ranges.find(
          (item) => item.typeIndicatorId === typeIndicator?.id,
        );
        if (!range) {
          throw new Error(
            `No se encontró el rango clínico para: ${typeIndicatorName}`,
          );
        }
        return range;
      };

      // `sequence` ordena la evaluación: 1 = extremo más bajo, y así sucesivamente.
      const lastSequenceByKind = new Map<string, number>();
      const bandRows = CLINICAL_RANGE_BANDS.map((band) => {
        const key = `${band.typeIndicatorName}:${band.valueKind}`;
        const sequence = (lastSequenceByKind.get(key) ?? 0) + 1;
        lastSequenceByKind.set(key, sequence);
        return {
          clinicalRangeId: findRange(band.typeIndicatorName).id,
          sequence,
          severity: band.severity,
          valueKind: band.valueKind,
          minValue: band.minValue !== null ? String(band.minValue) : null,
          maxValue: band.maxValue !== null ? String(band.maxValue) : null,
          label: band.label,
        };
      });
      await manager.save(ClinicalRangeBand, bandRows);
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
    this.logger.log(
      `Usuario admin creado: ${email}${this.suffixPassword(password)}`,
    );
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
      `Personal de salud de ejemplo creado: ${email}${this.suffixPassword(password)}`,
    );
  }

  /**
   * La contraseña de seed solo se escribe en los logs fuera de producción:
   * en Render los logs son públicos para el despliegue y la cuenta seed es real.
   */
  private suffixPassword(password: string): string {
    return process.env.NODE_ENV === 'production'
      ? ''
      : ` (contraseña: ${password})`;
  }
}

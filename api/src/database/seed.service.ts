import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, EntityManager, EntityTarget } from 'typeorm';
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
 * Cuántas bandas declara `seed-data.ts` para un indicador y un `value_kind`.
 * Se usa para saber si ese grupo ya está sembrado por completo, sin depender de
 * que los `sequence` coincidan.
 */
function countBandsFor(typeIndicatorName: string, valueKind: string): number {
  return CLINICAL_RANGE_BANDS.filter(
    (band) =>
      band.typeIndicatorName === typeIndicatorName &&
      band.valueKind === valueKind,
  ).length;
}

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

  /**
   * Inserta únicamente los valores que falten.
   *
   * Antes era `if (count === 0) { guardar todos }`, que es **solo-insertar y
   * nunca reconciliar**: añadir un valor nuevo a `seed-data.ts` no llegaba a
   * ninguna base ya sembrada, porque la tabla nunca volvía a estar vacía. Con
   * los municipios (150) era un fallo fácil de sufrir y difícil de detectar.
   *
   * Ahora se compara por la clave natural de cada tabla, así que el seed sigue
   * sirviendo de red de seguridad y además propaga los cambios. Es idempotente
   * en las dos direcciones: no duplica lo que ya existe ni sobrescribe lo que no.
   */
  private async reconcileNames<T extends { name: string }>(
    manager: EntityManager,
    entity: EntityTarget<T>,
    names: readonly string[],
  ): Promise<void> {
    // Se leen las entidades enteras en lugar de `select: { name: true }`: con un
    // `EntityTarget<T>` genérico, TypeORM no puede validar el literal `select`.
    // Son catálogos pequeños y se ejecutan una vez al arrancar.
    const existing = new Set(
      (await manager.find(entity)).map((row) => row.name),
    );
    const missing = names.filter((name) => !existing.has(name));
    if (missing.length === 0) {
      return;
    }
    await manager.save(
      entity,
      missing.map((name) => ({ name }) as T),
    );
  }

  private async seedCatalogues(manager: EntityManager): Promise<void> {
    // Roles: la identidad es el `code`, no el `name`.
    const roles = await manager.find(Role, { select: { code: true } });
    const missingRoles = ROLES.filter(
      (role) => !roles.some((existing) => existing.code === role.code),
    );
    if (missingRoles.length > 0) {
      await manager.save(Role, missingRoles);
    }

    await this.reconcileNames(manager, Genre, GENRES);
    await this.reconcileNames(manager, Major, MAJORS);
    await this.reconcileNames(manager, HealthCenterType, HEALTH_CENTER_TYPES);
    await this.reconcileNames(manager, RelationshipType, RELATIONSHIP_TYPES);

    // Los tipos de indicador llevan además su unidad, así que no basta el helper.
    const indicators = await manager.find(TypeIndicator, {
      select: { name: true, measurementUnit: true },
    });
    const missingIndicators = TYPE_INDICATORS.filter(
      (type) => !indicators.some((existing) => existing.name === type.name),
    );
    if (missingIndicators.length > 0) {
      await manager.save(
        TypeIndicator,
        missingIndicators.map((type) => ({
          name: type.name,
          measurementUnit: type.measurementUnit,
        })),
      );
    }

    await this.reconcileNames(manager, AppointmentState, APPOINTMENT_STATES);
    await this.reconcileNames(manager, AppointmentType, APPOINTMENT_TYPES);
    await this.reconcileNames(manager, NotificationState, NOTIFICATION_STATES);
    await this.reconcileNames(
      manager,
      RouteAdministration,
      ROUTE_ADMINISTRATIONS,
    );

    await this.seedClinicalRanges(manager);
    await this.seedDepartments(manager);
  }

  /**
   * Rangos clínicos y bandas de gravedad. Se resuelven por nombre de tipo de
   * indicador, igual que antes, y se omiten los que ya existen.
   */
  private async seedClinicalRanges(manager: EntityManager): Promise<void> {
    const typeIndicators = await manager.find(TypeIndicator);
    // La relación es imprescindible: el filtro compara por
    // `typeIndicator.name`, y sin cargarla `existing.typeIndicator` sería
    // `undefined` siempre, con lo que se intentarían insertar de nuevo los tres rangos y
    // el guardado fallaría por la restricción única de `type_indicator_id`.
    const ranges = await manager.find(ClinicalRange, {
      relations: { typeIndicator: true },
    });

    const missingRanges = CLINICAL_RANGES.filter(
      (range) =>
        !ranges.some(
          (existing) =>
            existing.typeIndicator?.name === range.typeIndicatorName,
        ),
    );
    if (missingRanges.length > 0) {
      await manager.save(
        ClinicalRange,
        missingRanges.map((range) => {
          const typeIndicator = typeIndicators.find(
            (indicator) => indicator.name === range.typeIndicatorName,
          );
          if (!typeIndicator) {
            throw new Error(
              `No se encontró el tipo de indicador: ${range.typeIndicatorName}`,
            );
          }
          return {
            typeIndicator,
            // La entidad tipa las columnas `numeric` como string; TypeORM
            // devuelve y acepta el valor ya formateado.
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

    // Las bandas se comparan por (rango, valueKind, sequence), que es su clave
    // única: si falta una banda intermedia, insertarla con el mismo `sequence`
    // chocaría, así que se calcula el siguiente libre en vez de fijarlo.
    const bands = await manager.find(ClinicalRangeBand, {
      relations: { clinicalRange: true },
    });

    const lastSequenceByKey = new Map<string, number>();
    for (const band of bands) {
      const key = `${band.clinicalRangeId}:${band.valueKind}`;
      lastSequenceByKey.set(
        key,
        Math.max(lastSequenceByKey.get(key) ?? 0, band.sequence),
      );
    }

    const bandRows = CLINICAL_RANGE_BANDS.flatMap((band) => {
      const range = ranges.find(
        (existing) => existing.typeIndicator?.name === band.typeIndicatorName,
      );
      if (!range) {
        throw new Error(
          `No se encontró el rango clínico para: ${band.typeIndicatorName}`,
        );
      }
      const key = `${range.id}:${band.valueKind}`;
      const existingSequences = bands
        .filter(
          (existing) =>
            existing.clinicalRangeId === range.id &&
            existing.valueKind === band.valueKind,
        )
        .map((existing) => existing.sequence);
      if (
        existingSequences.length >=
        countBandsFor(band.typeIndicatorName, band.valueKind)
      ) {
        // Ese tramo ya está sembrado.
        return [];
      }
      const sequence = (lastSequenceByKey.get(key) ?? 0) + 1;
      lastSequenceByKey.set(key, sequence);
      return [
        {
          clinicalRange: range,
          sequence,
          severity: band.severity,
          valueKind: band.valueKind,
          minValue: band.minValue !== null ? String(band.minValue) : null,
          maxValue: band.maxValue !== null ? String(band.maxValue) : null,
          label: band.label,
        },
      ];
    });

    if (bandRows.length > 0) {
      await manager.save(ClinicalRangeBand, bandRows);
    }
  }

  /**
   * Departamentos y municipios. Cada municipio se asocia al departamento con el
   * mismo nombre, y solo se insertan los que falten.
   */
  private async seedDepartments(manager: EntityManager): Promise<void> {
    const departments = await manager.find(Department);
    const municipalities = await manager.find(Municipality);

    for (const department of DEPARTMENTS) {
      let saved = departments.find((d) => d.name === department.name);
      if (!saved) {
        saved = await manager.save(Department, { name: department.name });
        departments.push(saved);
      }

      const missing = department.municipalities.filter(
        (name) => !municipalities.some((m) => m.name === name),
      );
      if (missing.length === 0) {
        continue;
      }
      const created = await manager.save(
        Municipality,
        missing.map((name) => ({ name, department: saved })),
      );
      municipalities.push(...created);
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
        this.configService.get<string>('SEED_HEALTH_CENTER_NAME') ||
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
      this.configService.get<string>('SEED_ADMIN_EMAIL') ||
      'admin@saludmovil.com';
    const password =
      this.configService.get<string>('SEED_ADMIN_PASSWORD') || 'Admin123!';
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
        this.configService.get<string>('SEED_HEALTH_CENTER_NAME') ||
        'Centro de Salud Carlos Núñez Téllez',
    });
    if (!municipality || !major || !healthCenter) {
      throw new Error(
        'No se encontraron los datos de referencia para el seed del personal',
      );
    }
    const email =
      this.configService.get<string>('SEED_PERSONNEL_EMAIL') ||
      'personal@saludmovil.com';
    const password =
      this.configService.get<string>('SEED_PERSONNEL_PASSWORD') ||
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

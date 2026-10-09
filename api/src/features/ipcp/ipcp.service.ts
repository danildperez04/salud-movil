import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { HealthIndicator } from '../health-indicators/entities/health-indicator.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { MedicationReminder } from '../medications/entities/medication-reminder.entity';
import { MedicationSchedule } from '../medications/entities/medication-schedule.entity';
import {
  BandMatch,
  ClinicalRangeBandsService,
  RangeBands,
} from '../catalogues/clinical-range-bands.service';
import { BandSeverity } from '../catalogues/entities/clinical-range-band.entity';
import { PatientsService } from '../patients/patients.service';
import { Patient } from '../users/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';
import type { Cache } from '@nestjs/cache-manager';
import type {
  IpcpComponent,
  IpcpComponentKey,
  IpcpIndicatorDetail,
  IpcpLevel,
  PublicIpcp,
} from './ipcp.interface';
import {
  IPCP_CACHE_PREFIX,
  IPCP_CACHE_TTL_MS,
  IPCP_LEVEL_CUTS,
  IPCP_SEVERITY_SCORE,
  IPCP_TREND_SCORE,
  IPCP_WEIGHTS,
  IPCP_WINDOWS,
} from './ipcp.constants';

/** Orden de gravedad. `clinical_range_band` ordena ascendente por `sequence`. */
const SEVERITY_ORDER: Record<BandSeverity, number> = {
  normal: 0,
  alert: 1,
  critical: 2,
};

type TrendDirection = 'improving' | 'stable' | 'worsening';

interface ClassifiedReading {
  typeIndicatorId: number;
  typeIndicatorName: string;
  value: number;
  valueSecondary: number | null;
  match: BandMatch;
  dateHour: Date;
}

export interface IpcpSummary {
  id: string;
  name: string;
  email: string;
  score: number;
  level: IpcpLevel;
  deviationScore: number | null;
  adherenceScore: number | null;
  appointmentScore: number | null;
  trendScore: number | null;
  updatedAt: string;
}

export interface IpcpBatchFilters {
  level?: IpcpLevel;
  search?: string;
  centerId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'score' | 'level' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface IpcpBatchResult {
  data: IpcpSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Índice Prioritario de Control de Pacientes (IPCP).
 *
 * Regla **determinista y explicable**: combina cuatro variables medidas y
 * devuelve el score junto a sus componentes, para que el personal vea de dónde
 * sale el número. No es IA y no diagnostica: prioriza y apoya el seguimiento.
 *
 * ⚠️ Pesos y cortes PROVISIONALES, pendientes de validación médica. Ver
 * `ipcp.constants.ts`.
 */
@Injectable()
export class IpcpService {
  private readonly logger = new Logger(IpcpService.name);

  constructor(
    @InjectRepository(HealthIndicator)
    private readonly indicatorRepository: Repository<HealthIndicator>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(MedicationReminder)
    private readonly reminderRepository: Repository<MedicationReminder>,
    @InjectRepository(MedicationSchedule)
    private readonly scheduleRepository: Repository<MedicationSchedule>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bandsService: ClinicalRangeBandsService,
    private readonly patientsService: PatientsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /** IPCP de un paciente, con el scoping de centro ya existente. */
  async forPatient(
    patientId: string,
    currentUser: JwtPayload,
  ): Promise<PublicIpcp> {
    const patient = await this.patientsService.findRecordForScope(
      patientId,
      currentUser,
    );
    return this.getCachedOrCompute(patient.id);
  }

  /** IPCP del propio paciente (HU-34; la UI es de jarey). */
  async forSelf(currentUser: JwtPayload): Promise<PublicIpcp> {
    const patient = await this.patientsService.findByUserId(currentUser.sub);
    if (!patient) {
      throw new ForbiddenException('No hay un paciente asociado a esta cuenta');
    }
    return this.getCachedOrCompute(patient.id);
  }

  async compute(patientId: string): Promise<PublicIpcp> {
    const bands = await this.bandsService.loadAll();
    const readings = await this.loadClassifiedReadings(patientId, bands);

    const components: IpcpComponent[] = [
      this.deviationComponent(readings),
      await this.adherenceComponent(patientId),
      await this.appointmentControlComponent(patientId),
      this.trendComponent(readings),
    ];

    // Renormalización: una variable sin datos no puntúa y el resto absorbe su
    // proporción. Contarla como 0 penalizaría al paciente por falta de registro
    // y no por su gravedad, que es justo lo contrario de lo que busca el índice.
    const available = components.filter((c) => c.score !== null);
    const availableWeight = available.reduce((sum, c) => sum + c.weight, 0);

    for (const component of components) {
      component.effectiveWeight =
        component.score === null || availableWeight === 0
          ? 0
          : (component.weight / availableWeight) * 100;
    }

    const weightedSum = available.reduce(
      (sum, c) => sum + (c.score as number) * (c.effectiveWeight / 100),
      0,
    );
    const score = available.length === 0 ? 0 : Math.round(weightedSum);

    return {
      score,
      level: this.levelFor(score),
      components,
      exclusions: [
        'Peso: `cat_type_indicator` no tiene rangos ni bandas para el peso, así que no hay umbral con el que puntuarlo. Se espera la validación médica.',
        'Síntomas y antecedentes: fuera de la v1. El cuestionario está incompleto y los antecedentes viven en texto libre no automatizable.',
      ],
      computedFrom:
        readings.length > 0 ? readings[0].dateHour.toISOString() : null,
      generatedAt: new Date().toISOString(),
    };
  }

  private levelFor(score: number): IpcpLevel {
    if (score >= IPCP_LEVEL_CUTS.high) {
      return 'high';
    }
    if (score >= IPCP_LEVEL_CUTS.moderate) {
      return 'moderate';
    }
    return 'low';
  }

  /**
   * Hasta las 2 últimas lecturas de cada tipo de indicador, clasificadas contra
   * las bandas y ordenadas de más reciente a menos reciente. Dos lecturas bastan
   * porque la tendencia solo compara dos.
   */
  private async loadClassifiedReadings(
    patientId: string,
    bands: Map<number, RangeBands>,
  ): Promise<ClassifiedReading[]> {
    const indicators = await this.indicatorRepository.find({
      where: { patient: { id: patientId } },
      relations: { typeIndicator: true },
      order: { dateHour: 'DESC' },
    });

    const perType = new Map<number, ClassifiedReading[]>();

    for (const indicator of indicators) {
      const typeId = indicator.typeIndicator?.id;
      if (typeId === undefined) {
        continue;
      }
      const typeBands = bands.get(typeId);
      // El peso no tiene bandas sembradas: sin umbral no se puede clasificar, y
      // quedarse sin clasificar es preferible a inventarle un rango.
      if (!typeBands) {
        continue;
      }

      const list = perType.get(typeId) ?? [];
      if (list.length >= IPCP_WINDOWS.trendReadings) {
        continue;
      }

      const value = Number(indicator.value);
      const valueSecondary =
        indicator.valueSecondary !== null
          ? Number(indicator.valueSecondary)
          : null;

      // La PA se evalúa con las dos bandas: la secundaria es la diastólica, y es
      // la que manda si tiene banda propia.
      const match =
        valueSecondary !== null
          ? (this.bandsService.match(typeBands.secondary, valueSecondary) ??
            this.bandsService.match(typeBands.primary, value))
          : this.bandsService.match(typeBands.primary, value);

      if (!match) {
        continue;
      }

      list.push({
        typeIndicatorId: typeId,
        typeIndicatorName: indicator.typeIndicator?.name ?? 'Indicador',
        value,
        valueSecondary,
        match,
        dateHour: indicator.dateHour,
      });
      perType.set(typeId, list);
    }

    return [...perType.values()]
      .flat()
      .sort((a, b) => b.dateHour.getTime() - a.dateHour.getTime());
  }

  /** Desviación: la peor banda entre la última lectura de cada tipo. */
  private deviationComponent(readings: ClassifiedReading[]): IpcpComponent {
    const base = {
      key: 'indicatorDeviation' as const,
      label: 'Desviación de indicadores',
      weight: IPCP_WEIGHTS.indicatorDeviation,
      effectiveWeight: 0,
    };

    const latest = this.latestPerType(readings);
    if (latest.length === 0) {
      return {
        ...base,
        score: null,
        unavailableReason:
          'Sin indicadores con bandas de gravedad configuradas',
        detail: 'No hay indicadores medidos a los que aplicar las bandas.',
      };
    }

    const worst = latest.reduce((a, b) =>
      SEVERITY_ORDER[b.match.severity] > SEVERITY_ORDER[a.match.severity]
        ? b
        : a,
    );

    const indicators: IpcpIndicatorDetail[] = latest.map((r) => ({
      typeIndicatorId: r.typeIndicatorId,
      typeIndicatorName: r.typeIndicatorName,
      value: r.value,
      valueSecondary: r.valueSecondary,
      severity: r.match.severity,
      band: r.match.label,
    }));

    return {
      ...base,
      score: IPCP_SEVERITY_SCORE[worst.match.severity],
      unavailableReason: null,
      detail: `Peor banda entre ${latest.length} indicador(es): ${worst.typeIndicatorName} en ${worst.match.label}.`,
      indicators,
    };
  }

  /** Adherencia: tomas no confirmadas sobre las generadas en la ventana. */
  private async adherenceComponent(patientId: string): Promise<IpcpComponent> {
    const base = {
      key: 'adherence' as const,
      label: 'Adherencia al tratamiento',
      weight: IPCP_WEIGHTS.adherence,
      effectiveWeight: 0,
    };

    const schedules = await this.scheduleRepository.find({
      where: { medication: { patient: { id: patientId } } },
      select: { id: true },
    });
    if (schedules.length === 0) {
      return {
        ...base,
        score: null,
        unavailableReason: 'Sin medicamentos prescritos',
        detail: 'No hay horarios de medicación que generen tomas.',
      };
    }

    const since = daysAgo(IPCP_WINDOWS.adherenceDays);
    const reminders = await this.reminderRepository.find({
      where: { schedule: { id: In(schedules.map((s) => s.id)) } },
      select: { confirmationDate: true, dateHourScheduled: true },
    });

    const inWindow = reminders.filter(
      (r) => r.dateHourScheduled.getTime() >= since.getTime(),
    );
    if (inWindow.length === 0) {
      return {
        ...base,
        score: null,
        unavailableReason: `Sin tomas en los últimos ${IPCP_WINDOWS.adherenceDays} días`,
        detail: 'La ventana no contiene recordatorios de medicación.',
      };
    }

    const confirmed = inWindow.filter(
      (r) => r.confirmationDate !== null,
    ).length;
    const missedRatio = (inWindow.length - confirmed) / inWindow.length;

    return {
      ...base,
      score: Math.round(missedRatio * 100),
      unavailableReason: null,
      detail: `${confirmed} de ${inWindow.length} tomas confirmadas en los últimos ${IPCP_WINDOWS.adherenceDays} días.`,
    };
  }

  /** Controles: citas no asistidas o canceladas sobre el total de pasadas. */
  private async appointmentControlComponent(
    patientId: string,
  ): Promise<IpcpComponent> {
    const base = {
      key: 'appointmentControl' as const,
      label: 'Cumplimiento de controles',
      weight: IPCP_WEIGHTS.appointmentControl,
      effectiveWeight: 0,
    };

    const since = daysAgo(IPCP_WINDOWS.appointmentDays);
    const appointments = await this.appointmentRepository.find({
      where: { patient: { id: patientId } },
      relations: { appointmentState: true },
    });

    // Una cita aún programada no dice nada del cumplimiento: no es asistencia ni
    // inasistencia, así que no puede contar como una de las dos.
    const past = appointments.filter(
      (a) =>
        a.dateHour.getTime() >= since.getTime() &&
        a.dateHour.getTime() <= Date.now(),
    );
    if (past.length === 0) {
      return {
        ...base,
        score: null,
        unavailableReason: `Sin citas pasadas en los últimos ${IPCP_WINDOWS.appointmentDays} días`,
        detail:
          'Las citas futuras no cuentan como cumplimiento ni como inasistencia.',
      };
    }

    const missed = past.filter((a) =>
      ['No show', 'Cancelled'].includes(a.appointmentState?.name ?? ''),
    ).length;

    return {
      ...base,
      score: Math.round((missed / past.length) * 100),
      unavailableReason: null,
      detail: `${missed} de ${past.length} citas pasadas no asistidas o canceladas.`,
    };
  }

  /**
   * Tendencia: compara la banda de la lectura más reciente con la anterior, por
   * tipo. Se compara la **severidad**, no el número: una temperatura que pasa de
   * 38 a 37 °C empeora aunque el valor suba.
   */
  private trendComponent(readings: ClassifiedReading[]): IpcpComponent {
    const base = {
      key: 'trend' as const,
      label: 'Tendencia de los indicadores',
      weight: IPCP_WEIGHTS.trend,
      effectiveWeight: 0,
    };

    const byType = new Map<number, ClassifiedReading[]>();
    for (const reading of readings) {
      const list = byType.get(reading.typeIndicatorId) ?? [];
      list.push(reading);
      byType.set(reading.typeIndicatorId, list);
    }

    const comparable = [...byType.values()].filter(
      (list) => list.length >= IPCP_WINDOWS.trendReadings,
    );
    if (comparable.length === 0) {
      return {
        ...base,
        score: null,
        unavailableReason: `Se necesitan ${IPCP_WINDOWS.trendReadings} lecturas de un mismo indicador`,
        detail: 'Con una sola medición no hay dirección en la que evaluar.',
      };
    }

    const deltas = comparable.map((list) => {
      const delta =
        SEVERITY_ORDER[list[0].match.severity] -
        SEVERITY_ORDER[list[1].match.severity];
      const direction: TrendDirection =
        delta > 0 ? 'worsening' : delta < 0 ? 'improving' : 'stable';
      return { name: list[0].typeIndicatorName, direction };
    });

    // Predomina la dirección mayoritaria. Empujar la media hacia "empeora" si
    // hay más indicadores que empeoran mantiene el riesgo por encima de la
    // neutra sin dejar que un solo tipo determine el índice.
    const counts = { improving: 0, stable: 0, worsening: 0 };
    for (const d of deltas) {
      counts[d.direction] += 1;
    }
    // Un empate entre "mejora" y "empeora" se resuelve como **estable**, no como
    // mejora: afirmar que el paciente mejora cuando un indicador empeora y otro
    // mejora es justo la conclusión que este índice no puede sostener.
    const dominant: TrendDirection =
      counts.worsening > counts.improving
        ? 'worsening'
        : counts.improving > counts.worsening
          ? 'improving'
          : 'stable';

    return {
      ...base,
      score: IPCP_TREND_SCORE[dominant],
      unavailableReason: null,
      detail: deltas
        .map(
          (d) =>
            `${d.name}: ${d.direction === 'worsening' ? 'empeora' : d.direction === 'improving' ? 'mejora' : 'estable'}`,
        )
        .join('; '),
    };
  }

  /** Última lectura de cada tipo, en el orden en que llegan. */
  private latestPerType(readings: ClassifiedReading[]): ClassifiedReading[] {
    const seen = new Set<number>();
    const result: ClassifiedReading[] = [];
    for (const reading of readings) {
      if (seen.has(reading.typeIndicatorId)) {
        continue;
      }
      seen.add(reading.typeIndicatorId);
      result.push(reading);
    }
    return result;
  }

  // ========== BATCH / CACHE ==========

  /**
   * Lee el IPCP de un paciente desde cache; si no está, lo calcula y lo guarda.
   *
   * El refresco real lo aporta `recalculateAllIpcp`, que **fuerza** el
   * recálculo en cada pasada: si el cron llamara a este método se limitaría a
   * revalidar entradas que aún no han expirado y el índice envejecería hasta
   * que el TTL lo dejara caer.
   */
  async getCachedOrCompute(patientId: string): Promise<PublicIpcp> {
    const key = this.cacheKey(patientId);
    const cached = await this.cacheManager.get<PublicIpcp>(key);
    if (cached) {
      return cached;
    }
    const computed = await this.compute(patientId);
    await this.cacheManager.set(key, computed, IPCP_CACHE_TTL_MS);
    return computed;
  }

  /** Invalida el IPCP cacheado de un paciente. */
  async invalidateCache(patientId: string): Promise<void> {
    await this.cacheManager.del(this.cacheKey(patientId));
  }

  private cacheKey(patientId: string): string {
    return `${IPCP_CACHE_PREFIX}${patientId}`;
  }

  /**
   * Precalcula el IPCP de todos los pacientes para que el panel no pague ese
   * coste en la primera carga. Corre cada 30 minutos y **no** mira el cache:
   * su trabajo es refrescarlo, no leerlo.
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async recalculateAllIpcp(): Promise<void> {
    const scope = await this.getScopePatients();
    const batchSize = 50;
    for (let i = 0; i < scope.length; i += batchSize) {
      const batch = scope.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async ({ id }) => {
          try {
            const ipcp = await this.compute(id);
            await this.cacheManager.set(
              this.cacheKey(id),
              ipcp,
              IPCP_CACHE_TTL_MS,
            );
          } catch (error) {
            // Un paciente que no se pueda calcular no debe tumbar el resto de
            // la pasada del cron.
            this.logger.error(
              `No se pudo recalcular el IPCP de ${id}`,
              error as Error,
            );
          }
        }),
      );
    }
  }

  /**
   * Listado paginado de IPCP (HU-32, HU-33). El alcance se resuelve aquí: el
   * admin ve todos los pacientes y, si pide un centro, se queda con ese; el
   * personal de salud solo los de su centro, que se toma del servidor e
   * ignora lo que llegue en la query.
   */
  async getBatchForUser(
    currentUser: JwtPayload,
    query: Omit<IpcpBatchFilters, 'centerId'> & { healthCenterId?: string },
  ): Promise<IpcpBatchResult> {
    const { healthCenterId, ...filters } = query;
    const centerId =
      currentUser.role === 'admin'
        ? healthCenterId
        : await this.resolveStaffCenterId(currentUser);
    return this.getBatch({ ...filters, centerId });
  }

  async getBatch(filters: IpcpBatchFilters): Promise<IpcpBatchResult> {
    const {
      level,
      search,
      centerId,
      page = 1,
      limit = 20,
      sortBy = 'score',
      sortOrder = 'desc',
    } = filters;
    const currentPage = Math.max(1, Math.trunc(page));
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.trunc(limit)));

    const scope = await this.getScopePatients(centerId, search);
    const ipcpByPatient = await this.computeBatch(scope.map((p) => p.id));

    let summaries = scope.map((patient) =>
      this.toSummary(patient, ipcpByPatient.get(patient.id) as PublicIpcp),
    );

    // El nivel se filtra **antes** de paginar: con el filtro después, `total`
    // y `totalPages` describirían una página ya recortada y aparecerían
    // páginas con menos filas de las que promete el encabezado.
    if (level) {
      summaries = summaries.filter((summary) => summary.level === level);
    }
    summaries.sort(summariesComparator(sortBy, sortOrder));

    const total = summaries.length;
    const start = (currentPage - 1) * pageSize;

    return {
      data: summaries.slice(start, start + pageSize),
      total,
      page: currentPage,
      limit: pageSize,
      // Nunca 0: con `totalPages` en 0 el botón "Siguiente" de la web quedaría
      // habilitado en la página 1 y mandaría a una página inexistente.
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  /** Centro del personal de salud; sin él no hay alcance posible. */
  private async resolveStaffCenterId(currentUser: JwtPayload): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: currentUser.sub },
      relations: { healthcareWorker: { healthCenter: true } },
    });
    const centerId = user?.healthcareWorker?.healthCenter?.id;
    if (!centerId) {
      throw new ForbiddenException(
        'El personal de salud debe pertenecer a un centro de salud',
      );
    }
    return centerId;
  }

  /**
   * Pacientes del alcance (centro y búsqueda) con los datos que pinta el
   * listado. El borrado lógico lo excluye el QueryBuilder solo.
   */
  private async getScopePatients(
    centerId?: string,
    search?: string,
  ): Promise<ScopePatient[]> {
    const query = this.patientRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.user', 'user')
      .select('patient.id', 'id')
      .addSelect('user.name', 'name')
      .addSelect('user.email', 'email');

    if (centerId) {
      query.andWhere('patient.health_center_id = :centerId', { centerId });
    }
    if (search && search.trim().length > 0) {
      const term = `%${search.trim()}%`;
      query.andWhere(
        '(user.name ILIKE :term OR user.email ILIKE :term OR user.username ILIKE :term)',
        { term },
      );
    }

    return query.getRawMany<ScopePatient>();
  }

  /** IPCP de cada paciente del lote, reutilizando lo que ya esté en cache. */
  private async computeBatch(ids: string[]): Promise<Map<string, PublicIpcp>> {
    const result = new Map<string, PublicIpcp>();
    const batchSize = 50;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const computed = await Promise.all(
        batch.map((id) => this.getCachedOrCompute(id)),
      );
      batch.forEach((id, index) => result.set(id, computed[index]));
    }
    return result;
  }

  /** Fila del listado: el IPCP calculado junto a quien lo pinta. */
  private toSummary(patient: ScopePatient, ipcp: PublicIpcp): IpcpSummary {
    const scoreOf = (key: IpcpComponentKey): number | null =>
      ipcp.components.find((component) => component.key === key)?.score ?? null;

    return {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      score: ipcp.score,
      level: ipcp.level,
      deviationScore: scoreOf('indicatorDeviation'),
      adherenceScore: scoreOf('adherence'),
      appointmentScore: scoreOf('appointmentControl'),
      trendScore: scoreOf('trend'),
      updatedAt: ipcp.generatedAt,
    };
  }
}

/** Paciente con los datos mínimos que pinta el listado de prioridad. */
interface ScopePatient {
  id: string;
  name: string;
  email: string;
}

/** Tope de filas por página: evita que `?limit=100000` seque la base. */
const MAX_PAGE_SIZE = 1000;

/** Último nivel primero cuando se ordena por nivel. */
const LEVEL_ORDER: Record<IpcpLevel, number> = { high: 3, moderate: 2, low: 1 };

/** Orden del listado. El orden por defecto es el score, descendente. */
function summariesComparator(
  sortBy: NonNullable<IpcpBatchFilters['sortBy']>,
  sortOrder: NonNullable<IpcpBatchFilters['sortOrder']>,
): (a: IpcpSummary, b: IpcpSummary) => number {
  const sign = sortOrder === 'asc' ? 1 : -1;
  if (sortBy === 'name') {
    return (a, b) => sign * a.name.localeCompare(b.name, 'es');
  }
  if (sortBy === 'level') {
    return (a, b) => sign * (LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  }
  return (a, b) => sign * (a.score - b.score);
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

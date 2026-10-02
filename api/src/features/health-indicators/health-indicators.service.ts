import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthIndicator } from './entities/health-indicator.entity';
import { TypeIndicator } from '../catalogues/entities/type-indicator.entity';
import { ClinicalRange } from '../catalogues/entities/clinical-range.entity';
import {
  ClinicalRangeBandsService,
  RangeBands,
} from '../catalogues/clinical-range-bands.service';
import { User } from '../users/entities/user.entity';
import { PatientsService } from '../patients/patients.service';
import { CreateHealthIndicatorDto } from './dto/create-health-indicator.dto';
import { UpdateHealthIndicatorDto } from './dto/update-health-indicator.dto';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

export type IndicatorStatus = 'low' | 'normal' | 'high' | null;
export type IndicatorSeverity = 'normal' | 'alert' | 'critical' | null;

export interface PublicHealthIndicator {
  id: string;
  typeIndicatorId: number;
  typeIndicatorName: string;
  measurementUnit: string;
  value: number;
  valueSecondary: number | null;
  dateHour: string;
  notes: string | null;
  registeredById: string;
  registeredByName: string;
  /** Clasificación binaria. Se conserva por compatibilidad con el cliente móvil. */
  status: IndicatorStatus;
  /** Gravedad según las bandas. Es la que consume el índice de prioridad. */
  severity: IndicatorSeverity;
  /** Etiqueta legible de la banda coincidente, ej. "Sistólica elevada". */
  band: string | null;
}

export interface PublicIndicatorSummary {
  typeIndicatorId: number;
  typeIndicatorName: string;
  measurementUnit: string;
  value: number;
  valueSecondary: number | null;
  dateHour: string;
  status: IndicatorStatus;
  severity: IndicatorSeverity;
  band: string | null;
  minValue: number | null;
  maxValue: number | null;
  minValueSecondary: number | null;
  maxValueSecondary: number | null;
}

export interface ListHealthIndicatorsOptions {
  typeIndicatorId?: number;
  from?: Date;
  to?: Date;
}

@Injectable()
export class HealthIndicatorsService {
  constructor(
    @InjectRepository(HealthIndicator)
    private readonly healthIndicatorRepository: Repository<HealthIndicator>,
    @InjectRepository(TypeIndicator)
    private readonly typeIndicatorRepository: Repository<TypeIndicator>,
    @InjectRepository(ClinicalRange)
    private readonly clinicalRangeRepository: Repository<ClinicalRange>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly patientsService: PatientsService,
    private readonly bandsService: ClinicalRangeBandsService,
  ) {}

  async create(
    patientId: string,
    currentUser: JwtPayload,
    dto: CreateHealthIndicatorDto,
  ): Promise<PublicHealthIndicator> {
    const patient = await this.patientsService.findRecordForScope(
      patientId,
      currentUser,
    );
    return this.register(patient.id, currentUser, dto);
  }

  async createForMe(
    currentUser: JwtPayload,
    dto: CreateHealthIndicatorDto,
  ): Promise<PublicHealthIndicator> {
    const patient = await this.patientsService.findByUserId(currentUser.sub);
    return this.register(patient.id, currentUser, dto);
  }

  async list(
    patientId: string,
    currentUser: JwtPayload,
    options: ListHealthIndicatorsOptions = {},
  ): Promise<PublicHealthIndicator[]> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    return this.loadIndicators(patientId, options);
  }

  async listForMe(
    currentUser: JwtPayload,
    options: ListHealthIndicatorsOptions = {},
  ): Promise<PublicHealthIndicator[]> {
    const patient = await this.patientsService.findByUserId(currentUser.sub);
    return this.loadIndicators(patient.id, options);
  }

  async latest(
    patientId: string,
    currentUser: JwtPayload,
  ): Promise<PublicHealthIndicator[]> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    return this.loadLatestIndicators(patientId);
  }

  async summary(
    patientId: string,
    currentUser: JwtPayload,
  ): Promise<PublicIndicatorSummary[]> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    const latest = await this.loadLatestIndicators(patientId);
    const rangesById = await this.loadRangesById();

    return latest.map((indicator) => {
      const range = rangesById.get(indicator.typeIndicatorId);
      return {
        typeIndicatorId: indicator.typeIndicatorId,
        typeIndicatorName: indicator.typeIndicatorName,
        measurementUnit: indicator.measurementUnit,
        value: indicator.value,
        valueSecondary: indicator.valueSecondary,
        dateHour: indicator.dateHour,
        status: indicator.status,
        severity: indicator.severity,
        band: indicator.band,
        minValue: range ? Number(range.minValue) : null,
        maxValue: range ? Number(range.maxValue) : null,
        minValueSecondary:
          range && range.minValueSecondary !== null
            ? Number(range.minValueSecondary)
            : null,
        maxValueSecondary:
          range && range.maxValueSecondary !== null
            ? Number(range.maxValueSecondary)
            : null,
      };
    });
  }

  async update(
    patientId: string,
    indicatorId: string,
    currentUser: JwtPayload,
    dto: UpdateHealthIndicatorDto,
  ): Promise<PublicHealthIndicator> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    return this.updateIndicator(patientId, indicatorId, currentUser, dto);
  }

  async updateForMe(
    indicatorId: string,
    currentUser: JwtPayload,
    dto: UpdateHealthIndicatorDto,
  ): Promise<PublicHealthIndicator> {
    const patient = await this.patientsService.findByUserId(currentUser.sub);
    return this.updateIndicator(
      patient.id,
      indicatorId,
      currentUser,
      dto,
      true,
    );
  }

  async remove(
    patientId: string,
    indicatorId: string,
    currentUser: JwtPayload,
  ): Promise<void> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    await this.removeIndicator(patientId, indicatorId, currentUser);
  }

  async removeForMe(
    indicatorId: string,
    currentUser: JwtPayload,
  ): Promise<void> {
    const patient = await this.patientsService.findByUserId(currentUser.sub);
    await this.removeIndicator(patient.id, indicatorId, currentUser, true);
  }

  // === Internals ===

  private async register(
    patientId: string,
    currentUser: JwtPayload,
    dto: CreateHealthIndicatorDto,
  ): Promise<PublicHealthIndicator> {
    const typeIndicator = await this.typeIndicatorRepository.findOne({
      where: { id: dto.typeIndicatorId },
    });
    if (!typeIndicator) {
      throw new BadRequestException('Tipo de indicador no válido');
    }

    if (
      this.isBloodPressure(typeIndicator) &&
      (dto.valueSecondary === undefined || dto.valueSecondary === null)
    ) {
      throw new BadRequestException(
        'La presión arterial requiere el valor diastólico (valueSecondary)',
      );
    }

    const registeredBy = await this.userRepository.findOne({
      where: { id: currentUser.sub },
    });
    if (!registeredBy) {
      throw new BadRequestException('Usuario no válido');
    }

    const created = await this.healthIndicatorRepository.save(
      this.healthIndicatorRepository.create({
        value: String(dto.value),
        valueSecondary:
          dto.valueSecondary !== undefined ? String(dto.valueSecondary) : null,
        dateHour: dto.dateHour ? new Date(dto.dateHour) : new Date(),
        notes: dto.notes ?? null,
        patient: { id: patientId },
        typeIndicator,
        registeredBy,
      }),
    );

    const loaded = await this.healthIndicatorRepository.findOne({
      where: { id: created.id },
      relations: { typeIndicator: true, registeredBy: true },
    });
    if (!loaded) {
      throw new NotFoundException('Indicador no encontrado');
    }
    const rangesById = await this.loadRangesById();
    const bandsById = await this.loadBandsById();
    return this.toPublicIndicator(loaded, rangesById, bandsById);
  }

  private async loadIndicators(
    patientId: string,
    options: ListHealthIndicatorsOptions = {},
  ): Promise<PublicHealthIndicator[]> {
    const query = this.healthIndicatorRepository
      .createQueryBuilder('indicator')
      .innerJoinAndSelect('indicator.typeIndicator', 'typeIndicator')
      .innerJoinAndSelect('indicator.registeredBy', 'registeredBy')
      .where('indicator.patient_id = :patientId', { patientId })
      .andWhere('indicator.deleted_at IS NULL')
      .orderBy('indicator.date_hour', 'DESC')
      .addOrderBy('indicator.created_at', 'DESC');

    if (options.typeIndicatorId !== undefined) {
      query.andWhere('indicator.type_indicator_id = :typeIndicatorId', {
        typeIndicatorId: options.typeIndicatorId,
      });
    }
    if (options.from) {
      query.andWhere('indicator.date_hour >= :from', { from: options.from });
    }
    if (options.to) {
      query.andWhere('indicator.date_hour <= :to', { to: options.to });
    }

    const indicators = await query.getMany();
    const rangesById = await this.loadRangesById();
    const bandsById = await this.loadBandsById();
    return this.toPublicIndicators(indicators, rangesById, bandsById);
  }

  private async loadLatestIndicators(
    patientId: string,
  ): Promise<PublicHealthIndicator[]> {
    const indicators = await this.healthIndicatorRepository.find({
      where: { patient: { id: patientId } },
      relations: { typeIndicator: true, registeredBy: true },
      order: { dateHour: 'DESC', createdAt: 'DESC' },
    });
    const rangesById = await this.loadRangesById();
    const bandsById = await this.loadBandsById();
    return this.toPublicIndicators(indicators, rangesById, bandsById, {
      latestByType: true,
    });
  }

  private async updateIndicator(
    patientId: string,
    indicatorId: string,
    currentUser: JwtPayload,
    dto: UpdateHealthIndicatorDto,
    ownOnly = false,
  ): Promise<PublicHealthIndicator> {
    const indicator = await this.loadIndicatorForPatient(
      patientId,
      indicatorId,
    );
    if (ownOnly && indicator.registeredBy.id !== currentUser.sub) {
      throw new NotFoundException('Indicador no encontrado');
    }

    if (dto.typeIndicatorId !== undefined) {
      const typeIndicator = await this.typeIndicatorRepository.findOne({
        where: { id: dto.typeIndicatorId },
      });
      if (!typeIndicator) {
        throw new BadRequestException('Tipo de indicador no válido');
      }
      indicator.typeIndicator = typeIndicator;
    }
    if (dto.value !== undefined) {
      indicator.value = String(dto.value);
    }
    if (dto.valueSecondary !== undefined) {
      indicator.valueSecondary = String(dto.valueSecondary);
    }
    if (dto.dateHour !== undefined) {
      indicator.dateHour = new Date(dto.dateHour);
    }
    if (dto.notes !== undefined) {
      indicator.notes = dto.notes ?? null;
    }

    await this.healthIndicatorRepository.save(indicator);

    const loaded = await this.healthIndicatorRepository.findOne({
      where: { id: indicator.id },
      relations: { typeIndicator: true, registeredBy: true },
    });
    if (!loaded) {
      throw new NotFoundException('Indicador no encontrado');
    }
    const rangesById = await this.loadRangesById();
    const bandsById = await this.loadBandsById();
    return this.toPublicIndicator(loaded, rangesById, bandsById);
  }

  private async removeIndicator(
    patientId: string,
    indicatorId: string,
    currentUser: JwtPayload,
    ownOnly = false,
  ): Promise<void> {
    const indicator = await this.loadIndicatorForPatient(
      patientId,
      indicatorId,
    );
    if (ownOnly && indicator.registeredBy.id !== currentUser.sub) {
      throw new NotFoundException('Indicador no encontrado');
    }
    await this.healthIndicatorRepository.softDelete(indicator.id);
  }

  private async loadIndicatorForPatient(
    patientId: string,
    indicatorId: string,
  ): Promise<HealthIndicator> {
    const indicator = await this.healthIndicatorRepository.findOne({
      where: { id: indicatorId, patient: { id: patientId } },
      relations: { typeIndicator: true, registeredBy: true },
    });
    if (!indicator) {
      throw new NotFoundException('Indicador no encontrado');
    }
    return indicator;
  }

  private toPublicIndicators(
    indicators: HealthIndicator[],
    rangesById: Map<number, ClinicalRange>,
    bandsById: Map<number, RangeBands>,
    options: { latestByType?: boolean } = {},
  ): PublicHealthIndicator[] {
    if (options.latestByType && indicators.length > 0) {
      const latest = new Map<string, HealthIndicator>();
      for (const indicator of indicators) {
        if (!latest.has(indicator.typeIndicator.id.toString())) {
          latest.set(indicator.typeIndicator.id.toString(), indicator);
        }
      }
      return [...latest.values()].map((indicator) =>
        this.toPublicIndicator(indicator, rangesById, bandsById),
      );
    }
    return indicators.map((indicator) =>
      this.toPublicIndicator(indicator, rangesById, bandsById),
    );
  }

  private toPublicIndicator(
    indicator: HealthIndicator,
    rangesById: Map<number, ClinicalRange>,
    bandsById: Map<number, RangeBands>,
  ): PublicHealthIndicator {
    const range = rangesById.get(indicator.typeIndicator.id) ?? null;
    const classification = this.classify(indicator, range, bandsById);
    return {
      id: indicator.id,
      typeIndicatorId: indicator.typeIndicator.id,
      typeIndicatorName: indicator.typeIndicator.name,
      measurementUnit: indicator.typeIndicator.measurementUnit,
      value: Number(indicator.value),
      valueSecondary:
        indicator.valueSecondary !== null
          ? Number(indicator.valueSecondary)
          : null,
      dateHour: indicator.dateHour.toISOString(),
      notes: indicator.notes ?? null,
      registeredById: indicator.registeredBy.id,
      registeredByName: indicator.registeredBy.name,
      status: classification.status,
      severity: classification.severity,
      band: classification.band,
    };
  }

  private async loadRangesById(): Promise<Map<number, ClinicalRange>> {
    const ranges = await this.clinicalRangeRepository.find();
    return new Map(ranges.map((range) => [range.typeIndicatorId, range]));
  }

  private async loadBandsById(): Promise<Map<number, RangeBands>> {
    return this.bandsService.loadAll();
  }

  /**
   * Resuelve la banda de gravedad del indicador.
   *
   * `status` conserva la clasificación binaria (min/max) por compatibilidad con
   * el cliente móvil. `severity` y `band` añaden la gradación de tres niveles.
   *
   * La diastólica se evalúa contra las bandas secundarias y, si alguna coincide,
   * su severidad prevalece sobre la de la sistólica: en una presión arterial lo
   * grave es lo que peor está entre las dos.
   */
  private classify(
    indicator: HealthIndicator,
    range: ClinicalRange | null,
    bandsById: Map<number, RangeBands>,
  ): {
    status: IndicatorStatus;
    severity: IndicatorSeverity;
    band: string | null;
  } {
    if (!range) {
      return { status: null, severity: null, band: null };
    }

    const status = this.classifyByRange(indicator, range);
    const bands = bandsById.get(indicator.typeIndicator.id) ?? null;
    if (!bands) {
      return { status, severity: null, band: null };
    }

    const primaryMatch = this.bandsService.match(
      bands.primary,
      Number(indicator.value),
    );
    const secondaryMatch =
      indicator.valueSecondary !== null
        ? this.bandsService.match(
            bands.secondary,
            Number(indicator.valueSecondary),
          )
        : null;

    if (!primaryMatch && !secondaryMatch) {
      return { status, severity: null, band: null };
    }

    const severity = this.strongerSeverity(
      primaryMatch?.severity ?? null,
      secondaryMatch?.severity ?? null,
    );
    const labels = [primaryMatch?.label, secondaryMatch?.label].filter(
      (label): label is string => Boolean(label),
    );

    return {
      status,
      severity,
      band: labels.length > 0 ? labels.join(' / ') : null,
    };
  }

  /** De dos severidades devuelve la más grave: normal < alert < critical. */
  private strongerSeverity(
    a: IndicatorSeverity,
    b: IndicatorSeverity,
  ): IndicatorSeverity {
    const rank: Record<NonNullable<IndicatorSeverity>, number> = {
      normal: 0,
      alert: 1,
      critical: 2,
    };
    if (a === null) {
      return b;
    }
    if (b === null) {
      return a;
    }
    return rank[a] >= rank[b] ? a : b;
  }

  /**
   * Clasificación binaria con los min/max del rango. Se mantiene tal cual para
   * no romper el contrato que ya consume el cliente móvil.
   */
  private classifyByRange(
    indicator: HealthIndicator,
    range: ClinicalRange,
  ): IndicatorStatus {
    let hasHigh = false;
    let hasLow = false;

    if (range.minValue !== null || range.maxValue !== null) {
      const primary = Number(indicator.value);
      if (range.maxValue !== null && primary > Number(range.maxValue)) {
        hasHigh = true;
      }
      if (range.minValue !== null && primary < Number(range.minValue)) {
        hasLow = true;
      }
    }
    if (
      indicator.valueSecondary !== null &&
      (range.minValueSecondary !== null || range.maxValueSecondary !== null)
    ) {
      const secondary = Number(indicator.valueSecondary);
      if (
        range.maxValueSecondary !== null &&
        secondary > Number(range.maxValueSecondary)
      ) {
        hasHigh = true;
      }
      if (
        range.minValueSecondary !== null &&
        secondary < Number(range.minValueSecondary)
      ) {
        hasLow = true;
      }
    }

    if (hasHigh) {
      return 'high';
    }
    if (hasLow) {
      return 'low';
    }
    return 'normal';
  }

  private isBloodPressure(typeIndicator: TypeIndicator): boolean {
    return typeIndicator.name.toLocaleLowerCase().includes('blood pressure');
  }
}

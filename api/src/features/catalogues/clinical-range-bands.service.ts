import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalRange } from './entities/clinical-range.entity';
import {
  BandSeverity,
  ClinicalRangeBand,
} from './entities/clinical-range-band.entity';

export interface BandMatch {
  severity: BandSeverity;
  label: string;
  minValue: number | null;
  maxValue: number | null;
}

export interface RangeBands {
  primary: BandMatch[];
  secondary: BandMatch[];
}

/**
 * Resuelve qué banda de gravedad contiene un valor.
 *
 * `clinical_range_band` es la fuente de verdad. Los min/max de `clinical_range`
 * siguen disponibles como respaldo para no perder la clasificación binaria si
 * un tipo de indicador no tiene bandas sembradas.
 *
 * ⚠️ Los cortes de las bandas son PROVISIONALES y pendientes de validación
 * médica. Ver `CLINICAL_RANGE_BANDS` en `seed-data.ts`.
 */
@Injectable()
export class ClinicalRangeBandsService {
  constructor(
    @InjectRepository(ClinicalRange)
    private readonly clinicalRangeRepository: Repository<ClinicalRange>,
    @InjectRepository(ClinicalRangeBand)
    private readonly clinicalRangeBandRepository: Repository<ClinicalRangeBand>,
  ) {}

  /** Carga las bandas de todos los rangos, agrupadas por `type_indicator_id`. */
  async loadAll(): Promise<Map<number, RangeBands>> {
    const [ranges, bands] = await Promise.all([
      this.clinicalRangeRepository.find(),
      this.clinicalRangeBandRepository.find({
        order: { valueKind: 'ASC', sequence: 'ASC' },
      }),
    ]);

    // Indexar por `type_indicator_id` porque es la clave que consultan los
    // llamadores; las bandas llegan referenciando a `clinical_range_id`.
    const typeIndicatorIdByRange = new Map<number, number>();
    const result = new Map<number, RangeBands>();
    for (const range of ranges) {
      typeIndicatorIdByRange.set(range.id, range.typeIndicatorId);
      result.set(range.typeIndicatorId, { primary: [], secondary: [] });
    }
    for (const band of bands) {
      const typeIndicatorId = typeIndicatorIdByRange.get(band.clinicalRangeId);
      const entry =
        typeIndicatorId === undefined ? undefined : result.get(typeIndicatorId);
      if (!entry) {
        continue;
      }
      entry[band.valueKind].push({
        severity: band.severity,
        label: band.label,
        minValue: band.minValue !== null ? Number(band.minValue) : null,
        maxValue: band.maxValue !== null ? Number(band.maxValue) : null,
      });
    }
    return result;
  }

  /**
   * Primera banda cuyo intervalo contiene el valor. Los extremos nulos son
   * abiertos. Devuelve `null` si el valor cae en un hueco entre bandas.
   */
  match(bands: BandMatch[], value: number): BandMatch | null {
    for (const band of bands) {
      const aboveMin = band.minValue === null || value >= band.minValue;
      const belowMax = band.maxValue === null || value <= band.maxValue;
      if (aboveMin && belowMax) {
        return band;
      }
    }
    return null;
  }
}

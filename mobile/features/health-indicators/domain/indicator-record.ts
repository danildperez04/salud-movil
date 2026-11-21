// features/health-indicators/domain/indicator-record.ts
// Registro de un indicador tal como lo usan las pantallas, y la conversión desde la
// respuesta de la API. Sin dependencias de React.

export type HealthIndicatorRecord = {
  id: string;
  /** id en cat_type_indicator */
  typeId: number;
  /** nombre del tipo tal como viene de cat_type_indicator (en inglés) */
  typeName: string;
  /** "110" o, en presión arterial, "120/80" (sistólica/diastólica) */
  value: string;
  unit: string;
  /** ISO 8601 */
  dateHour: string;
  notes?: string;
};

/** Tipo de indicador del catálogo (`GET /catalogues/type-indicators`). */
export type IndicatorType = {
  id: number;
  name: string;
  measurementUnit: string;
};

/** Lo que usa de `PublicHealthIndicator` de la API. */
export type ApiHealthIndicator = {
  id: string;
  typeIndicatorId: number;
  typeIndicatorName: string;
  measurementUnit: string;
  value: number;
  valueSecondary: number | null;
  dateHour: string;
  notes: string | null;
};

export const BLOOD_PRESSURE = 'Blood pressure';

/** (120, 80) -> "120/80"; (72.5, null) -> "72.5". */
export function formatIndicatorValue(value: number, valueSecondary: number | null): string {
  return valueSecondary === null ? String(value) : `${value}/${valueSecondary}`;
}

export function toIndicatorRecord(indicator: ApiHealthIndicator): HealthIndicatorRecord {
  return {
    id: indicator.id,
    typeId: indicator.typeIndicatorId,
    typeName: indicator.typeIndicatorName,
    value: formatIndicatorValue(indicator.value, indicator.valueSecondary),
    unit: indicator.measurementUnit,
    dateHour: indicator.dateHour,
    notes: indicator.notes ?? undefined,
  };
}

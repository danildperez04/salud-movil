// features/health-indicators/domain/indicator-series.ts
// Transforma los registros crudos en lo que necesitan las pantallas de
// historial y evolución: filtrado por período, serie graficable y tendencia.
// Sin dependencias de React ni de UI.

import type { HealthIndicatorRecord } from '../api/mock-health-indicators';
import { parseComponents } from './indicator-range';

export const TIME_RANGES = ['7d', '30d', '3m'] as const;
export type TimeRange = (typeof TIME_RANGES)[number];

const DAY_MS = 24 * 60 * 60 * 1000;
const RANGE_DAYS: Record<TimeRange, number> = { '7d': 7, '30d': 30, '3m': 90 };

export type IndicatorTrend = 'stable' | 'rising' | 'falling';

/** Cambio relativo (entre el inicio y el final de la serie) por debajo del cual se considera estable. */
const STABLE_THRESHOLD = 0.03;
/**
 * Altura mínima del eje Y por tipo (en la unidad del indicador). Evita que una
 * variación clínicamente irrelevante (118 -> 122 mmHg) se dibuje como un pico.
 */
const MIN_DOMAIN_SPAN_BY_TYPE: Record<string, number> = {
  'Blood pressure': 20,
  Glucose: 30,
  Weight: 4,
  Temperature: 1.5,
};
/** Para tipos sin entrada propia: % del valor medio. */
const DEFAULT_MIN_SPAN_RATIO = 0.15;

export type SeriesPoint = { x: number; y: number };

const timeOf = (record: HealthIndicatorRecord) => Date.parse(record.dateHour);

/** Registros de un tipo, del más reciente al más antiguo. */
export function recordsOfType(
  records: HealthIndicatorRecord[],
  typeName: string | undefined,
): HealthIndicatorRecord[] {
  if (!typeName) return [];
  return records.filter((r) => r.typeName === typeName).sort((a, b) => timeOf(b) - timeOf(a));
}

/** El registro más reciente de cada tipo, en el orden en que aparece cada tipo por primera vez. */
export function latestByType(records: HealthIndicatorRecord[]): HealthIndicatorRecord[] {
  const latest = new Map<string, HealthIndicatorRecord>();
  for (const record of records) {
    const current = latest.get(record.typeName);
    if (!current || timeOf(record) > timeOf(current)) latest.set(record.typeName, record);
  }
  return [...latest.values()];
}

/** Conserva los registros de los últimos N días respecto a `now`. */
export function filterByRange(
  records: HealthIndicatorRecord[],
  range: TimeRange,
  now: Date = new Date(),
): HealthIndicatorRecord[] {
  const cutoff = now.getTime() - RANGE_DAYS[range] * DAY_MS;
  return records.filter((r) => timeOf(r) >= cutoff);
}

/**
 * Valor que se grafica: el primer componente del registro. En presión arterial
 * es la sistólica ("120/80" -> 120). NaN si no es numérico.
 */
export function primaryValue(rawValue: string): number {
  return parseComponents(rawValue)[0];
}

/** Serie cronológica (antigua -> reciente) lista para graficar; descarta valores no numéricos. */
export function buildSeries(records: HealthIndicatorRecord[]): SeriesPoint[] {
  return records
    .map((r) => ({ x: timeOf(r), y: primaryValue(r.value) }))
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
    .sort((a, b) => a.x - b.x);
}

const mean = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;

/**
 * Compara el promedio del primer tercio de la serie con el del último. null si
 * hay menos de 2 mediciones (no hay tendencia que calcular).
 */
export function getTrend(values: number[]): IndicatorTrend | null {
  if (values.length < 2) return null;

  const third = Math.max(1, Math.floor(values.length / 3));
  const start = mean(values.slice(0, third));
  const end = mean(values.slice(-third));
  if (start === 0) return end === 0 ? 'stable' : end > 0 ? 'rising' : 'falling';

  const change = (end - start) / Math.abs(start);
  if (Math.abs(change) < STABLE_THRESHOLD) return 'stable';
  return change > 0 ? 'rising' : 'falling';
}

/** Rango del eje Y centrado en los datos y con una altura mínima según el tipo. */
export function chartDomain(values: number[], typeName?: string): [number, number] {
  if (values.length === 0) return [0, 1];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const center = (min + max) / 2;
  const minSpan =
    (typeName && MIN_DOMAIN_SPAN_BY_TYPE[typeName]) || Math.abs(center) * DEFAULT_MIN_SPAN_RATIO;
  const span = Math.max(max - min, minSpan);
  return [center - span / 2, center + span / 2];
}

export type SeriesStats = { average: number; min: number; max: number };

/** Promedio, mínimo y máximo del período. null si no hay valores. */
export function summarizeSeries(values: number[]): SeriesStats | null {
  if (values.length === 0) return null;
  return { average: mean(values), min: Math.min(...values), max: Math.max(...values) };
}

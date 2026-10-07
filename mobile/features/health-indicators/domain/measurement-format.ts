// features/health-indicators/domain/measurement-format.ts
import { formatTime12h } from '@/lib/date-format';

// Formato fijo ("11 sep", "08:30 AM") en vez de toLocale*: la abreviatura del mes
// y el AM/PM cambian según el motor de Intl y la versión de ICU del dispositivo.

const MONTHS_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

/** "11 sep" */
export function formatMeasurementDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS_SHORT[date.getMonth()]}`;
}

/** "08:30 AM" */
export const formatMeasurementTime = (isoDate: string): string => formatTime12h(new Date(isoDate));

/** Etiquetas [inicio, fin] del eje X de una serie cronológica. undefined si no hay puntos. */
export function seriesDateLabels(points: { x: number }[]): [string, string] | undefined {
  if (points.length === 0) return undefined;
  const label = (timestamp: number) => formatMeasurementDate(new Date(timestamp).toISOString());
  return [label(points[0].x), label(points[points.length - 1].x)];
}

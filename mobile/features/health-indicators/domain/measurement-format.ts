// features/health-indicators/domain/measurement-format.ts
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
export function formatMeasurementTime(isoDate: string): string {
  const date = new Date(isoDate);
  const hours = date.getHours();
  const period = hours < 12 ? 'AM' : 'PM';
  const hours12 = String(hours % 12 || 12).padStart(2, '0');
  return `${hours12}:${String(date.getMinutes()).padStart(2, '0')} ${period}`;
}

/** Etiquetas [inicio, fin] del eje X de una serie cronológica. undefined si no hay puntos. */
export function seriesDateLabels(points: { x: number }[]): [string, string] | undefined {
  if (points.length === 0) return undefined;
  const label = (timestamp: number) => formatMeasurementDate(new Date(timestamp).toISOString());
  return [label(points[0].x), label(points[points.length - 1].x)];
}

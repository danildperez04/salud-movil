// lib/date-format.ts
// Formato fijo en vez de toLocale*: el AM/PM y las abreviaturas cambian según
// el motor de Intl y la versión de ICU del dispositivo.

const pad = (n: number) => String(n).padStart(2, '0');

/** Date -> "08:30 AM" */
export function formatTime12h(date: Date): string {
  const hours = date.getHours();
  const period = hours < 12 ? 'AM' : 'PM';
  return `${pad(hours % 12 || 12)}:${pad(date.getMinutes())} ${period}`;
}

/** "10:00 AM" -> 600, "02:30 PM" -> 870. Formato inválido -> 0. */
export function timeLabelToMinutes(label: string): number {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(label.trim());
  if (!match) return 0;
  const hours = (Number(match[1]) % 12) + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  return hours * 60 + Number(match[2]);
}

/** Date -> "2026-05-15" con la fecha LOCAL (toISOString usaría UTC). */
export function toLocalIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Hoy a las 00:00 (hora local). */
export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/** Día de `date` a las 00:00 (hora local). */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const MONTHS_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** Date -> "15 de mayo de 2026" */
export function formatDateLong(date: Date): string {
  return `${date.getDate()} de ${MONTHS_LONG[date.getMonth()]} de ${date.getFullYear()}`;
}

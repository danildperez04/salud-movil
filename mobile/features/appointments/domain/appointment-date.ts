// features/appointments/domain/appointment-date.ts

/**
 * "2026-05-15" -> Date en hora LOCAL. `new Date('2026-05-15')` se interpreta
 * como UTC y en zonas con offset negativo (Centroamérica) cae el día anterior.
 */
export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** "05" */
export const formatDay = (date: Date) => String(date.getDate()).padStart(2, '0');

/** "MAY" */
export const formatMonthShort = (date: Date) =>
  date.toLocaleDateString('es', { month: 'short' }).replace('.', '').toUpperCase();

/** "15 de mayo" */
export const formatLongDate = (date: Date) =>
  date.toLocaleDateString('es', { day: 'numeric', month: 'long' });

const pad = (n: number) => String(n).padStart(2, '0');

/** Date -> "2026-05-15" con la fecha LOCAL (toISOString usaría UTC). */
export function toLocalIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Día de `date` con la hora de `time`. */
export function combineDateAndTime(date: Date, time: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
  );
}

/** "10:00 AM" -> 600, "02:30 PM" -> 870. Formato inválido -> 0. */
export function timeLabelToMinutes(label: string): number {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(label.trim());
  if (!match) return 0;
  const hours = (Number(match[1]) % 12) + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  return hours * 60 + Number(match[2]);
}

/** Orden cronológico: por fecha y, dentro del día, por hora. */
export function compareAppointments(
  a: { date: string; time: string },
  b: { date: string; time: string },
): number {
  return a.date.localeCompare(b.date) || timeLabelToMinutes(a.time) - timeLabelToMinutes(b.time);
}

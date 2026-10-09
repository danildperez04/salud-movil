// features/appointments/domain/appointment-date.ts
import { timeLabelToMinutes } from '@/lib/date-format';

export { parseLocalDate } from '@/lib/date-format';

/** "05" */
export const formatDay = (date: Date) => String(date.getDate()).padStart(2, '0');

/** "MAY" */
export const formatMonthShort = (date: Date) =>
  date.toLocaleDateString('es', { month: 'short' }).replace('.', '').toUpperCase();

/** "15 de mayo" */
export const formatLongDate = (date: Date) =>
  date.toLocaleDateString('es', { day: 'numeric', month: 'long' });

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

/** Orden cronológico: por fecha y, dentro del día, por hora. */
export function compareAppointments(
  a: { date: string; time: string },
  b: { date: string; time: string },
): number {
  return a.date.localeCompare(b.date) || timeLabelToMinutes(a.time) - timeLabelToMinutes(b.time);
}

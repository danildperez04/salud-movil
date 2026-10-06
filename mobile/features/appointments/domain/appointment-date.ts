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

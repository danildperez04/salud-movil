// features/reminders/domain/reminder-days.ts
// Días de la semana de un recordatorio. Se guardan como índices 0-6 con el
// lunes en 0 (el orden del diseño). Sin dependencias de React.
import { REMINDERS_LABELS } from '@/constants/labels';

export const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

export type FrequencyPreset = 'daily' | 'weekdays' | 'weekend' | 'custom';

export const PRESET_DAYS: Record<Exclude<FrequencyPreset, 'custom'>, number[]> = {
  daily: ALL_DAYS,
  weekdays: [0, 1, 2, 3, 4],
  weekend: [5, 6],
};

/** Opciones del selector de frecuencia, en el orden en que se muestran. */
export const FREQUENCY_PRESETS: FrequencyPreset[] = ['daily', 'weekdays', 'weekend', 'custom'];

const sameDays = (a: number[], b: number[]) =>
  a.length === b.length && a.every((day, index) => day === b[index]);

const normalize = (days: number[]) => [...new Set(days)].sort((a, b) => a - b);

/** Preset al que equivalen los días elegidos; `custom` si no coinciden con ninguno. */
export function getFrequencyPreset(days: number[]): FrequencyPreset {
  const sorted = normalize(days);
  const match = (Object.keys(PRESET_DAYS) as Exclude<FrequencyPreset, 'custom'>[]).find((key) =>
    sameDays(sorted, PRESET_DAYS[key]),
  );
  return match ?? 'custom';
}

/** Agrega el día si no estaba y lo quita si estaba. El resultado queda ordenado. */
export function toggleDay(days: number[], day: number): number[] {
  return days.includes(day) ? days.filter((d) => d !== day) : normalize([...days, day]);
}

/** "Todos los días", "Entre semana"… o, si es personalizado, "Lunes, Miércoles, Viernes". */
export function describeDays(days: number[]): string {
  const preset = getFrequencyPreset(days);
  if (preset !== 'custom') return REMINDERS_LABELS.presets[preset];
  return normalize(days)
    .map((day) => REMINDERS_LABELS.weekdays[day].name)
    .join(', ');
}

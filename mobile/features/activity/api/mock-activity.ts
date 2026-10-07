// features/activity/api/mock-activity.ts
//
// Mock temporal — el backend no expone el registro de actividad física todavía.
// Cuando exista el endpoint, reemplazar estas funciones por apiClient sin tocar la pantalla.
import { toLocalIsoDate } from '@/lib/date-format';
import type { ActivityIntensity, ActivityType } from '../domain/activity-catalogs';

export type ActivityEntry = {
  id: string;
  /** "YYYY-MM-DD" (un registro por día) */
  date: string;
  /** false: el día se registró como descanso */
  done: boolean;
  type?: ActivityType;
  minutes?: number;
  intensity?: ActivityIntensity;
  note?: string;
};

// Fechas relativas a hoy para que el mock siempre tenga actividad de la última semana.
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toLocalIsoDate(date);
};

let entries: ActivityEntry[] = [
  { id: '1', date: daysAgo(1), done: true, type: 'walk', minutes: 35, intensity: 'moderate' },
  { id: '2', date: daysAgo(3), done: true, type: 'bike', minutes: 30, intensity: 'moderate' },
  { id: '3', date: daysAgo(5), done: true, type: 'dance', minutes: 30, intensity: 'light' },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockActivity(): Promise<ActivityEntry[]> {
  await delay(250);
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

/** Guarda el registro del día; si ya había uno de esa fecha, lo reemplaza. */
export async function saveMockActivityEntry(
  input: Omit<ActivityEntry, 'id'>,
): Promise<ActivityEntry> {
  await delay(300);
  const record: ActivityEntry = { ...input, id: String(Date.now()) };
  entries = [...entries.filter((entry) => entry.date !== input.date), record];
  return record;
}

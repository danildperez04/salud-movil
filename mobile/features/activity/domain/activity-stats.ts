// features/activity/domain/activity-stats.ts
// Estadísticas de la semana y textos de cada día. Sin React.
import {
  ACTIVITY_INTENSITY_LABELS,
  ACTIVITY_LABELS,
  ACTIVITY_TYPE_LABELS,
} from '@/constants/labels';
import { formatShortDayMonth, parseLocalDate, startOfDay, toLocalIsoDate } from '@/lib/date-format';
import { joinParts } from '@/lib/text-format';
import type { ActivityEntry } from '../api/mock-activity';

/** Días con ejercicio que se buscan lograr cada semana. */
export const WEEKLY_GOAL_DAYS = 4;
const WEEK_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export type WeeklyStats = { activeDays: number; minutes: number };

/** Días activos y minutos de los últimos 7 días (hoy incluido). */
export function getWeeklyStats(entries: ActivityEntry[], today: Date = new Date()): WeeklyStats {
  const first = new Date(today);
  first.setDate(first.getDate() - (WEEK_DAYS - 1));
  const from = toLocalIsoDate(first);
  const to = toLocalIsoDate(today);

  const active = entries.filter((entry) => entry.done && entry.date >= from && entry.date <= to);

  return {
    activeDays: new Set(active.map((entry) => entry.date)).size,
    minutes: active.reduce((total, entry) => total + (entry.minutes ?? 0), 0),
  };
}

/** "Hoy" · "Ayer" · "9 ago" */
export function relativeDayLabel(isoDate: string, today: Date = new Date()): string {
  const date = parseLocalDate(isoDate);
  const daysAgo = Math.round((startOfDay(today).getTime() - startOfDay(date).getTime()) / DAY_MS);

  if (daysAgo === 0) return ACTIVITY_LABELS.today;
  if (daysAgo === 1) return ACTIVITY_LABELS.yesterday;
  return formatShortDayMonth(date);
}

/** "Ayer · Caminata" · "Hoy · Descanso" */
export function describeEntryTitle(entry: ActivityEntry, today?: Date): string {
  const activity =
    entry.done && entry.type ? ACTIVITY_TYPE_LABELS[entry.type] : ACTIVITY_LABELS.rest;
  return joinParts([relativeDayLabel(entry.date, today), activity]);
}

/** "35 min · Intensidad moderada" · "No se registró ejercicio" */
export function describeEntryDetails(entry: ActivityEntry): string {
  if (!entry.done) return ACTIVITY_LABELS.noExercise;
  return joinParts([
    entry.minutes === undefined ? undefined : ACTIVITY_LABELS.minutesShort(entry.minutes),
    entry.intensity && ACTIVITY_LABELS.intensity(ACTIVITY_INTENSITY_LABELS[entry.intensity]),
  ]);
}

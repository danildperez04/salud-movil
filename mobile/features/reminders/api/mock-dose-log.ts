// features/reminders/api/mock-dose-log.ts
//
// Mock temporal — el backend guarda la confirmación de cada toma en medication_reminder
// (confirmation_date + estado "Confirmed"). Cuando el endpoint exista, reemplazar estas funciones
// por apiClient sin tocar las pantallas.
// TODO: cat_notification_state no tiene un estado "omitida" (Pending/Sent/Confirmed/Failed): el
// backend necesita uno para distinguir "omití la dosis" de "no respondí".
import { toLocalIsoDate } from '@/lib/date-format';
import type { DoseLogEntry, DoseResponse } from '../domain/dose-schedule';

const HISTORY_DAYS = 14;

// Historial determinista de los dos recordatorios activos del mock, relativo a hoy: casi todo
// confirmado, con algunas tomas olvidadas (sin respuesta) y una omitida a propósito.
const HOUR_BY_REMINDER: Record<string, number> = { '1': 8, '2': 12 };
const FORGOTTEN_DAYS_AGO: Record<string, number[]> = { '1': [3, 10], '2': [13] };
const SKIPPED_DAYS_AGO: Record<string, number[]> = { '2': [4] };

function buildHistory(): DoseLogEntry[] {
  return Object.entries(HOUR_BY_REMINDER).flatMap(([reminderId, hour]) =>
    Array.from({ length: HISTORY_DAYS }, (_, index) => index + 1)
      .filter((daysAgo) => !FORGOTTEN_DAYS_AGO[reminderId]?.includes(daysAgo))
      .map((daysAgo): DoseLogEntry => {
        const day = new Date();
        day.setDate(day.getDate() - daysAgo);
        const respondedAt = new Date(day);
        respondedAt.setHours(hour, 10, 0, 0);
        return {
          reminderId,
          date: toLocalIsoDate(day),
          status: SKIPPED_DAYS_AGO[reminderId]?.includes(daysAgo) ? 'skipped' : 'taken',
          respondedAt: respondedAt.toISOString(),
        };
      }),
  );
}

let log: DoseLogEntry[] = buildHistory();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockDoseLog(): Promise<DoseLogEntry[]> {
  await delay(200);
  return log;
}

/** Guarda la respuesta de una toma; si ya había una de esa toma, la reemplaza. */
export async function recordMockDose(input: {
  reminderId: string;
  date: string;
  status: DoseResponse;
}): Promise<DoseLogEntry> {
  await delay(200);
  const entry: DoseLogEntry = { ...input, respondedAt: new Date().toISOString() };
  log = [
    ...log.filter((e) => !(e.reminderId === input.reminderId && e.date === input.date)),
    entry,
  ];
  return entry;
}

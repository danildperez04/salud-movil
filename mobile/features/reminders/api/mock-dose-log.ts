// features/reminders/api/mock-dose-log.ts
//
// Mock temporal del registro de tomas: el backend solo sabe si una toma se confirmó
// (confirmation_date + estado "Confirmed", ver confirmMedicationDose) y solo permite confirmar
// las que todavía están en el feed. Lo demás ("omití", y tomas ya vencidas) queda en el
// dispositivo.
// TODO: cat_notification_state no tiene un estado "omitida" (Pending/Sent/Confirmed/Failed): el
// backend necesita uno para distinguir "omití la dosis" de "no respondí".
import { createLocalOverlay } from '@/lib/local-overlay';
import { doseKey, type DoseLogEntry, type DoseResponse } from '../domain/dose-schedule';

const localDoses = createLocalOverlay<DoseLogEntry & { id: string }>();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Las respuestas guardadas en el dispositivo. */
export const getLocalDoseLog = (): DoseLogEntry[] => localDoses.apply([]);

/** Guarda la respuesta de una toma; si ya había una de esa toma, la reemplaza. */
export async function recordMockDose(input: {
  reminderId: string;
  date: string;
  status: DoseResponse;
}): Promise<DoseLogEntry> {
  await delay(200);
  const entry: DoseLogEntry = { ...input, respondedAt: new Date().toISOString() };
  localDoses.upsert({ ...entry, id: doseKey(entry.reminderId, entry.date) });
  return entry;
}

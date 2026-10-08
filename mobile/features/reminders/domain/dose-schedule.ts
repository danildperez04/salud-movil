// features/reminders/domain/dose-schedule.ts
// Qué tomas tocaban cada día y en qué estado está cada una. Sin dependencias de React.
//
// TODO: el backend genera una fila de medication_reminder por cada toma (con confirmation_date
// cuando el paciente confirma). Mientras tanto las tomas se derivan de los recordatorios
// configurados, usando su configuración actual también para los días pasados.
import { startOfDay, timeLabelToDate, toLocalIsoDate } from '@/lib/date-format';

export type DoseStatus = 'taken' | 'skipped' | 'pending';
/** Lo que el paciente puede responder; `pending` es no haber respondido todavía. */
export type DoseResponse = Exclude<DoseStatus, 'pending'>;

export type DoseLogEntry = {
  reminderId: string;
  /** "YYYY-MM-DD" de la toma */
  date: string;
  status: DoseResponse;
  /** ISO 8601 */
  respondedAt: string;
};

type ScheduleReminder = {
  id: string;
  medicationId: string;
  /** "08:00 AM" */
  time: string;
  /** 0-6 con el lunes en 0 */
  days: number[];
  enabled: boolean;
  /** ISO 8601 */
  createdAt: string;
};

export type DueDose = {
  reminderId: string;
  medicationId: string;
  /** "YYYY-MM-DD" */
  date: string;
  scheduledAt: Date;
  status: DoseStatus;
};

/** Lunes = 0, como se guardan los días de los recordatorios. */
const weekdayIndex = (date: Date) => (date.getDay() + 6) % 7;

const nextDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

export const doseKey = (reminderId: string, date: string) => `${reminderId}:${date}`;

/**
 * Tomas de los días entre `from` y `to` (ambos incluidos), de la más antigua a la más reciente.
 * Solo cuentan los recordatorios activos de medicamentos activos, y no las tomas anteriores
 * a la creación del recordatorio.
 */
export function buildDueDoses({
  reminders,
  activeMedicationIds,
  log,
  from,
  to,
}: {
  reminders: readonly ScheduleReminder[];
  activeMedicationIds: ReadonlySet<string>;
  log: readonly DoseLogEntry[];
  from: Date;
  to: Date;
}): DueDose[] {
  const responses = new Map(
    log.map((entry) => [doseKey(entry.reminderId, entry.date), entry.status]),
  );
  const doses: DueDose[] = [];

  for (let day = startOfDay(from); day <= to; day = nextDay(day)) {
    for (const reminder of reminders) {
      if (!reminder.enabled || !activeMedicationIds.has(reminder.medicationId)) continue;
      if (!reminder.days.includes(weekdayIndex(day))) continue;

      const scheduledAt = timeLabelToDate(reminder.time, day);
      if (scheduledAt.getTime() < Date.parse(reminder.createdAt)) continue;

      const date = toLocalIsoDate(day);
      doses.push({
        reminderId: reminder.id,
        medicationId: reminder.medicationId,
        date,
        scheduledAt,
        status: responses.get(doseKey(reminder.id, date)) ?? 'pending',
      });
    }
  }

  return doses.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
}

/** Una toma pendiente cuya hora ya pasó: el paciente no la confirmó. */
export const isUnconfirmed = (dose: Pick<DueDose, 'status' | 'scheduledAt'>, now: Date) =>
  dose.status === 'pending' && dose.scheduledAt.getTime() <= now.getTime();

// features/reminders/domain/reminder-records.ts
// Recordatorios tal como los usan las pantallas, y su conversión desde lo que entrega la API
// (los horarios de los medicamentos y el feed `GET /patients/me/reminders`).
// Sin dependencias de React.
import { toLocalIsoDate } from '@/lib/date-format';
import type { MedicationRecord } from '@/features/medications/domain/medication-record';
import type { DoseLogEntry } from './dose-schedule';
import type { NotifyBefore } from './reminder-forms';

export type MedicationReminder = {
  /** id del horario (medication_schedule) o, en los creados en el dispositivo, uno local */
  id: string;
  /** id de MedicationRecord */
  medicationId: string;
  /** "08:00 AM" */
  time: string;
  /** 0-6 con el lunes en 0 */
  days: number[];
  enabled: boolean;
  repeatIfUnconfirmed: boolean;
  /** ISO 8601: las tomas anteriores a esta fecha no cuentan como pendientes */
  createdAt: string;
};

export type AppointmentReminder = {
  /** el backend genera un aviso por cita: se identifica con el id de la cita */
  id: string;
  /** id de AppointmentRecord */
  appointmentId: string;
  notifyBefore: NotifyBefore;
  /** el aviso principal está activo */
  pushEnabled: boolean;
  secondNotice: boolean;
};

// --- Feed de recordatorios de la API ---------------------------------------

export type ApiMedicationReminderItem = {
  type: 'medication';
  /** id de la toma (medication_reminder) */
  id: string;
  medicationId: string;
  scheduleId: string;
  /** ISO 8601: hora programada de la toma */
  dateHour: string;
  /** ISO 8601 */
  confirmedAt: string | null;
};

export type ApiAppointmentReminderItem = {
  type: 'appointment';
  /** el feed usa el id de la cita */
  id: string;
  appointmentId: string;
  /** ISO 8601: hora de la cita */
  dateHour: string;
  /** ISO 8601: cuándo se avisa */
  reminderAt: string;
};

export type ApiReminderItem = ApiMedicationReminderItem | ApiAppointmentReminderItem;

// --- Horarios -> recordatorios de medicamento ------------------------------

/** Cada horario de un medicamento es un recordatorio de toma. */
export function medicationRemindersFrom(medications: MedicationRecord[]): MedicationReminder[] {
  return medications.flatMap((medication) =>
    medication.schedules.map((schedule) => ({
      id: schedule.id,
      medicationId: medication.id,
      time: schedule.time,
      days: schedule.days,
      enabled: medication.active,
      repeatIfUnconfirmed: false,
      // las tomas anteriores al inicio del tratamiento no cuentan como pendientes
      createdAt: medication.startDate
        ? new Date(`${medication.startDate}T00:00:00`).toISOString()
        : new Date(0).toISOString(),
    })),
  );
}

// --- Feed -> avisos de cita -------------------------------------------------

const MINUTE_MS = 60 * 1000;
const NOTIFY_BEFORE_MINUTES: [Exclude<NotifyBefore, 'same-day'>, number][] = [
  ['24h', 24 * 60],
  ['12h', 12 * 60],
  ['2h', 2 * 60],
  ['1h', 60],
  ['30m', 30],
];

/** La anticipación de la lista que más se acerca a los minutos entre el aviso y la cita. */
export function notifyBeforeFor(appointmentIso: string, reminderIso: string): NotifyBefore {
  const minutes = (Date.parse(appointmentIso) - Date.parse(reminderIso)) / MINUTE_MS;
  return NOTIFY_BEFORE_MINUTES.reduce((best, option) =>
    Math.abs(option[1] - minutes) < Math.abs(best[1] - minutes) ? option : best,
  )[0];
}

export function appointmentRemindersFrom(feed: ApiReminderItem[]): AppointmentReminder[] {
  return feed.flatMap((item) =>
    item.type === 'appointment'
      ? [
          {
            id: item.appointmentId,
            appointmentId: item.appointmentId,
            notifyBefore: notifyBeforeFor(item.dateHour, item.reminderAt),
            pushEnabled: true,
            secondNotice: false,
          },
        ]
      : [],
  );
}

// --- Feed -> tomas -----------------------------------------------------------

/** Tomas que el paciente ya confirmó en el backend. */
export function confirmedDosesFrom(feed: ApiReminderItem[]): DoseLogEntry[] {
  return feed.flatMap((item) =>
    item.type === 'medication' && item.confirmedAt
      ? [
          {
            reminderId: item.scheduleId,
            date: toLocalIsoDate(new Date(item.dateHour)),
            status: 'taken' as const,
            respondedAt: item.confirmedAt,
          },
        ]
      : [],
  );
}

/** La toma del backend que corresponde a "este horario, este día", si todavía está en el feed. */
export function findDoseRow(
  feed: ApiReminderItem[],
  scheduleId: string,
  date: string,
): ApiMedicationReminderItem | undefined {
  return feed.find(
    (item): item is ApiMedicationReminderItem =>
      item.type === 'medication' &&
      item.scheduleId === scheduleId &&
      toLocalIsoDate(new Date(item.dateHour)) === date,
  );
}

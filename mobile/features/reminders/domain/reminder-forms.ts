// features/reminders/domain/reminder-forms.ts
// Validación de los formularios de recordatorio y cálculo del momento del aviso.
// Sin dependencias de React.
import { z } from 'zod';
import { REMINDERS_LABELS } from '@/constants/labels';
import { timeLabelToMinutes } from '@/lib/date-format';
import { parseLocalDate } from '@/features/appointments/domain/appointment-date';

const medicationErrors = REMINDERS_LABELS.medication.errors;
const appointmentErrors = REMINDERS_LABELS.appointment.errors;

export const medicationReminderSchema = z.object({
  medicationId: z.string().min(1, medicationErrors.medicationRequired),
  time: z.date({ error: medicationErrors.timeRequired }),
  days: z.array(z.number()).min(1, medicationErrors.daysRequired),
  enabled: z.boolean(),
  repeatIfUnconfirmed: z.boolean(),
});

export type MedicationReminderFormValues = z.infer<typeof medicationReminderSchema>;

export const NOTIFY_BEFORE_OPTIONS = ['same-day', '24h', '12h', '2h', '1h', '30m'] as const;
export type NotifyBefore = (typeof NOTIFY_BEFORE_OPTIONS)[number];

export const appointmentReminderSchema = z.object({
  appointmentId: z.string().min(1, appointmentErrors.appointmentRequired),
  notifyBefore: z.enum(NOTIFY_BEFORE_OPTIONS),
  pushEnabled: z.boolean(),
  secondNotice: z.boolean(),
});

export type AppointmentReminderFormValues = z.infer<typeof appointmentReminderSchema>;

const HOUR_MS = 60 * 60 * 1000;
const NOTIFY_BEFORE_MS: Record<Exclude<NotifyBefore, 'same-day'>, number> = {
  '24h': 24 * HOUR_MS,
  '12h': 12 * HOUR_MS,
  '2h': 2 * HOUR_MS,
  '1h': HOUR_MS,
  '30m': 30 * 60 * 1000,
};
/** Hora a la que llega el aviso "el mismo día" (8:00 AM). */
const SAME_DAY_HOUR = 8;

type AppointmentSlot = { date: string; time: string };

/** Fecha y hora de la cita ("2026-05-15" + "10:00 AM"). */
export function getAppointmentDateTime({ date, time }: AppointmentSlot): Date {
  const minutes = timeLabelToMinutes(time);
  const result = parseLocalDate(date);
  result.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return result;
}

/** Momento en que debe sonar el aviso principal. */
export function getReminderTriggerTime(
  appointment: AppointmentSlot,
  notifyBefore: NotifyBefore,
): Date {
  const start = getAppointmentDateTime(appointment);
  if (notifyBefore === 'same-day') {
    const result = new Date(start);
    result.setHours(SAME_DAY_HOUR, 0, 0, 0);
    return result;
  }
  return new Date(start.getTime() - NOTIFY_BEFORE_MS[notifyBefore]);
}

/** La cita todavía no ocurrió. */
export function isAppointmentUpcoming(
  appointment: AppointmentSlot,
  now: Date = new Date(),
): boolean {
  return getAppointmentDateTime(appointment).getTime() > now.getTime();
}

/** El aviso principal ya quedó en el pasado respecto a la cita elegida. */
export function isReminderTimePassed(
  appointment: AppointmentSlot,
  notifyBefore: NotifyBefore,
  now: Date = new Date(),
): boolean {
  return getReminderTriggerTime(appointment, notifyBefore).getTime() <= now.getTime();
}

// features/reminders/api/mock-reminders.ts
//
// Mock temporal — el backend no expone recordatorios todavía. Cuando exista el
// endpoint, reemplazar estas funciones por apiClient sin tocar las pantallas.
// TODO: programar las notificaciones locales (expo-notifications) al guardar.
import type { NotifyBefore } from '../domain/reminder-forms';

export type MedicationReminder = {
  id: string;
  /** id de MedicationRecord */
  medicationId: string;
  /** "08:00 AM" */
  time: string;
  /** 0-6 con el lunes en 0 */
  days: number[];
  enabled: boolean;
  repeatIfUnconfirmed: boolean;
};

export type AppointmentReminder = {
  id: string;
  /** id de AppointmentRecord */
  appointmentId: string;
  notifyBefore: NotifyBefore;
  /** el aviso principal está activo */
  pushEnabled: boolean;
  secondNotice: boolean;
};

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

let medicationReminders: MedicationReminder[] = [
  {
    id: '1',
    medicationId: '1',
    time: '08:00 AM',
    days: EVERY_DAY,
    enabled: true,
    repeatIfUnconfirmed: false,
  },
  {
    id: '2',
    medicationId: '2',
    time: '12:00 PM',
    days: EVERY_DAY,
    enabled: true,
    repeatIfUnconfirmed: true,
  },
  {
    id: '3',
    medicationId: '3',
    time: '08:00 AM',
    days: [0, 1, 2, 3, 4],
    enabled: false,
    repeatIfUnconfirmed: false,
  },
];

let appointmentReminders: AppointmentReminder[] = [
  { id: '1', appointmentId: '1', notifyBefore: '24h', pushEnabled: true, secondNotice: false },
  { id: '2', appointmentId: '2', notifyBefore: '2h', pushEnabled: true, secondNotice: true },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockMedicationReminders(): Promise<MedicationReminder[]> {
  await delay(300);
  return medicationReminders;
}

/** Crea el recordatorio si no trae `id`; si lo trae, lo reemplaza. */
export async function saveMockMedicationReminder(
  input: Omit<MedicationReminder, 'id'> & { id?: string },
): Promise<MedicationReminder> {
  await delay(300);
  const record: MedicationReminder = { ...input, id: input.id ?? String(Date.now()) };
  medicationReminders = input.id
    ? medicationReminders.map((r) => (r.id === input.id ? record : r))
    : [...medicationReminders, record];
  return record;
}

export async function deleteMockMedicationReminder(id: string): Promise<void> {
  await delay(300);
  medicationReminders = medicationReminders.filter((r) => r.id !== id);
}

export async function fetchMockAppointmentReminders(): Promise<AppointmentReminder[]> {
  await delay(300);
  return appointmentReminders;
}

/** Crea el recordatorio si no trae `id`; si lo trae, lo reemplaza. */
export async function saveMockAppointmentReminder(
  input: Omit<AppointmentReminder, 'id'> & { id?: string },
): Promise<AppointmentReminder> {
  await delay(300);
  const record: AppointmentReminder = { ...input, id: input.id ?? String(Date.now()) };
  appointmentReminders = input.id
    ? appointmentReminders.map((r) => (r.id === input.id ? record : r))
    : [...appointmentReminders, record];
  return record;
}

export async function deleteMockAppointmentReminder(id: string): Promise<void> {
  await delay(300);
  appointmentReminders = appointmentReminders.filter((r) => r.id !== id);
}

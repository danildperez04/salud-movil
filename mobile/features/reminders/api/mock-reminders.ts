// features/reminders/api/mock-reminders.ts
//
// Mock temporal de la configuración de recordatorios: el backend genera los avisos solo
// (a partir de los horarios de los medicamentos y de las citas) y no tiene endpoints para que
// el paciente los cree, edite o borre. Estos cambios quedan solo en el dispositivo y se
// superponen a los recordatorios reales.
// TODO: programar las notificaciones locales (expo-notifications) al guardar.
import { createLocalOverlay, newLocalId } from '@/lib/local-overlay';
import type { AppointmentReminder, MedicationReminder } from '../domain/reminder-records';

const medicationChanges = createLocalOverlay<MedicationReminder>();
const appointmentChanges = createLocalOverlay<AppointmentReminder>();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const withLocalMedicationReminders = (remote: MedicationReminder[]) =>
  medicationChanges.apply(remote);

export const withLocalAppointmentReminders = (remote: AppointmentReminder[]) =>
  appointmentChanges.apply(remote);

/** Crea el recordatorio si no trae `id`; si lo trae, lo reemplaza. */
export async function saveMockMedicationReminder(
  input: Omit<MedicationReminder, 'id' | 'createdAt'> & { id?: string; createdAt?: string },
): Promise<MedicationReminder> {
  await delay(300);
  const record: MedicationReminder = {
    ...input,
    id: input.id ?? newLocalId(),
    // editar un recordatorio no reinicia desde cuándo se esperan sus tomas
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
  medicationChanges.upsert(record);
  return record;
}

export async function deleteMockMedicationReminder(id: string): Promise<void> {
  await delay(300);
  medicationChanges.remove(id);
}

/** Crea el recordatorio si no trae `id`; si lo trae, lo reemplaza. */
export async function saveMockAppointmentReminder(
  input: Omit<AppointmentReminder, 'id'> & { id?: string },
): Promise<AppointmentReminder> {
  await delay(300);
  const record: AppointmentReminder = { ...input, id: input.id ?? newLocalId() };
  appointmentChanges.upsert(record);
  return record;
}

export async function deleteMockAppointmentReminder(id: string): Promise<void> {
  await delay(300);
  appointmentChanges.remove(id);
}

// features/appointments/api/mock-appointments.ts
//
// Mock temporal de lo que el paciente todavía no puede hacer en el backend: las citas las
// crea y cancela el personal de salud (POST /patients/:id/appointments, solo staff). Estos
// cambios quedan solo en el dispositivo y se superponen a las citas reales.
// TODO: reemplazar por apiClient cuando exista el endpoint para pacientes.
import { createLocalOverlay, newLocalId } from '@/lib/local-overlay';
import { compareAppointments } from '../domain/appointment-date';
import type { AppointmentRecord } from '../domain/appointment-record';

const localChanges = createLocalOverlay<AppointmentRecord>();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Las citas reales con los cambios locales aplicados, en orden cronológico. */
export const withLocalAppointments = (remote: AppointmentRecord[]) =>
  localChanges.apply(remote).sort(compareAppointments);

export async function cancelMockAppointment(appointment: AppointmentRecord): Promise<void> {
  await delay(300);
  localChanges.upsert({ ...appointment, status: 'Cancelled' });
}

export type CreateAppointmentPayload = Omit<AppointmentRecord, 'id' | 'status'>;

/** Las citas nuevas nacen "Scheduled" (= "Confirmada" en la UI). */
export async function createMockAppointment(
  payload: CreateAppointmentPayload,
): Promise<AppointmentRecord> {
  await delay(400);
  const record: AppointmentRecord = { ...payload, id: newLocalId(), status: 'Scheduled' };
  localChanges.upsert(record);
  return record;
}

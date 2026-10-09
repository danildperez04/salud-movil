// features/appointments/api/appointments-api.ts
import { apiClient } from '@/lib/api-client';
import {
  toAppointmentRecord,
  type ApiAppointment,
  type AppointmentRecord,
} from '../domain/appointment-record';

/**
 * Próximas citas programadas del paciente. El backend no tiene todavía el historial de
 * citas ni acciones del paciente sobre ellas (agendar, cancelar): ver mock-appointments.ts.
 */
export async function fetchAppointments(): Promise<AppointmentRecord[]> {
  const appointments = await apiClient.get<ApiAppointment[]>('/patients/me/appointments/upcoming');
  return appointments.map(toAppointmentRecord);
}

// features/reminders/api/reminders-api.ts
import { apiClient } from '@/lib/api-client';
import type { ApiReminderItem } from '../domain/reminder-records';

/** Máximo que acepta el backend (`windowDays`). */
const WINDOW_DAYS = 31;

/**
 * Próximos avisos del paciente: tomas de medicamento y avisos de cita. Solo trae lo que aún
 * no ocurrió (hora programada >= ahora), no el historial.
 */
export function fetchReminderFeed(): Promise<ApiReminderItem[]> {
  return apiClient.get<ApiReminderItem[]>(`/patients/me/reminders?windowDays=${WINDOW_DAYS}`);
}

/** Marca una toma como confirmada. 409 si ya lo estaba. */
export function confirmMedicationDose(medicationId: string, reminderId: string): Promise<unknown> {
  return apiClient.post(`/patients/me/medications/${medicationId}/reminders/${reminderId}/confirm`);
}

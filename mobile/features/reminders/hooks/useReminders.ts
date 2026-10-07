// features/reminders/hooks/useReminders.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteMockAppointmentReminder,
  deleteMockMedicationReminder,
  fetchMockAppointmentReminders,
  fetchMockMedicationReminders,
  saveMockAppointmentReminder,
  saveMockMedicationReminder,
} from '../api/mock-reminders';

const MEDICATION_REMINDERS_KEY = ['reminders', 'medications'] as const;
const APPOINTMENT_REMINDERS_KEY = ['reminders', 'appointments'] as const;

// TODO: reemplazar los mocks por apiClient cuando el backend exponga el endpoint.

export function useMedicationReminders() {
  return useQuery({ queryKey: MEDICATION_REMINDERS_KEY, queryFn: fetchMockMedicationReminders });
}

export function useSaveMedicationReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveMockMedicationReminder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MEDICATION_REMINDERS_KEY }),
  });
}

export function useDeleteMedicationReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMockMedicationReminder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MEDICATION_REMINDERS_KEY }),
  });
}

export function useAppointmentReminders() {
  return useQuery({ queryKey: APPOINTMENT_REMINDERS_KEY, queryFn: fetchMockAppointmentReminders });
}

export function useSaveAppointmentReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveMockAppointmentReminder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPOINTMENT_REMINDERS_KEY }),
  });
}

export function useDeleteAppointmentReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMockAppointmentReminder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPOINTMENT_REMINDERS_KEY }),
  });
}

/**
 * Recordatorio de una cita concreta y un interruptor para activarlo o
 * silenciarlo (el que muestra el detalle de la cita). Si todavía no existe,
 * al activarlo se crea con un aviso 24 horas antes.
 */
export function useAppointmentReminderToggle(appointmentId: string) {
  const { data: reminders } = useAppointmentReminders();
  const save = useSaveAppointmentReminder();
  const reminder = reminders?.find((r) => r.appointmentId === appointmentId);

  const setEnabled = (enabled: boolean) =>
    save.mutate(
      reminder
        ? { ...reminder, pushEnabled: enabled }
        : { appointmentId, notifyBefore: '24h', pushEnabled: enabled, secondNotice: false },
    );

  // mientras se guarda se muestra el valor pedido, para que el switch responda al instante
  const enabled = save.isPending ? save.variables.pushEnabled : (reminder?.pushEnabled ?? false);

  return { enabled, setEnabled, isPending: save.isPending };
}

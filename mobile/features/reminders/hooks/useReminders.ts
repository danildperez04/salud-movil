// features/reminders/hooks/useReminders.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  loadMedications,
  MEDICATIONS_QUERY_KEY,
} from '@/features/medications/hooks/useMedications';
import { useIsPatient } from '@/hooks/useIsPatient';
import { queryClient as sharedQueryClient } from '@/lib/query-client';
import { fetchReminderFeed } from '../api/reminders-api';
import {
  deleteMockAppointmentReminder,
  deleteMockMedicationReminder,
  saveMockAppointmentReminder,
  saveMockMedicationReminder,
  withLocalAppointmentReminders,
  withLocalMedicationReminders,
} from '../api/mock-reminders';
import { appointmentRemindersFrom, medicationRemindersFrom } from '../domain/reminder-records';

const MEDICATION_REMINDERS_KEY = ['reminders', 'medications'] as const;
const APPOINTMENT_REMINDERS_KEY = ['reminders', 'appointments'] as const;
export const REMINDER_FEED_KEY = ['reminders', 'feed'] as const;

/** Feed de avisos de la API; las varias consultas de una pantalla comparten una sola petición. */
export const loadReminderFeed = (staleTime = 30 * 1000) =>
  sharedQueryClient.fetchQuery({
    queryKey: REMINDER_FEED_KEY,
    queryFn: fetchReminderFeed,
    staleTime,
  });

// Los recordatorios de medicamento salen de los horarios de los medicamentos; los de cita, del
// feed de la API. Crear, editar o borrar es local (ver mock-reminders.ts).

export function useMedicationReminders() {
  const enabled = useIsPatient();
  return useQuery({
    queryKey: MEDICATION_REMINDERS_KEY,
    queryFn: async () => {
      const medications = await sharedQueryClient.fetchQuery({
        queryKey: MEDICATIONS_QUERY_KEY,
        queryFn: loadMedications,
        staleTime: 30 * 1000,
      });
      return withLocalMedicationReminders(medicationRemindersFrom(medications));
    },
    enabled,
  });
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
  const enabled = useIsPatient();
  return useQuery({
    queryKey: APPOINTMENT_REMINDERS_KEY,
    queryFn: async () =>
      withLocalAppointmentReminders(appointmentRemindersFrom(await loadReminderFeed())),
    enabled,
  });
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

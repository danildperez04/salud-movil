// features/reminders/hooks/useDoses.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useMedications } from '@/features/medications/hooks/useMedications';
import { fetchMockDoseLog, recordMockDose } from '../api/mock-dose-log';
import { buildDueDoses, type DoseLogEntry, type DueDose } from '../domain/dose-schedule';
import { useMedicationReminders } from './useReminders';

export const DOSE_LOG_KEY = ['reminders', 'dose-log'] as const;

// TODO: reemplazar los mocks por apiClient cuando el backend exponga las tomas.

export function useDoseLog() {
  return useQuery({ queryKey: DOSE_LOG_KEY, queryFn: fetchMockDoseLog });
}

export type TodayDose = DueDose & { drugName: string; doseLabel: string };

/** Las tomas de hoy con el nombre del medicamento, de la más temprana a la más tarde. */
export function useTodayDoses() {
  const medications = useMedications();
  const reminders = useMedicationReminders();
  const log = useDoseLog();

  const doses = useMemo<TodayDose[]>(() => {
    if (!medications.data || !reminders.data || !log.data) return [];
    const today = new Date();
    const medicationById = new Map(medications.data.map((m) => [m.id, m]));
    const activeMedicationIds = new Set(medications.data.filter((m) => m.active).map((m) => m.id));

    return buildDueDoses({
      reminders: reminders.data,
      activeMedicationIds,
      log: log.data,
      from: today,
      to: today,
    }).map((dose) => ({
      ...dose,
      drugName: medicationById.get(dose.medicationId)?.drugName ?? '',
      doseLabel: medicationById.get(dose.medicationId)?.dose ?? '',
    }));
  }, [medications.data, reminders.data, log.data]);

  return {
    doses,
    isLoading: medications.isLoading || reminders.isLoading || log.isLoading,
  };
}

/** Actualización optimista: el botón cambia al instante; si falla, se revierte. */
export function useRecordDose() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordMockDose,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: DOSE_LOG_KEY });
      const previous = queryClient.getQueryData<DoseLogEntry[]>(DOSE_LOG_KEY);
      queryClient.setQueryData<DoseLogEntry[]>(DOSE_LOG_KEY, (current = []) => [
        ...current.filter((e) => !(e.reminderId === input.reminderId && e.date === input.date)),
        { ...input, respondedAt: new Date().toISOString() },
      ]);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(DOSE_LOG_KEY, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: DOSE_LOG_KEY }),
  });
}

// features/reminders/hooks/useDoses.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useMedications } from '@/features/medications/hooks/useMedications';
import { useIsPatient } from '@/hooks/useIsPatient';
import { ApiError } from '@/lib/api-client';
import { toLocalIsoDate } from '@/lib/date-format';
import { confirmMedicationDose } from '../api/reminders-api';
import { getLocalDoseLog, recordMockDose } from '../api/mock-dose-log';
import { buildDueDoses, doseKey, type DoseLogEntry, type DueDose } from '../domain/dose-schedule';
import { confirmedDosesFrom, findDoseRow } from '../domain/reminder-records';
import { loadReminderFeed, REMINDER_FEED_KEY, useMedicationReminders } from './useReminders';

export const DOSE_LOG_KEY = ['reminders', 'dose-log'] as const;

/**
 * Tomas ya respondidas: las confirmadas en el backend más las respuestas guardadas en el
 * dispositivo ("omití", y las confirmaciones de tomas que el feed ya no trae). Gana la local.
 */
async function loadDoseLog(): Promise<DoseLogEntry[]> {
  const local = getLocalDoseLog();
  const localKeys = new Set(local.map((entry) => doseKey(entry.reminderId, entry.date)));
  const confirmed = confirmedDosesFrom(await loadReminderFeed()).filter(
    (entry) => !localKeys.has(doseKey(entry.reminderId, entry.date)),
  );
  return [...confirmed, ...local];
}

export function useDoseLog() {
  const enabled = useIsPatient();
  return useQuery({ queryKey: DOSE_LOG_KEY, queryFn: loadDoseLog, enabled });
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
    const todayIso = toLocalIsoDate(today);
    const medicationById = new Map(medications.data.map((m) => [m.id, m]));
    // en tratamiento hoy: activo y dentro de sus fechas de inicio y fin
    const inCourseIds = new Set(
      medications.data
        .filter(
          (m) =>
            m.active &&
            (!m.startDate || m.startDate <= todayIso) &&
            (!m.endDate || m.endDate >= todayIso),
        )
        .map((m) => m.id),
    );

    return buildDueDoses({
      reminders: reminders.data,
      activeMedicationIds: inCourseIds,
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

type DoseResponseInput = Parameters<typeof recordMockDose>[0];

/**
 * "Tomé" confirma la toma en el backend cuando todavía está en el feed (la API solo trae
 * lo que aún no pasó); "Omití", y las tomas que ya no están en el feed, solo se guardan
 * en el dispositivo.
 */
async function respondToDose(input: DoseResponseInput) {
  if (input.status === 'taken') {
    const row = findDoseRow(await loadReminderFeed(0), input.reminderId, input.date);
    if (row && !row.confirmedAt) {
      try {
        await confirmMedicationDose(row.medicationId, row.id);
      } catch (error) {
        // 409: ya estaba confirmada (otra sesión); el resultado es el mismo
        if (!(error instanceof ApiError && error.status === 409)) throw error;
      }
    }
  }
  return recordMockDose(input);
}

/** Actualización optimista: el botón cambia al instante; si falla, se revierte. */
export function useRecordDose() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: respondToDose,
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REMINDER_FEED_KEY });
      queryClient.invalidateQueries({ queryKey: DOSE_LOG_KEY });
      // la adherencia del IPCP sale de las tomas confirmadas
      queryClient.invalidateQueries({ queryKey: ['ipcp'] });
    },
  });
}

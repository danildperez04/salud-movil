// features/medications/hooks/useMedications.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsPatient } from '@/hooks/useIsPatient';
import { fetchMedications } from '../api/medications-api';
import {
  createMockMedication,
  toggleMockMedicationActive,
  withLocalMedications,
} from '../api/mock-medications';
import type { MedicationRecord } from '../domain/medication-record';

export const MEDICATIONS_QUERY_KEY = ['medications'] as const;

/** Los medicamentos reales con los cambios locales aplicados. */
export const loadMedications = async () => withLocalMedications(await fetchMedications());

export function useMedications() {
  const enabled = useIsPatient();
  return useQuery({ queryKey: MEDICATIONS_QUERY_KEY, queryFn: loadMedications, enabled });
}

// TODO: crear y activar/desactivar son locales hasta que el backend los exponga al paciente.
export function useCreateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMockMedication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MEDICATIONS_QUERY_KEY }),
  });
}

/**
 * Actualización optimista: el switch cambia (y se anima) al instante en vez de
 * esperar la respuesta del servidor; si falla, se revierte.
 */
export function useToggleMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ medication, active }: { medication: MedicationRecord; active: boolean }) =>
      toggleMockMedicationActive(medication, active),
    onMutate: async ({ medication, active }) => {
      await queryClient.cancelQueries({ queryKey: MEDICATIONS_QUERY_KEY });
      const previous = queryClient.getQueryData<MedicationRecord[]>(MEDICATIONS_QUERY_KEY);
      queryClient.setQueryData<MedicationRecord[]>(MEDICATIONS_QUERY_KEY, (current) =>
        current?.map((item) => (item.id === medication.id ? { ...item, active } : item)),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(MEDICATIONS_QUERY_KEY, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MEDICATIONS_QUERY_KEY });
      // los recordatorios de toma dependen de si el medicamento está activo
      queryClient.invalidateQueries({ queryKey: ['reminders', 'medications'] });
    },
  });
}

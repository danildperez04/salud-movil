// features/medications/hooks/useMedications.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMockMedication,
  fetchMockMedications,
  toggleMockMedicationActive,
  type MedicationRecord,
} from '../api/mock-medications';

const MEDICATIONS_QUERY_KEY = ['medications'] as const;

// TODO: reemplazar los mocks por apiClient (GET/POST/PATCH /medications) cuando
// el backend exponga el endpoint.
export function useMedications() {
  return useQuery({ queryKey: MEDICATIONS_QUERY_KEY, queryFn: fetchMockMedications });
}

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
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleMockMedicationActive(id, active),
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: MEDICATIONS_QUERY_KEY });
      const previous = queryClient.getQueryData<MedicationRecord[]>(MEDICATIONS_QUERY_KEY);
      queryClient.setQueryData<MedicationRecord[]>(MEDICATIONS_QUERY_KEY, (current) =>
        current?.map((medication) =>
          medication.id === id ? { ...medication, active } : medication,
        ),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(MEDICATIONS_QUERY_KEY, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: MEDICATIONS_QUERY_KEY }),
  });
}

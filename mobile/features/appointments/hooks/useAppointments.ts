// features/appointments/hooks/useAppointments.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelMockAppointment,
  fetchMockAppointmentById,
  fetchMockAppointments,
} from '../api/mock-appointments';

const APPOINTMENTS_QUERY_KEY = ['appointments'] as const;

// TODO: reemplazar los mocks por apiClient cuando el backend exponga el endpoint.
export function useAppointments() {
  return useQuery({ queryKey: APPOINTMENTS_QUERY_KEY, queryFn: fetchMockAppointments });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, id],
    queryFn: () => fetchMockAppointmentById(id),
  });
}

export function useCancelAppointment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelMockAppointment(id),
    // invalida la lista y el detalle (comparten el prefijo de la key)
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY }),
  });
}

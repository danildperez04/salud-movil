// features/appointments/hooks/useAppointments.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMockProfessionals, fetchMockSpecialties } from '../api/mock-appointment-catalog';
import {
  cancelMockAppointment,
  createMockAppointment,
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

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMockAppointment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY }),
  });
}

// El catálogo casi no cambia: no hace falta volver a pedirlo en cada visita.
const CATALOG_STALE_TIME = 5 * 60 * 1000;

export function useSpecialties() {
  return useQuery({
    queryKey: ['appointment-catalog', 'specialties'],
    queryFn: fetchMockSpecialties,
    staleTime: CATALOG_STALE_TIME,
  });
}

/** Profesionales de una especialidad. Sin especialidad elegida no consulta. */
export function useProfessionals(specialtyId: string | undefined) {
  return useQuery({
    queryKey: ['appointment-catalog', 'professionals', specialtyId],
    queryFn: () => fetchMockProfessionals(specialtyId!),
    enabled: !!specialtyId,
    staleTime: CATALOG_STALE_TIME,
  });
}

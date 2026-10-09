// features/appointments/hooks/useAppointments.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsPatient } from '@/hooks/useIsPatient';
import { fetchAppointments } from '../api/appointments-api';
import { fetchMockProfessionals, fetchMockSpecialties } from '../api/mock-appointment-catalog';
import {
  cancelMockAppointment,
  createMockAppointment,
  withLocalAppointments,
} from '../api/mock-appointments';

const APPOINTMENTS_QUERY_KEY = ['appointments'] as const;

const loadAppointments = async () => withLocalAppointments(await fetchAppointments());

export function useAppointments() {
  const enabled = useIsPatient();
  return useQuery({ queryKey: APPOINTMENTS_QUERY_KEY, queryFn: loadAppointments, enabled });
}

/** Una cita por id; `null` si no existe. La API no tiene detalle: sale de la lista. */
export function useAppointment(id: string) {
  const enabled = useIsPatient();
  return useQuery({
    queryKey: APPOINTMENTS_QUERY_KEY,
    queryFn: loadAppointments,
    select: (appointments) => appointments.find((appointment) => appointment.id === id) ?? null,
    enabled,
  });
}

// TODO: cancelar y agendar son locales hasta que el backend los exponga al paciente.
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelMockAppointment,
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

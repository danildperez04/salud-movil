// features/profile/hooks/usePatientMe.ts
import { useQuery } from '@tanstack/react-query';
import { useIsPatient } from '@/hooks/useIsPatient';
import { fetchPatientMe } from '../api/patient-api';

export const PATIENT_ME_KEY = ['patient', 'me'] as const;

/** Ficha del propio paciente (fecha de nacimiento, centro de salud, contacto de emergencia). */
export function usePatientMe() {
  const enabled = useIsPatient();
  return useQuery({ queryKey: PATIENT_ME_KEY, queryFn: fetchPatientMe, enabled });
}

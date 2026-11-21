// features/profile/api/patient-api.ts
import { apiClient } from '@/lib/api-client';

/** Lo que usa la app de `PublicPatient` (`GET /patients/me`). */
export type PatientMe = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  /** cédula / identificador nacional */
  dni: string | null;
  /** "YYYY-MM-DD" */
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  healthCenterName: string;
};

export function fetchPatientMe(): Promise<PatientMe> {
  return apiClient.get<PatientMe>('/patients/me');
}

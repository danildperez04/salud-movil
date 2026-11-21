// features/medications/api/medications-api.ts
import { apiClient } from '@/lib/api-client';
import {
  toMedicationRecord,
  type ApiMedication,
  type MedicationRecord,
} from '../domain/medication-record';

/**
 * Medicamentos del paciente, con sus horarios. Los receta el personal de salud: el backend
 * no tiene todavía alta ni baja desde el paciente (ver mock-medications.ts).
 */
export async function fetchMedications(): Promise<MedicationRecord[]> {
  const medications = await apiClient.get<ApiMedication[]>('/patients/me/medications');
  return medications.map(toMedicationRecord);
}

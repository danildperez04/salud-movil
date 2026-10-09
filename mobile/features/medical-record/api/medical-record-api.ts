// features/medical-record/api/medical-record-api.ts
import { ApiError, apiClient } from '@/lib/api-client';
import type { ApiMedicalRecord } from '../domain/record-from-api';

/**
 * Expediente clínico del propio paciente. `null` si todavía no tiene uno: el personal de
 * salud lo crea y el backend responde 404.
 */
export async function fetchMedicalRecord(): Promise<ApiMedicalRecord | null> {
  try {
    return await apiClient.get<ApiMedicalRecord>('/patients/me/history');
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

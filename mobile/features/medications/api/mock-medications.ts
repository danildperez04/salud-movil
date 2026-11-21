// features/medications/api/mock-medications.ts
//
// Mock temporal de lo que el paciente todavía no puede hacer en el backend: los medicamentos
// los receta y los activa o desactiva el personal de salud (POST/PATCH /patients/:id/medications,
// solo staff). Estos cambios quedan solo en el dispositivo y se superponen a los reales.
// TODO: reemplazar por apiClient cuando exista el endpoint para pacientes.
import { createLocalOverlay, newLocalId } from '@/lib/local-overlay';
import type { MedicationRecord } from '../domain/medication-record';

const localChanges = createLocalOverlay<MedicationRecord>();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Los medicamentos reales con los cambios locales aplicados. */
export const withLocalMedications = (remote: MedicationRecord[]) => localChanges.apply(remote);

export async function createMockMedication(
  payload: Omit<MedicationRecord, 'id' | 'active' | 'schedules'>,
): Promise<MedicationRecord> {
  await delay(300);
  const record: MedicationRecord = { ...payload, id: newLocalId(), active: true, schedules: [] };
  localChanges.upsert(record);
  return record;
}

export async function toggleMockMedicationActive(
  medication: MedicationRecord,
  active: boolean,
): Promise<MedicationRecord> {
  await delay(200);
  const updated = { ...medication, active };
  localChanges.upsert(updated);
  return updated;
}

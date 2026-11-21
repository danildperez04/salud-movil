// features/medical-record/domain/record-from-api.ts
// Convierte el expediente del backend (`GET /patients/me/history`) en los registros que
// muestran las pantallas. El backend guarda diagnóstico principal, antecedentes y alergias
// como texto libre y las consultas como una lista; aquí se reparten en registros. Sin React.
import { MEDICAL_RECORD_LABELS } from '@/constants/labels';
import { toLocalIsoDate } from '@/lib/date-format';
import { joinParts } from '@/lib/text-format';
import type { Allergy, Diagnosis, HistoryEntry, PatientProfile } from './record-types';

/** Lo que usa la app de `PublicMedicalRecord`. */
export type ApiMedicalRecord = {
  primaryDiagnosis: string;
  medicalHistory: string;
  allergies: string;
  bloodType: string | null;
  /** ISO 8601 */
  createDate: string;
  /** ISO 8601 */
  updateDate: string;
  visits: {
    id: string;
    /** ISO 8601 */
    visitDate: string;
    diagnosis: string;
    observations: string;
    treatment: string;
    healthcareWorkerName: string;
  }[];
};

const localDate = (iso: string) => toLocalIsoDate(new Date(iso));

/** Textos que el personal escribe cuando no hay nada que registrar. */
const NOTHING_TO_REPORT = /^(no|ningun[oa]s?|n\/a|na|sin\s+\w+|none|-+)\.?$/i;

export function toPatientProfile(
  patient: { dateOfBirth: string },
  record: ApiMedicalRecord | null,
): PatientProfile {
  return {
    birthDate: patient.dateOfBirth,
    bloodType: record?.bloodType ?? '',
    updatedAt: record ? localDate(record.updateDate) : undefined,
  };
}

/** El diagnóstico principal vigente y, como antecedentes, el de cada consulta. */
export function diagnosesFrom(record: ApiMedicalRecord | null): Diagnosis[] {
  if (!record) return [];

  const primary = record.primaryDiagnosis.trim();
  const diagnoses: Diagnosis[] = primary
    ? [
        {
          id: 'primary',
          name: primary,
          status: 'active',
          diagnosedAt: localDate(record.createDate),
        },
      ]
    : [];

  const visits = record.visits.map((visit): Diagnosis => ({
    id: visit.id,
    name: visit.diagnosis,
    status: 'history',
    diagnosedAt: localDate(visit.visitDate),
    provider: visit.healthcareWorkerName,
    notes: joinParts([visit.observations, visit.treatment], '\n') || undefined,
  }));

  return [...diagnoses, ...visits];
}

/** Las alergias vienen en un texto ("Penicilina, polen"): una por elemento. */
export function allergiesFrom(record: ApiMedicalRecord | null): Allergy[] {
  if (!record) return [];

  return record.allergies
    .split(/[\n;,]+/)
    .map((name) => name.trim())
    .filter((name) => name && !NOTHING_TO_REPORT.test(name))
    .map((name, index) => ({ id: `record-${index}`, type: 'other', name }));
}

/** Los antecedentes vienen en un solo texto: una entrada personal. */
export function historyFrom(record: ApiMedicalRecord | null): HistoryEntry[] {
  const detail = record?.medicalHistory.trim();
  if (!detail || NOTHING_TO_REPORT.test(detail)) return [];

  return [
    {
      id: 'record',
      kind: 'personal',
      category: 'other',
      title: MEDICAL_RECORD_LABELS.history.recordTitle,
      detail,
    },
  ];
}

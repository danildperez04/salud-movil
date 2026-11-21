// features/medical-record/domain/record-types.ts
// Registros del expediente tal como los usan las pantallas. Sin React.
// Las fechas son "YYYY-MM-DD".
import type {
  AllergySeverity,
  AllergyType,
  DiagnosisStatus,
  HistoryCategory,
  HistoryKind,
} from './record-catalogs';

export type Allergy = {
  id: string;
  type: AllergyType;
  name: string;
  reaction?: string;
  /** el expediente del backend guarda las alergias como texto, sin gravedad */
  severity?: AllergySeverity;
  notes?: string;
};

export type HistoryEntry = {
  id: string;
  kind: HistoryKind;
  category: HistoryCategory;
  title: string;
  /** fecha o año en texto libre (ej. "2018") */
  period?: string;
  detail?: string;
};

export type Diagnosis = {
  id: string;
  name: string;
  status: DiagnosisStatus;
  diagnosedAt?: string;
  provider?: string;
  notes?: string;
};

export type PatientProfile = {
  /** "YYYY-MM-DD" */
  birthDate: string;
  bloodType: string;
  /** última vez que se modificó el expediente; undefined si todavía no tiene uno */
  updatedAt?: string;
};

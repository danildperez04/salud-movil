// features/medical-record/api/mock-medical-record.ts
//
// Mock temporal — el backend no expone el expediente clínico todavía. Cuando
// existan los endpoints, reemplazar estas funciones por apiClient sin tocar
// las pantallas. Las fechas son "YYYY-MM-DD".
// TODO: subir los archivos adjuntos (fotos y PDF) al backend; hoy solo se
// guarda la URI local del archivo.
import { toLocalIsoDate } from '@/lib/date-format';
import type {
  AllergySeverity,
  AllergyType,
  DiagnosisStatus,
  DocumentCategory,
  HistoryCategory,
  HistoryKind,
  LabStatus,
} from '../domain/record-catalogs';

export type Allergy = {
  id: string;
  type: AllergyType;
  name: string;
  reaction?: string;
  severity: AllergySeverity;
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

export type MedicalDocument = {
  id: string;
  category: DocumentCategory;
  title: string;
  issuedAt: string;
  provider?: string;
  notes?: string;
  format: 'pdf' | 'image';
  fileUri?: string;
  fileName?: string;
};

export type LabResult = {
  id: string;
  name: string;
  resultValue?: string;
  issuedAt: string;
  status: LabStatus;
  notes?: string;
  imageUri?: string;
};

export type PatientProfile = {
  /** "YYYY-MM-DD" */
  birthDate: string;
  bloodType: string;
  /** última vez que se modificó el expediente */
  updatedAt: string;
};

let allergies: Allergy[] = [];

let history: HistoryEntry[] = [
  {
    id: '1',
    kind: 'personal',
    category: 'surgery',
    title: 'Cirugías previas',
    detail: 'Apendicectomía',
    period: '2018',
  },
  {
    id: '2',
    kind: 'personal',
    category: 'hospitalization',
    title: 'Hospitalizaciones',
    detail: 'Ninguna reciente',
  },
  {
    id: '3',
    kind: 'personal',
    category: 'habits',
    title: 'Hábitos',
    detail: 'No fuma · Actividad física moderada',
  },
  { id: '4', kind: 'family', category: 'hereditary', title: 'Diabetes', detail: 'Madre' },
  { id: '5', kind: 'family', category: 'hereditary', title: 'Hipertensión', detail: 'Padre' },
];

let diagnoses: Diagnosis[] = [
  {
    id: '1',
    name: 'Hipertensión arterial',
    status: 'active',
    diagnosedAt: '2025-03-12',
    provider: 'Medicina Interna',
    notes: 'Seguimiento y control de la presión arterial.',
  },
  {
    id: '2',
    name: 'Diabetes mellitus tipo 2',
    status: 'active',
    diagnosedAt: '2025-01-08',
    provider: 'Endocrinología',
    notes: 'Control metabólico periódico.',
  },
  { id: '3', name: 'Gastritis', status: 'history', notes: 'Resuelta en 2024.' },
];

let documents: MedicalDocument[] = [
  {
    id: '1',
    category: 'prescriptions',
    title: 'Receta · Medicina Interna',
    issuedAt: '2026-09-10',
    provider: 'Dra. Karla Ruiz',
    format: 'pdf',
    notes:
      'Losartán 50 mg: 1 tableta cada 24 horas. Metoprolol según indicación registrada. Próximo control en 30 días.',
  },
  {
    id: '2',
    category: 'prescriptions',
    title: 'Receta · Cardiología',
    issuedAt: '2026-08-22',
    provider: 'Dra. Ana Gómez',
    format: 'pdf',
    notes: 'Continuar tratamiento antihipertensivo y llevar registro de presión arterial.',
  },
  {
    id: '3',
    category: 'certificates',
    title: 'Constancia de atención',
    issuedAt: '2026-09-08',
    provider: 'Dr. Juan Pérez',
    format: 'pdf',
    notes: 'Se hace constar que el paciente fue atendido y requiere reposo por 24 horas.',
  },
  {
    id: '4',
    category: 'certificates',
    title: 'Constancia de control',
    issuedAt: '2026-07-15',
    provider: 'Centro de Salud Norte',
    format: 'pdf',
    notes: 'Constancia de asistencia a control de seguimiento nutricional.',
  },
  {
    id: '5',
    category: 'studies',
    title: 'Ultrasonido abdominal',
    issuedAt: '2026-08-25',
    provider: 'Centro de Diagnóstico',
    format: 'pdf',
    notes: 'Informe de ultrasonido abdominal. Documento digital asociado al expediente.',
  },
  {
    id: '6',
    category: 'notes',
    title: 'Nota médica · Control',
    issuedAt: '2026-08-15',
    provider: 'Dra. Karla Ruiz',
    format: 'pdf',
    notes:
      'Paciente estable. Continuar seguimiento de presión arterial, glucosa y hábitos saludables.',
  },
];

let labs: LabResult[] = [
  {
    id: '1',
    name: 'Glucosa en ayunas',
    resultValue: '110 mg/dL',
    issuedAt: '2026-09-09',
    status: 'normal',
  },
  {
    id: '2',
    name: 'Hemoglobina glicosilada',
    resultValue: '6.1%',
    issuedAt: '2026-09-09',
    status: 'review',
    notes: 'Comentar el resultado en la próxima consulta.',
  },
  { id: '3', name: 'Perfil lipídico', issuedAt: '2026-08-25', status: 'normal' },
];

let profile: PatientProfile = {
  birthDate: '2003-03-10',
  bloodType: 'O+',
  updatedAt: '2026-09-11',
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Más reciente primero; los registros sin fecha van al final. */
const newestFirst = <T>(items: T[], dateOf: (item: T) => string | undefined): T[] =>
  [...items].sort((a, b) => (dateOf(b) ?? '').localeCompare(dateOf(a) ?? ''));

const newId = () => String(Date.now());

/** Marca el expediente como modificado hoy. */
const touch = () => {
  profile = { ...profile, updatedAt: toLocalIsoDate(new Date()) };
};

export async function fetchMockPatientProfile(): Promise<PatientProfile> {
  await delay(200);
  return profile;
}

export async function fetchMockAllergies(): Promise<Allergy[]> {
  await delay(250);
  return allergies;
}

export async function createMockAllergy(input: Omit<Allergy, 'id'>): Promise<Allergy> {
  await delay(300);
  const record: Allergy = { ...input, id: newId() };
  allergies = [...allergies, record];
  touch();
  return record;
}

export async function fetchMockHistory(): Promise<HistoryEntry[]> {
  await delay(250);
  return history;
}

export async function createMockHistoryEntry(
  input: Omit<HistoryEntry, 'id'>,
): Promise<HistoryEntry> {
  await delay(300);
  const record: HistoryEntry = { ...input, id: newId() };
  history = [...history, record];
  touch();
  return record;
}

export async function fetchMockDiagnoses(): Promise<Diagnosis[]> {
  await delay(250);
  return newestFirst(diagnoses, (diagnosis) => diagnosis.diagnosedAt);
}

export async function createMockDiagnosis(input: Omit<Diagnosis, 'id'>): Promise<Diagnosis> {
  await delay(300);
  const record: Diagnosis = { ...input, id: newId() };
  diagnoses = [...diagnoses, record];
  touch();
  return record;
}

export async function fetchMockDocuments(): Promise<MedicalDocument[]> {
  await delay(250);
  return newestFirst(documents, (document) => document.issuedAt);
}

export async function createMockDocument(
  input: Omit<MedicalDocument, 'id'>,
): Promise<MedicalDocument> {
  await delay(400);
  const record: MedicalDocument = { ...input, id: newId() };
  documents = [...documents, record];
  touch();
  return record;
}

export async function fetchMockLabs(): Promise<LabResult[]> {
  await delay(250);
  return newestFirst(labs, (lab) => lab.issuedAt);
}

export async function createMockLab(input: Omit<LabResult, 'id'>): Promise<LabResult> {
  await delay(400);
  const record: LabResult = { ...input, id: newId() };
  labs = [...labs, record];
  touch();
  return record;
}

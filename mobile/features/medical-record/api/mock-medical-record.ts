// features/medical-record/api/mock-medical-record.ts
//
// Mock temporal de lo que el backend todavía no tiene en el expediente:
// - Documentos y resultados de laboratorio: no existen en la API. Los datos de abajo son de
//   ejemplo. TODO: subir los archivos adjuntos (fotos y PDF); hoy solo se guarda la URI local.
// - Alergias, antecedentes y diagnósticos: el expediente real solo lo edita el personal de salud
//   (PUT /patients/:id/medical-record). Lo que el paciente agrega queda solo en el dispositivo y
//   se superpone a lo real (ver useMedicalRecord).
// Las fechas son "YYYY-MM-DD".
import { createLocalOverlay, newLocalId } from '@/lib/local-overlay';
import type { DocumentCategory, LabStatus } from '../domain/record-catalogs';
import type { Allergy, Diagnosis, HistoryEntry } from '../domain/record-types';

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

const localAllergies = createLocalOverlay<Allergy>();
const localHistory = createLocalOverlay<HistoryEntry>();
const localDiagnoses = createLocalOverlay<Diagnosis>();

export const withLocalAllergies = (remote: Allergy[]) => localAllergies.apply(remote);
export const withLocalHistory = (remote: HistoryEntry[]) => localHistory.apply(remote);

/** Más reciente primero; los registros sin fecha van al final. */
const newestFirst = <T>(items: T[], dateOf: (item: T) => string | undefined): T[] =>
  [...items].sort((a, b) => (dateOf(b) ?? '').localeCompare(dateOf(a) ?? ''));

export const withLocalDiagnoses = (remote: Diagnosis[]) =>
  newestFirst(localDiagnoses.apply(remote), (diagnosis) => diagnosis.diagnosedAt);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createMockAllergy(input: Omit<Allergy, 'id'>): Promise<Allergy> {
  await delay(300);
  const record: Allergy = { ...input, id: newLocalId() };
  localAllergies.upsert(record);
  return record;
}

export async function createMockHistoryEntry(
  input: Omit<HistoryEntry, 'id'>,
): Promise<HistoryEntry> {
  await delay(300);
  const record: HistoryEntry = { ...input, id: newLocalId() };
  localHistory.upsert(record);
  return record;
}

export async function createMockDiagnosis(input: Omit<Diagnosis, 'id'>): Promise<Diagnosis> {
  await delay(300);
  const record: Diagnosis = { ...input, id: newLocalId() };
  localDiagnoses.upsert(record);
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
  const record: MedicalDocument = { ...input, id: String(Date.now()) };
  documents = [...documents, record];
  return record;
}

export async function fetchMockLabs(): Promise<LabResult[]> {
  await delay(250);
  return newestFirst(labs, (lab) => lab.issuedAt);
}

export async function createMockLab(input: Omit<LabResult, 'id'>): Promise<LabResult> {
  await delay(400);
  const record: LabResult = { ...input, id: String(Date.now()) };
  labs = [...labs, record];
  return record;
}

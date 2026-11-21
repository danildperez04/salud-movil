// features/medical-record/hooks/useMedicalRecord.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loadPatientMe } from '@/features/profile/hooks/usePatientMe';
import { useIsPatient } from '@/hooks/useIsPatient';
import { queryClient as sharedQueryClient } from '@/lib/query-client';
import { fetchMedicalRecord } from '../api/medical-record-api';
import {
  createMockAllergy,
  createMockDiagnosis,
  createMockDocument,
  createMockHistoryEntry,
  createMockLab,
  fetchMockDocuments,
  fetchMockLabs,
  withLocalAllergies,
  withLocalDiagnoses,
  withLocalHistory,
} from '../api/mock-medical-record';
import type { DocumentCategory } from '../domain/record-catalogs';
import {
  allergiesFrom,
  diagnosesFrom,
  historyFrom,
  toPatientProfile,
} from '../domain/record-from-api';

const RECORD_KEY = ['medical-record'] as const;
const SERVER_RECORD_KEY = [...RECORD_KEY, 'server'] as const;

/** Expediente del backend; las varias consultas de una pantalla comparten una sola petición. */
const loadRecord = () =>
  sharedQueryClient.fetchQuery({
    queryKey: SERVER_RECORD_KEY,
    queryFn: fetchMedicalRecord,
    staleTime: 30 * 1000,
  });

// Perfil, diagnósticos, antecedentes y alergias salen del expediente real. Lo que el paciente
// agrega es local (ver mock-medical-record.ts). Documentos y laboratorios no existen en la API.

export function usePatientProfile() {
  const enabled = useIsPatient();
  return useQuery({
    queryKey: [...RECORD_KEY, 'profile'],
    queryFn: async () => {
      const [patient, record] = await Promise.all([loadPatientMe(), loadRecord()]);
      return toPatientProfile(patient, record);
    },
    enabled,
  });
}

export function useAllergies() {
  const enabled = useIsPatient();
  return useQuery({
    queryKey: [...RECORD_KEY, 'allergies'],
    queryFn: async () => withLocalAllergies(allergiesFrom(await loadRecord())),
    enabled,
  });
}

export function useHistoryEntries() {
  const enabled = useIsPatient();
  return useQuery({
    queryKey: [...RECORD_KEY, 'history'],
    queryFn: async () => withLocalHistory(historyFrom(await loadRecord())),
    enabled,
  });
}

export function useDiagnoses() {
  const enabled = useIsPatient();
  return useQuery({
    queryKey: [...RECORD_KEY, 'diagnoses'],
    queryFn: async () => withLocalDiagnoses(diagnosesFrom(await loadRecord())),
    enabled,
  });
}

/** Documentos, del más reciente al más antiguo; de una categoría si se indica. */
export function useDocuments(category?: DocumentCategory) {
  return useQuery({
    queryKey: [...RECORD_KEY, 'documents'],
    queryFn: fetchMockDocuments,
    select: (documents) =>
      category ? documents.filter((document) => document.category === category) : documents,
  });
}

/** Un documento por id; `null` si no existe. */
export function useDocument(id: string | undefined) {
  return useQuery({
    queryKey: [...RECORD_KEY, 'documents'],
    queryFn: fetchMockDocuments,
    select: (documents) => documents.find((document) => document.id === id) ?? null,
  });
}

export function useLabs() {
  return useQuery({ queryKey: [...RECORD_KEY, 'labs'], queryFn: fetchMockLabs });
}

/** Un examen por id; `null` si no existe. */
export function useLab(id: string | undefined) {
  return useQuery({
    queryKey: [...RECORD_KEY, 'labs'],
    queryFn: fetchMockLabs,
    select: (labs) => labs.find((lab) => lab.id === id) ?? null,
  });
}

/** Crear un registro invalida todo el expediente: la lista cambia y también el resumen. */
function useCreateRecord<TInput, TResult>(mutationFn: (input: TInput) => Promise<TResult>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RECORD_KEY }),
  });
}

export const useCreateAllergy = () => useCreateRecord(createMockAllergy);
export const useCreateHistoryEntry = () => useCreateRecord(createMockHistoryEntry);
export const useCreateDiagnosis = () => useCreateRecord(createMockDiagnosis);
export const useCreateDocument = () => useCreateRecord(createMockDocument);
export const useCreateLab = () => useCreateRecord(createMockLab);

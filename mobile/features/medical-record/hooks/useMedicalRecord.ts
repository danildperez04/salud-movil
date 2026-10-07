// features/medical-record/hooks/useMedicalRecord.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMockAllergy,
  createMockDiagnosis,
  createMockDocument,
  createMockHistoryEntry,
  createMockLab,
  fetchMockAllergies,
  fetchMockDiagnoses,
  fetchMockDocuments,
  fetchMockHistory,
  fetchMockLabs,
  fetchMockPatientProfile,
} from '../api/mock-medical-record';
import type { DocumentCategory } from '../domain/record-catalogs';

const RECORD_KEY = ['medical-record'] as const;

// TODO: reemplazar los mocks por apiClient cuando el backend exponga el endpoint.

export function usePatientProfile() {
  return useQuery({ queryKey: [...RECORD_KEY, 'profile'], queryFn: fetchMockPatientProfile });
}

export function useAllergies() {
  return useQuery({ queryKey: [...RECORD_KEY, 'allergies'], queryFn: fetchMockAllergies });
}

export function useHistoryEntries() {
  return useQuery({ queryKey: [...RECORD_KEY, 'history'], queryFn: fetchMockHistory });
}

export function useDiagnoses() {
  return useQuery({ queryKey: [...RECORD_KEY, 'diagnoses'], queryFn: fetchMockDiagnoses });
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

/**
 * Crear un registro invalida todo el expediente: la lista cambia y también la
 * fecha de "última actualización" del resumen.
 */
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

// features/medical-record/domain/record-catalogs.ts
// Tipos y listas de valores válidos del expediente. Salen de los catálogos de
// constants/labels.ts para tener una sola fuente de verdad. Sin React.
import {
  ALLERGY_SEVERITY_LABELS,
  ALLERGY_TYPE_LABELS,
  DIAGNOSIS_STATUS_LABELS,
  DOCUMENT_CATEGORIES,
  HISTORY_CATEGORY_LABELS,
  HISTORY_KIND_LABELS,
  LAB_STATUS_LABELS,
} from '@/constants/labels';

/** Claves de un catálogo con el tipo que pide z.enum. */
export function keysOf<T extends Record<string, unknown>>(catalog: T) {
  return Object.keys(catalog) as [Extract<keyof T, string>, ...Extract<keyof T, string>[]];
}

export type AllergyType = keyof typeof ALLERGY_TYPE_LABELS;
export type AllergySeverity = keyof typeof ALLERGY_SEVERITY_LABELS;
export type HistoryKind = keyof typeof HISTORY_KIND_LABELS;
export type HistoryCategory = keyof typeof HISTORY_CATEGORY_LABELS;
export type DiagnosisStatus = keyof typeof DIAGNOSIS_STATUS_LABELS;
export type DocumentCategory = keyof typeof DOCUMENT_CATEGORIES;
export type LabStatus = keyof typeof LAB_STATUS_LABELS;

export const ALLERGY_TYPES = keysOf(ALLERGY_TYPE_LABELS);
export const ALLERGY_SEVERITIES = keysOf(ALLERGY_SEVERITY_LABELS);
export const HISTORY_KINDS = keysOf(HISTORY_KIND_LABELS);
export const HISTORY_CATEGORIES = keysOf(HISTORY_CATEGORY_LABELS);
export const DIAGNOSIS_STATUSES = keysOf(DIAGNOSIS_STATUS_LABELS);
export const DOCUMENT_CATEGORY_KEYS = keysOf(DOCUMENT_CATEGORIES);
export const LAB_STATUSES = keysOf(LAB_STATUS_LABELS);

/** Tipos de documento para el selector del formulario (usa el nombre en singular). */
export const DOCUMENT_TYPE_OPTIONS = DOCUMENT_CATEGORY_KEYS.map((value) => ({
  value,
  label: DOCUMENT_CATEGORIES[value].singular,
}));

/** Valida el parámetro de ruta `category` antes de usarlo. */
export function isDocumentCategory(value: string | undefined): value is DocumentCategory {
  return value !== undefined && value in DOCUMENT_CATEGORIES;
}

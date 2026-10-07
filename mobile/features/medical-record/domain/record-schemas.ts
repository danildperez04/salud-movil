// features/medical-record/domain/record-schemas.ts
// Validación de los formularios del expediente. Sin React.
import { z } from 'zod';
import { MEDICAL_RECORD_LABELS } from '@/constants/labels';
import { startOfDay, startOfToday } from '@/lib/date-format';
import {
  ALLERGY_SEVERITIES,
  ALLERGY_TYPES,
  DIAGNOSIS_STATUSES,
  DOCUMENT_CATEGORY_KEYS,
  HISTORY_CATEGORIES,
  HISTORY_KINDS,
  LAB_STATUSES,
} from './record-catalogs';

const { allergies, history, diagnosis, documents, labs } = MEDICAL_RECORD_LABELS;

/** Largo máximo de "fecha o año" de un antecedente (texto libre, ej. "2018"). */
export const MAX_PERIOD_LENGTH = 30;

/** Hoy o antes: un diagnóstico, documento o examen no puede tener fecha futura. */
const isTodayOrBefore = (date: Date) => startOfDay(date) <= startOfToday();

/** Archivo adjunto elegido con useMediaPicker. */
const attachmentSchema = (requiredMessage: string) =>
  z.object(
    {
      uri: z.string().min(1),
      name: z.string(),
      mimeType: z.string().optional(),
      kind: z.enum(['image', 'document']),
    },
    { error: requiredMessage },
  );

export const allergySchema = z.object({
  type: z.enum(ALLERGY_TYPES),
  name: z.string().trim().min(1, allergies.errors.nameRequired),
  reaction: z.string().trim(),
  severity: z.enum(ALLERGY_SEVERITIES),
  notes: z.string().trim(),
});
export type AllergyFormValues = z.infer<typeof allergySchema>;

export const historySchema = z.object({
  kind: z.enum(HISTORY_KINDS),
  category: z.enum(HISTORY_CATEGORIES),
  title: z.string().trim().min(1, history.errors.titleRequired),
  period: z.string().trim().max(MAX_PERIOD_LENGTH, history.errors.periodTooLong),
  detail: z.string().trim(),
});
export type HistoryFormValues = z.infer<typeof historySchema>;

export const diagnosisSchema = z.object({
  name: z.string().trim().min(1, diagnosis.errors.nameRequired),
  status: z.enum(DIAGNOSIS_STATUSES),
  diagnosedAt: z.date().refine(isTodayOrBefore, diagnosis.errors.dateFuture).optional(),
  provider: z.string().trim(),
  notes: z.string().trim(),
});
export type DiagnosisFormValues = z.infer<typeof diagnosisSchema>;

export const documentSchema = z.object({
  category: z.enum(DOCUMENT_CATEGORY_KEYS),
  title: z.string().trim().min(1, documents.errors.nameRequired),
  provider: z.string().trim(),
  issuedAt: z
    .date({ error: documents.errors.dateRequired })
    .refine(isTodayOrBefore, documents.errors.dateFuture),
  notes: z.string().trim(),
  attachment: attachmentSchema(documents.errors.fileRequired),
});
export type DocumentFormValues = z.infer<typeof documentSchema>;

export const labScanSchema = z.object({
  name: z.string().trim().min(1, labs.scan.errors.nameRequired),
  issuedAt: z
    .date({ error: labs.scan.errors.dateRequired })
    .refine(isTodayOrBefore, labs.scan.errors.dateFuture),
  status: z.enum(LAB_STATUSES),
  resultValue: z.string().trim(),
  notes: z.string().trim(),
  attachment: attachmentSchema(labs.scan.errors.imageRequired),
});
export type LabScanFormValues = z.infer<typeof labScanSchema>;

// features/medical-record/domain/share-content.ts
// Texto que se comparte al "guardar una copia" de un documento o examen. Sin React.
import { formatIsoDateShort } from '@/lib/date-format';
import type { LabResult, MedicalDocument } from '../api/mock-medical-record';
import { joinParts } from './clinical-summary';

export type ShareContent = {
  title: string;
  message: string;
  /** archivo a compartir; solo lo usa iOS (Android comparte únicamente el texto) */
  url?: string;
};

export function documentShareContent(document: MedicalDocument): ShareContent {
  const meta = joinParts([formatIsoDateShort(document.issuedAt), document.provider]);
  return {
    title: document.title,
    message: joinParts([document.title, meta, document.notes], '\n\n'),
    url: document.fileUri,
  };
}

export function labShareContent(lab: LabResult, statusLabel: string): ShareContent {
  const meta = joinParts([formatIsoDateShort(lab.issuedAt), statusLabel, lab.resultValue]);
  return {
    title: lab.name,
    message: joinParts([lab.name, meta, lab.notes], '\n\n'),
    url: lab.imageUri,
  };
}

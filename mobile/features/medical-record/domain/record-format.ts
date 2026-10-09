// features/medical-record/domain/record-format.ts
// Textos de apoyo (segunda línea) de las tarjetas y filas del expediente. Sin React.
import { DIAGNOSIS_STATUS_LABELS } from '@/constants/labels';
import { formatIsoDateShort } from '@/lib/date-format';
import type { Diagnosis, HistoryEntry } from './record-types';
import { joinParts } from './clinical-summary';

/** "Activo · 12 mar 2025" + (otra línea) "Medicina Interna · Seguimiento…" */
export function describeDiagnosis(diagnosis: Diagnosis): string {
  const status = joinParts([
    DIAGNOSIS_STATUS_LABELS[diagnosis.status],
    diagnosis.diagnosedAt && formatIsoDateShort(diagnosis.diagnosedAt),
  ]);
  const followUp = joinParts([diagnosis.provider, diagnosis.notes]);
  return joinParts([status, followUp], '\n');
}

/** "Apendicectomía · 2018" */
export function describeHistoryEntry(entry: HistoryEntry): string {
  return joinParts([entry.detail, entry.period]);
}

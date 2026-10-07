// features/medical-record/domain/clinical-summary.ts
// Cálculos del resumen clínico. Sin React.
import { parseLocalDate } from '@/lib/date-format';
import type { DiagnosisStatus } from './record-catalogs';

/** Edad en años cumplidos a la fecha `now`, a partir de "YYYY-MM-DD". */
export function calculateAge(birthDate: string, now: Date = new Date()): number {
  const birth = parseLocalDate(birthDate);
  const hadBirthdayThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  return now.getFullYear() - birth.getFullYear() - (hadBirthdayThisYear ? 0 : 1);
}

/** Un diagnóstico sigue vigente si está activo o en seguimiento. */
export const isOngoingDiagnosis = (status: DiagnosisStatus) =>
  status === 'active' || status === 'follow-up';

export { joinParts } from '@/lib/text-format';

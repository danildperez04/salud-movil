/**
 * Antes vivía duplicada en PatientsList.tsx. Muévela ahí también
 * (import { ageOf } from '../../lib/age') para no tener dos copias.
 */
export function ageOf(dateOfBirth: string): string {
  const birth = new Date(`${dateOfBirth.slice(0, 10)}T00:00:00`);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    years -= 1;
  }
  return years >= 0 ? `${years} años` : "—";
}

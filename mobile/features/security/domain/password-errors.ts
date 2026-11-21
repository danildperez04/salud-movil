// features/security/domain/password-errors.ts
import { SECURITY_LABELS } from '@/constants/labels';

const labels = SECURITY_LABELS.password;

type ErrorLike = { status?: number };

/** Cambiar la contraseña: 400 es contraseña actual incorrecta y 429 demasiados intentos. */
export function changePasswordErrorMessage(error: ErrorLike): string {
  if (error.status === 400) return labels.currentIncorrect;
  if (error.status === 429) return labels.tooManyRequests;
  return labels.saveError;
}

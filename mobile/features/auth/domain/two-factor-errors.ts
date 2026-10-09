// features/auth/domain/two-factor-errors.ts
import { LOGIN_LABELS } from '@/constants/labels';

const { errors } = LOGIN_LABELS.twoFactor;

type ErrorLike = { status?: number; message: string };

/**
 * Mensaje para un fallo de `POST /auth/2fa/verify`. Ojo: acá un 401 significa
 * "código incorrecto, vencido o agotado" (la API no distingue), no "credenciales inválidas".
 */
export function verifyErrorMessage(error: ErrorLike): string {
  if (error.status === 401) return errors.wrongOrExpired;
  if (error.status === 429) return errors.tooManyRequests;
  return error.message;
}

export type ResendFailure = { kind: 'too-soon' | 'gone' | 'other'; message: string };

/** 429 = pedido antes de 30 s; 400 = el desafío ya no existe y hay que volver a hacer login. */
export function classifyResendError(error: ErrorLike): ResendFailure {
  if (error.status === 429) return { kind: 'too-soon', message: errors.resendTooSoon };
  if (error.status === 400) return { kind: 'gone', message: errors.challengeGone };
  return { kind: 'other', message: error.message };
}

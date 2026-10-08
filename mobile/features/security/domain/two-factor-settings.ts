// features/security/domain/two-factor-settings.ts
import { z } from 'zod';
import { SECURITY_LABELS } from '@/constants/labels';

const { errors } = SECURITY_LABELS.twoFactor;

export const disableTwoFactorSchema = z.object({
  password: z.string().min(1, errors.passwordRequired),
});

export type DisableTwoFactorValues = z.infer<typeof disableTwoFactorSchema>;

type ErrorLike = { status?: number; message: string };

/**
 * Las rutas autenticadas de 2FA responden 400 (no 401) ante código o contraseña incorrectos,
 * a propósito: `api-client` cierra la sesión ante cualquier 401 con token.
 */
export function enableErrorMessage(error: ErrorLike): string {
  if (error.status === 400) return errors.wrongCode;
  if (error.status === 429) return errors.tooManyRequests;
  return error.message;
}

/** Pedir (o reenviar) el código: 409 si el 2FA ya estaba activo, 429 por exceso de pedidos. */
export function requestCodeErrorMessage(error: ErrorLike): string {
  if (error.status === 409) return errors.alreadyEnabled;
  if (error.status === 429) return errors.tooManyRequests;
  return SECURITY_LABELS.twoFactor.enableError;
}

export function disableErrorMessage(error: ErrorLike): string {
  if (error.status === 400) return errors.wrongPassword;
  if (error.status === 429) return errors.tooManyRequests;
  return error.message;
}

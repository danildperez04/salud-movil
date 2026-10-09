// lib/error-messages.ts
import { COMMON_LABELS } from '@/constants/labels';

const messages = COMMON_LABELS.errors;

/**
 * Error cuyo `message` ya está escrito para la persona que usa la app: sin códigos, sin texto
 * del backend, sin nombres de librerías. Es lo único que `userMessage` deja pasar; cualquier
 * otro error (un `TypeError`, un `SyntaxError`, etc.) se reemplaza por un mensaje genérico.
 */
export class UserFacingError extends Error {}

/** Mensaje en lenguaje natural para un código HTTP de error. */
export function messageForStatus(status: number): string {
  if (status >= 500) return messages.unavailable;
  switch (status) {
    case 400:
    case 422:
      return messages.invalidData;
    case 401:
      return messages.unauthorized;
    case 403:
      return messages.forbidden;
    case 404:
      return messages.notFound;
    case 409:
      return messages.conflict;
    case 413:
      return messages.tooLarge;
    case 429:
      return messages.tooManyRequests;
    default:
      return messages.unexpected;
  }
}

/** Texto seguro para mostrar de cualquier error capturado (`unknown`). */
export function userMessage(error: unknown): string {
  return error instanceof UserFacingError ? error.message : messages.unexpected;
}

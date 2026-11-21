// lib/error-messages.ts
import { i18n } from '@/lib/i18n';

/**
 * Error cuyo `message` ya está escrito para la persona que usa la app: sin códigos, sin texto
 * del backend, sin nombres de librerías. Es lo único que `userMessage` deja pasar; cualquier
 * otro error (un `TypeError`, un `SyntaxError`, etc.) se reemplaza por un mensaje genérico.
 */
export class UserFacingError extends Error {}

/**
 * Mensaje en lenguaje natural para un código HTTP de error, en el idioma activo al momento de
 * llamar (por eso se traduce acá y no al cargar el módulo).
 */
export function messageForStatus(status: number): string {
  if (status >= 500) return i18n.t('errors.unavailable');
  switch (status) {
    case 400:
    case 422:
      return i18n.t('errors.invalidData');
    case 401:
      return i18n.t('errors.unauthorized');
    case 403:
      return i18n.t('errors.forbidden');
    case 404:
      return i18n.t('errors.notFound');
    case 409:
      return i18n.t('errors.conflict');
    case 413:
      return i18n.t('errors.tooLarge');
    case 429:
      return i18n.t('errors.tooManyRequests');
    default:
      return i18n.t('errors.unexpected');
  }
}

/** Texto seguro para mostrar de cualquier error capturado (`unknown`). */
export function userMessage(error: unknown): string {
  return error instanceof UserFacingError ? error.message : i18n.t('errors.unexpected');
}

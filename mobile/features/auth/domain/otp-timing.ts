// features/auth/domain/otp-timing.ts

/** La API rechaza un reenvío antes de 30 s (429). */
export const RESEND_COOLDOWN_SECONDS = 30;

/** Segundos enteros que faltan para `deadlineMs` (0 si ya pasó). */
export function secondsUntil(deadlineMs: number, nowMs: number): number {
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000));
}

/** Milisegundos epoch de un `expiresAt` ISO; NaN si la fecha es inválida. */
export function parseExpiry(expiresAt: string): number {
  return Date.parse(expiresAt);
}

/** `m:ss` para el contador de vencimiento. */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

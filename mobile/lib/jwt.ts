// lib/jwt.ts
//
// Decodifica el payload de un JWT para leer su `exp` y avisarle al usuario
// ANTES de que una request falle con 401. Esto NO es una verificación de
// seguridad — la única validación real del token la hace el backend
// (JwtAuthGuard) en cada request. Un cliente que mienta sobre `exp` no gana
// nada, porque el servidor igual lo va a rechazar si está vencido o es inválido.
//
// No usa atob/Buffer (no siempre disponibles en Hermes) — decodifica base64 a mano.
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64Decode(input: string): string {
  let output = '';
  let buffer = 0;
  let bits = 0;
  for (const char of input) {
    const value = BASE64_CHARS.indexOf(char);
    if (value === -1) continue;
    buffer = (buffer << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }
  return output;
}

type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(base64Decode(base64));
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return false; // sin campo exp legible, no afirmamos que expiró
  return Date.now() >= payload.exp * 1000;
}

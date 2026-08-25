// lib/api-client.ts
import { useAppStore } from '@/store';

// EXPO_PUBLIC_API_URL debe ir en un .env en la raíz del proyecto.
// Solo las variables con prefijo EXPO_PUBLIC_ quedan embebidas en el bundle
// (así funciona Expo, es intencional: nunca metas secretos reales acá).
//
// Ojo con la URL según dónde corras la app:
// - Emulador de Android (Android Studio): usar 10.0.2.2 en vez de localhost
//   (localhost dentro del emulador apunta al propio emulador, no a tu PC).
// - Dispositivo físico con Expo Go / dev build: usar la IP de red local de tu PC
//   (ej. 192.168.1.X), nunca localhost ni 10.0.2.2.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** Si es false, no manda el header Authorization ni dispara logout en 401 (ej: login, register) */
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = useAppStore.getState().accessToken;
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Token vencido o inválido en un endpoint protegido: cerramos sesión local.
  // No hacemos "refresh silencioso" acá — este backend no expone refresh token,
  // así que ante un 401 la única opción correcta es pedir login de nuevo.
  if (response.status === 401 && auth) {
    useAppStore.getState().logout();
  }

  if (!response.ok) {
    let message = `Error ${response.status}`;
    let details: unknown;
    try {
      const errorBody = await response.json();
      // NestJS devuelve { message, error, statusCode }; message puede ser
      // string o array de strings (errores de validación de class-validator).
      message = Array.isArray(errorBody?.message)
        ? errorBody.message.join(', ')
        : (errorBody?.message ?? message);
      details = errorBody;
    } catch {
      // el body no era JSON parseable, nos quedamos con el mensaje genérico
    }
    throw new ApiError(response.status, message, details);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

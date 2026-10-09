// lib/api-client.ts
import { RequestTimeoutError, withTimeout } from '@/lib/fetch-with-timeout';
import { useAppStore } from '@/store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';

/**
 * El plan gratuito de Render duerme el servicio tras ~15 min sin tráfico y tarda ~50 s en
 * despertar: el límite deja que esa primera petición termine, pero no cuelga la pantalla
 * indefinidamente si el servidor no contesta.
 */
const REQUEST_TIMEOUT_MS = 60 * 1000;

const NETWORK_ERROR_MESSAGE =
  'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.';
const TIMEOUT_ERROR_MESSAGE =
  'El servidor tardó demasiado en responder. Intentá de nuevo en unos segundos.';

export class ApiError extends Error {
  constructor(
    /** código HTTP; 0 si no hubo respuesta (sin conexión o sin contestar a tiempo) */
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

  try {
    return await withTimeout(REQUEST_TIMEOUT_MS, async (signal) => {
      const response = await fetch(`${API_URL}${path}`, {
        ...rest,
        headers: finalHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
      });

      if (response.status === 401 && auth) {
        useAppStore.getState().logout();
      }

      if (!response.ok) {
        let message = `Error ${response.status}`;
        let details: unknown;
        try {
          const errorBody = await response.json();
          message = Array.isArray(errorBody?.message)
            ? errorBody.message.join(', ')
            : (errorBody?.message ?? message);
          details = errorBody;
        } catch {}
        throw new ApiError(response.status, message, details);
      }

      // Nest responde 201/200 sin cuerpo en los endpoints que devuelven void (ej. change-password).
      if (response.status === 204) return undefined as T;
      const text = await response.text();
      return (text ? JSON.parse(text) : undefined) as T;
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof RequestTimeoutError) throw new ApiError(0, TIMEOUT_ERROR_MESSAGE);
    // fetch falla con TypeError ("Network request failed") cuando no hay conexión
    if (error instanceof TypeError) throw new ApiError(0, NETWORK_ERROR_MESSAGE);
    throw error;
  }
}

/**
 * Despierta el servidor mientras el usuario ve la bienvenida o el login, para que la primera
 * petición real no pague el arranque en frío. No espera ni propaga errores.
 */
export function warmUpApi() {
  withTimeout(2 * REQUEST_TIMEOUT_MS, (signal) => fetch(`${API_URL}/health`, { signal })).catch(
    () => undefined,
  );
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

// lib/api-client.ts
import { messageForStatus, UserFacingError } from '@/lib/error-messages';
import { i18n } from '@/lib/i18n';
import { RequestTimeoutError, withTimeout } from '@/lib/fetch-with-timeout';
import { useAppStore } from '@/store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';

/**
 * El plan gratuito de Render duerme el servicio tras ~15 min sin tráfico y tarda ~50 s en
 * despertar: el límite deja que esa primera petición termine, pero no cuelga la pantalla
 * indefinidamente si el servidor no contesta.
 */
const REQUEST_TIMEOUT_MS = 60 * 1000;

/**
 * `message` está pensado para mostrarse tal cual: nunca contiene el texto del backend ni el
 * código HTTP. Para depurar, el cuerpo original de la respuesta queda en `details`.
 */
export class ApiError extends UserFacingError {
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
        let details: unknown;
        try {
          details = await response.json();
        } catch {}
        throw new ApiError(response.status, messageForStatus(response.status), details);
      }

      // Nest responde 201/200 sin cuerpo en los endpoints que devuelven void (ej. change-password).
      if (response.status === 204) return undefined as T;
      const text = await response.text();
      if (!text) return undefined as T;
      try {
        return JSON.parse(text) as T;
      } catch {
        // 200 con un cuerpo que no es JSON (ej. la página de error de un proxy)
        throw new ApiError(response.status, i18n.t('errors.unexpected'));
      }
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof RequestTimeoutError) {
      throw new ApiError(0, i18n.t('errors.timeout'));
    }
    // fetch falla con TypeError ("Network request failed") cuando no hay conexión
    if (error instanceof TypeError) throw new ApiError(0, i18n.t('errors.network'));
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

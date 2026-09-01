// lib/api-client.ts
import { useAppStore } from '@/store';

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

  // Token vencido/inválido en un endpoint protegido. Este es el "fallback
  // reactivo" — la detección proactiva vive en useAuthBootstrap (chequea
  // exp del JWT sin necesidad de esperar a que el servidor lo rechace).
  // Ambos caminos existen porque el reloj del dispositivo puede estar
  // desincronizado del servidor, o el token pudo invalidarse del lado
  // del backend antes de su exp original.
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

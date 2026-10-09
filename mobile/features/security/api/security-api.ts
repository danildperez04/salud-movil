// features/security/api/security-api.ts
import { apiClient } from '@/lib/api-client';

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

/**
 * Cambia la contraseña de la sesión actual. 400 si la actual es incorrecta (no 401, a
 * propósito: `api-client` cierra la sesión ante cualquier 401 con token).
 */
export function changePassword(input: ChangePasswordInput): Promise<void> {
  return apiClient.post<void>('/auth/change-password', input);
}

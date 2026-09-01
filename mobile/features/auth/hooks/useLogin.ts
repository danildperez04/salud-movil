// features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';
import { useAppStore } from '@/store';
import type { AuthResponse, LoginDto } from '@/types/auth';

// Mobile es solo para pacientes y cuidadores — admin/personal de salud
// gestionan desde el panel web. Esto es UX/acceso, no la fuente de verdad:
// el backend sigue siendo quien realmente autoriza cada endpoint (RolesGuard).
const ALLOWED_MOBILE_ROLES = ['patient', 'caregiver'];

export class RoleNotAllowedError extends Error {
  constructor() {
    super('Esta cuenta no tiene acceso a la app móvil. Ingresá desde el panel web.');
    this.name = 'RoleNotAllowedError';
  }
}

export function useLogin() {
  const setSession = useAppStore((state) => state.setSession);

  return useMutation<AuthResponse, ApiError | RoleNotAllowedError, LoginDto>({
    mutationFn: async (dto) => {
      const data = await apiClient.post<AuthResponse>('/auth/login', dto, { auth: false });
      if (!ALLOWED_MOBILE_ROLES.includes(data.user.role)) {
        // Credenciales válidas, pero esta cuenta no debería tener sesión
        // móvil — no llamamos setSession, no se guarda nada.
        throw new RoleNotAllowedError();
      }
      return data;
    },
    onSuccess: (data) => {
      setSession(data);
    },
  });
}

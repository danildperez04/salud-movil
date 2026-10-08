// features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';
import { useAppStore } from '@/store';
import type { LoginDto, LoginResponse } from '@/types/auth';
import { isMobileRoleAllowed, isTwoFactorChallenge } from '../domain/login-response';
import { useTwoFactorStore } from '../store/two-factor-store';

export class RoleNotAllowedError extends Error {
  constructor() {
    super('Esta cuenta no tiene acceso a la app móvil. Ingresá desde el panel web.');
    this.name = 'RoleNotAllowedError';
  }
}

/**
 * Inicia sesión. Si la cuenta tiene 2FA la API responde con un desafío en vez de la
 * sesión: se guarda en memoria y la pantalla navega a la de código. El chequeo de rol
 * se hace cuando ya hay `user` (acá, o tras `verify`).
 */
export function useLogin() {
  const setSession = useAppStore((state) => state.setSession);
  const setChallenge = useTwoFactorStore((state) => state.setChallenge);

  return useMutation<LoginResponse, ApiError | RoleNotAllowedError, LoginDto>({
    mutationFn: async (dto) => {
      const data = await apiClient.post<LoginResponse>('/auth/login', dto, { auth: false });
      if (!isTwoFactorChallenge(data) && !isMobileRoleAllowed(data.user.role)) {
        throw new RoleNotAllowedError();
      }
      return data;
    },
    onSuccess: (data) => {
      if (isTwoFactorChallenge(data)) {
        setChallenge(data);
        return;
      }
      setSession(data);
    },
  });
}

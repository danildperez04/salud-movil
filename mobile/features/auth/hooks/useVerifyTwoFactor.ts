// features/auth/hooks/useVerifyTwoFactor.ts
import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';
import { useAppStore } from '@/store';
import type { AuthResponse } from '@/types/auth';
import { isMobileRoleAllowed } from '../domain/login-response';
import { useTwoFactorStore } from '../store/two-factor-store';
import { RoleNotAllowedError } from './useLogin';

/** Canjea el código de 6 dígitos del desafío en curso por la sesión. */
export function useVerifyTwoFactor() {
  const setSession = useAppStore((state) => state.setSession);
  const clearChallenge = useTwoFactorStore((state) => state.clearChallenge);

  return useMutation<AuthResponse, ApiError | RoleNotAllowedError, string>({
    mutationFn: async (code) => {
      const challenge = useTwoFactorStore.getState().challenge;
      if (!challenge) throw new ApiError(400, 'No hay una verificación en curso.');

      const data = await apiClient.post<AuthResponse>(
        '/auth/2fa/verify',
        { challengeId: challenge.challengeId, code },
        { auth: false },
      );
      if (!isMobileRoleAllowed(data.user.role)) throw new RoleNotAllowedError();
      return data;
    },
    onSuccess: (data) => {
      setSession(data);
      clearChallenge();
    },
  });
}

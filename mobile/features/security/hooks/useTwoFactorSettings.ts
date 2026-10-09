// features/security/hooks/useTwoFactorSettings.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';
import { useAppStore } from '@/store';
import type { PublicUser, TwoFactorTicket } from '@/types/auth';

// Estos hooks usan la API real (las sesiones activas, en cambio, siguen siendo un mock).

/** Estado vigente del 2FA: se pide a /auth/me y se sincroniza con el usuario de la sesión. */
export function useTwoFactorStatus() {
  const updateUser = useAppStore((state) => state.updateUser);

  return useQuery<PublicUser, ApiError>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const me = await apiClient.get<PublicUser>('/auth/me');
      updateUser({ twoFactorEnabled: me.twoFactorEnabled });
      return me;
    },
  });
}

/** Envía un código al usuario (se vuelve a llamar para "reenviar"). */
export function useRequestTwoFactorCode() {
  const queryClient = useQueryClient();

  return useMutation<TwoFactorTicket, ApiError>({
    mutationFn: () => apiClient.post<TwoFactorTicket>('/auth/2fa/enable'),
    // 409: ya estaba activo (otra sesión lo activó); se vuelve a consultar el estado
    onError: (error) => {
      if (error.status === 409) queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useConfirmTwoFactor() {
  const updateUser = useAppStore((state) => state.updateUser);

  return useMutation<{ twoFactorEnabled: true }, ApiError, { challengeId: string; code: string }>({
    mutationFn: (dto) => apiClient.post('/auth/2fa/enable/confirm', dto),
    onSuccess: () => updateUser({ twoFactorEnabled: true }),
  });
}

export function useDisableTwoFactor() {
  const updateUser = useAppStore((state) => state.updateUser);

  return useMutation<{ twoFactorEnabled: false }, ApiError, { password: string }>({
    mutationFn: (dto) => apiClient.post('/auth/2fa/disable', dto),
    onSuccess: () => updateUser({ twoFactorEnabled: false }),
  });
}

// features/auth/hooks/useResendTwoFactor.ts
import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';
import type { TwoFactorTicket } from '@/types/auth';
import { useTwoFactorStore } from '../store/two-factor-store';

/**
 * Pide otro código. La API devuelve un `challengeId` nuevo (el anterior queda
 * invalidado), así que se reemplaza el desafío en memoria y reinicia el enfriamiento.
 */
export function useResendTwoFactor() {
  const setChallenge = useTwoFactorStore((state) => state.setChallenge);

  return useMutation<TwoFactorTicket, ApiError>({
    mutationFn: () => {
      const challenge = useTwoFactorStore.getState().challenge;
      if (!challenge) throw new ApiError(400, 'No hay una verificación en curso.');
      return apiClient.post<TwoFactorTicket>(
        '/auth/2fa/resend',
        { challengeId: challenge.challengeId },
        { auth: false },
      );
    },
    onSuccess: (ticket) => setChallenge(ticket),
  });
}

// features/auth/store/two-factor-store.ts
import { create } from 'zustand';
import { parseExpiry, RESEND_COOLDOWN_SECONDS } from '../domain/otp-timing';

/**
 * Desafío de 2FA en curso. Vive solo en memoria (sin `persist`) y nunca viaja
 * por la URL: si la app se cierra, se vuelve a iniciar sesión.
 */
export type TwoFactorChallengeState = {
  challengeId: string;
  /** ms epoch en que vence el código */
  expiresAtMs: number;
  /** ms epoch desde el que se puede pedir otro código */
  resendAvailableAtMs: number;
};

type TwoFactorStore = {
  challenge: TwoFactorChallengeState | null;
  setChallenge: (ticket: { challengeId: string; expiresAt: string }) => void;
  clearChallenge: () => void;
};

export const useTwoFactorStore = create<TwoFactorStore>((set) => ({
  challenge: null,
  setChallenge: ({ challengeId, expiresAt }) =>
    set({
      challenge: {
        challengeId,
        expiresAtMs: parseExpiry(expiresAt),
        resendAvailableAtMs: Date.now() + RESEND_COOLDOWN_SECONDS * 1000,
      },
    }),
  clearChallenge: () => set({ challenge: null }),
}));

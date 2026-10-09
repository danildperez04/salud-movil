import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, setTokenGetter, setUnauthorizedHandler } from '../lib/api';
import type { ApiUser, LoginResponse, TwoFactorChallengeInfo } from '../types';

interface AuthState {
  token: string | null;
  user: ApiUser | null;
  bootstrapReady: boolean;
  pendingTwoFactorChallenge: TwoFactorChallengeInfo | null;
  twoFactorMode: 'login' | 'enable' | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  completeTwoFactorLogin: (code: string, navigate: (path: string, options?: { replace?: boolean }) => void, mode: 'login' | 'enable') => Promise<void>;
  updatePendingTwoFactorChallenge: (challenge: TwoFactorChallengeInfo) => void;
  clearPendingTwoFactor: () => void;
  logout: () => void;
  bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      bootstrapReady: false,
      pendingTwoFactorChallenge: null,
      twoFactorMode: null,
      login: async (email, password) => {
        const response = await api.login(email, password);
        if ('requiresTwoFactor' in response) {
          set({
            pendingTwoFactorChallenge: {
              challengeId: response.challengeId,
              expiresAt: response.expiresAt,
            },
            twoFactorMode: 'login',
          });
          return response;
        }
        set({ token: response.accessToken, user: response.user, bootstrapReady: true });
        return response;
      },
      completeTwoFactorLogin: async (code, navigate, mode) => {
        const { pendingTwoFactorChallenge, twoFactorMode } = get();
        if (!pendingTwoFactorChallenge || !twoFactorMode) {
          throw new Error('No hay desafío 2FA pendiente');
        }
        const { challengeId } = pendingTwoFactorChallenge;

        if (mode === 'login' || twoFactorMode === 'login') {
          const response = await api.verifyTwoFactor({ challengeId, code });
          navigate('/app', { replace: true });
          set({
            token: response.accessToken,
            user: response.user,
            bootstrapReady: true,
            pendingTwoFactorChallenge: null,
            twoFactorMode: null,
          });
        } else {
          await api.confirmEnableTwoFactor(challengeId, code);
          navigate('/app/perfil', { replace: true });
          const user = get().user;
          if (user) {
            set({
              user: { ...user, twoFactorEnabled: true },
              pendingTwoFactorChallenge: null,
              twoFactorMode: null,
            });
          }
        }
      },
      updatePendingTwoFactorChallenge: (challenge) => {
        set({ pendingTwoFactorChallenge: challenge });
      },
      clearPendingTwoFactor: () => {
        set({ pendingTwoFactorChallenge: null, twoFactorMode: null });
      },
      logout: () => set({ token: null, user: null, pendingTwoFactorChallenge: null, twoFactorMode: null }),
      bootstrap: async () => {
        await Promise.resolve();
        if (!get().token) {
          set({ bootstrapReady: true });
          return;
        }
        try {
          const user = await api.me();
          set({ user, bootstrapReady: true });
        } catch {
          set({ token: null, user: null, bootstrapReady: true });
        }
      },
    }),
    {
      name: 'sm-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);

setTokenGetter(() => useAuthStore.getState().token);

setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});
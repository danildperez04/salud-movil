// store/slices/authSlice.ts
import { StateCreator } from 'zustand';
import { secureTokenStorage } from '@/lib/secure-token-storage';
import type { AuthResponse } from '@/types/auth';
import { AuthSlice, LogoutReason } from '../types';

const NOTICE_BY_REASON: Record<LogoutReason, string | null> = {
  user: null,
  expired: 'Tu sesión expiró. Iniciá sesión de nuevo para continuar.',
  role_not_allowed: 'Esta cuenta no tiene acceso a la app móvil. Ingresá desde el panel web.',
};

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  hasHydrated: false,
  authNotice: null,

  setSession: (session: AuthResponse) => {
    // el token va a SecureStore, NO a MMKV — fire-and-forget está bien acá:
    // si falla el guardado seguro, el usuario simplemente va a tener que
    // volver a loguearse la próxima vez que abra la app, no es catastrófico.
    secureTokenStorage.setToken(session.accessToken).catch(() => undefined);
    set({
      user: session.user,
      accessToken: session.accessToken,
      isAuthenticated: true,
      authNotice: null,
    });
  },

  setAccessToken: (token: string | null) => set({ accessToken: token }),

  logout: (reason: LogoutReason = 'user') => {
    secureTokenStorage.removeToken().catch(() => undefined);
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      authNotice: NOTICE_BY_REASON[reason],
    });
  },

  clearAuthNotice: () => set({ authNotice: null }),

  setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
});

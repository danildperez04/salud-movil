// store/types.ts
import type { AuthResponse, PublicUser } from '@/types/auth';

export type UISlice = {
  isBottomSheetOpen: boolean;
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
};

export type LogoutReason = 'user' | 'expired' | 'role_not_allowed';

export type AuthSlice = {
  user: PublicUser | null;
  accessToken: string | null; // NO persistido vía MMKV — ver lib/secure-token-storage.ts
  isAuthenticated: boolean;
  // true recién cuando: (1) MMKV terminó de rehidratar Y (2) ya se chequeó
  // el token real en SecureStore. Evita parpadeos hacia una pantalla
  // equivocada mientras se resuelve el estado real de la sesión.
  hasHydrated: boolean;
  // Mensaje a mostrar en Login la próxima vez que se renderice, explicando
  // por qué el usuario terminó ahí (sesión vencida, rol no permitido, etc).
  // null cuando el logout fue una acción explícita del usuario.
  authNotice: string | null;
  setSession: (session: AuthResponse) => void;
  setAccessToken: (token: string | null) => void;
  logout: (reason?: LogoutReason) => void;
  clearAuthNotice: () => void;
  setHasHydrated: (value: boolean) => void;
};

export type OnboardingSlice = {
  hasSeenOnboarding: boolean;
  markOnboardingSeen: () => void;
};

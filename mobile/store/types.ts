// store/types.ts
import type { AuthResponse, PublicUser } from '@/types/auth';

export type UISlice = {
  isBottomSheetOpen: boolean;
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
};

export type AuthSlice = {
  user: PublicUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  // true recién después de que persist termina de leer MMKV al arrancar la app.
  // Se usa para no redirigir a login/onboarding antes de saber qué hay guardado.
  hasHydrated: boolean;
  setSession: (session: AuthResponse) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
};

export type OnboardingSlice = {
  hasSeenOnboarding: boolean;
  markOnboardingSeen: () => void;
};

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
  hasHydrated: boolean;
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

// store/types.ts
import type { AuthResponse, PublicUser } from '@/types/auth';
import type {
  AccessibilityPreferences,
  LanguageCode,
  NotificationPreferences,
  SecurityPreferences,
} from '@/types/preferences';

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
  /** Mezcla campos en el usuario de la sesión (ej. tras activar/desactivar el 2FA). */
  updateUser: (patch: Partial<PublicUser>) => void;
  setAccessToken: (token: string | null) => void;
  logout: (reason?: LogoutReason) => void;
  clearAuthNotice: () => void;
  setHasHydrated: (value: boolean) => void;
};

export type OnboardingSlice = {
  hasSeenOnboarding: boolean;
  markOnboardingSeen: () => void;
};

/** Ajustes locales del dispositivo; persisten aunque se cierre la sesión. */
export type PreferencesSlice = {
  accessibility: AccessibilityPreferences;
  language: LanguageCode;
  notificationPreferences: NotificationPreferences;
  securityPreferences: SecurityPreferences;
  setAccessibility: (patch: Partial<AccessibilityPreferences>) => void;
  resetAccessibility: () => void;
  setLanguage: (language: LanguageCode) => void;
  setNotificationPreferences: (preferences: NotificationPreferences) => void;
  setSecurityPreferences: (preferences: SecurityPreferences) => void;
};

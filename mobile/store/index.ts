// store/index.ts
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from '@/lib/zustand-mmkv-storage';
import { createAuthSlice } from './slices/authSlice';
import { createOnboardingSlice } from './slices/onboardingSlice';
import { createPreferencesSlice } from './slices/preferencesSlice';
import { createUISlice } from './slices/uiSlice';
import { AuthSlice, OnboardingSlice, PreferencesSlice, UISlice } from './types';

type AppState = UISlice & AuthSlice & OnboardingSlice & PreferencesSlice;

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...a) => ({
        ...createUISlice(...a),
        ...createAuthSlice(...a),
        ...createOnboardingSlice(...a),
        ...createPreferencesSlice(...a),
      }),
      {
        name: 'salud-movil-auth-storage',
        storage: createJSONStorage(() => zustandMMKVStorage),
        // Las preferencias no se borran al cerrar sesión (logout solo limpia los campos de auth)
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          hasSeenOnboarding: state.hasSeenOnboarding,
          accessibility: state.accessibility,
          language: state.language,
          notificationPreferences: state.notificationPreferences,
          securityPreferences: state.securityPreferences,
        }),
      },
    ),
    { name: 'AppStore', enabled: __DEV__ },
  ),
);

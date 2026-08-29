// store/index.ts
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from '@/lib/zustand-mmkv-storage';
import { createAuthSlice } from './slices/authSlice';
import { createOnboardingSlice } from './slices/onboardingSlice';
import { createUISlice } from './slices/uiSlice';
import { AuthSlice, OnboardingSlice, UISlice } from './types';

type AppState = UISlice & AuthSlice & OnboardingSlice;

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...a) => ({
        ...createUISlice(...a),
        ...createAuthSlice(...a),
        ...createOnboardingSlice(...a),
      }),
      {
        name: 'salud-movil-auth-storage',
        storage: createJSONStorage(() => zustandMMKVStorage),
        // Solo persistimos sesión y onboarding. Estado de UI (ej. bottom sheet
        // abierto) no debe sobrevivir a cerrar la app.
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
          hasSeenOnboarding: state.hasSeenOnboarding,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
    { name: 'AppStore', enabled: __DEV__ },
  ),
);

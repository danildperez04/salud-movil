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
        // accessToken NO se persiste acá — vive en SecureStore
        // (ver lib/secure-token-storage.ts). Solo lo "no secreto" va a MMKV.
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          hasSeenOnboarding: state.hasSeenOnboarding,
        }),
        // hasHydrated NO se marca acá — se marca en el bootstrap de
        // app/_layout.tsx, después de chequear también el token real
        // en SecureStore. Ver useAuthBootstrap.
      },
    ),
    { name: 'AppStore', enabled: __DEV__ },
  ),
);

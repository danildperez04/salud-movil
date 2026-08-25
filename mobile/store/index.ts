// store/index.ts
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from '@/lib/zustand-mmkv-storage';
import { createAuthSlice } from './slices/authSlice';
import { createUISlice } from './slices/uiSlice';
import { AuthSlice, UISlice } from './types';

// A medida que agregues slices (settings, etc), combinalos acá:
// type AppState = UISlice & AuthSlice & SettingsSlice;
type AppState = UISlice & AuthSlice;

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...a) => ({
        ...createUISlice(...a),
        ...createAuthSlice(...a),
      }),
      {
        name: 'salud-movil-auth-storage',
        storage: createJSONStorage(() => zustandMMKVStorage),
        // Solo persistimos la sesión. Estado de UI (ej. bottom sheet abierto)
        // no debe sobrevivir a cerrar la app.
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
    { name: 'AppStore', enabled: __DEV__ },
  ),
);

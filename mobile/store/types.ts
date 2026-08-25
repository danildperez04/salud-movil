// store/types.ts
// Cada slice define su propio tipo. A medida que agregues features
// (auth, appointments, notifications, etc), sumá un tipo acá y su
// slice correspondiente en store/slices/.
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
  // Se usa para no redirigir a login antes de saber si hay sesión guardada.
  hasHydrated: boolean;
  setSession: (session: AuthResponse) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
};

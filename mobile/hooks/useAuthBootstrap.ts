// hooks/useAuthBootstrap.ts
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { isJwtExpired } from '@/lib/jwt';
import { secureTokenStorage } from '@/lib/secure-token-storage';
import { useAppStore } from '@/store';

// Corre una vez al montar la app: reconcilia lo que MMKV recuerda
// (user, isAuthenticated) con el token real guardado en SecureStore.
// También revisa expiración cada vez que la app vuelve a primer plano,
// para no depender únicamente de que una request falle con 401.
export function useAuthBootstrap() {
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = await secureTokenStorage.getToken();
      if (cancelled) return;

      const { isAuthenticated, logout, setAccessToken } = useAppStore.getState();

      if (!token) {
        // MMKV puede decir "autenticado" sin token real (instalación nueva,
        // storage corrupto, etc) — la sesión sin token no sirve para nada.
        if (isAuthenticated) logout();
      } else if (isJwtExpired(token)) {
        logout();
      } else {
        setAccessToken(token);
      }

      useAppStore.getState().setHasHydrated(true);
    }

    bootstrap();

    const subscription = AppState.addEventListener('change', (status) => {
      if (status !== 'active') return;
      const { accessToken, isAuthenticated, logout } = useAppStore.getState();
      if (isAuthenticated && accessToken && isJwtExpired(accessToken)) {
        logout();
      }
    });

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);
}

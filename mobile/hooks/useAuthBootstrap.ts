// hooks/useAuthBootstrap.ts
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { isJwtExpired } from '@/lib/jwt';
import { secureTokenStorage } from '@/lib/secure-token-storage';
import { useAppStore } from '@/store';

export function useAuthBootstrap() {
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = await secureTokenStorage.getToken();
      if (cancelled) return;

      const { isAuthenticated, logout, setAccessToken } = useAppStore.getState();

      if (!token) {
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

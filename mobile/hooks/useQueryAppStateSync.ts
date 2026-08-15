// hooks/useQueryAppStateSync.ts
import { useEffect } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';
import { focusManager } from '@tanstack/react-query';

// La web tiene el evento "window focus" para refetchear datos viejos
// al volver a la pestaña. React Native no tiene eso — el equivalente
// es "la app volvió a primer plano" (AppState === 'active').
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

export function useQueryAppStateSync() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);
}

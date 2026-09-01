// app/_layout.tsx
import '../global.css';
import { Stack, SplashScreen } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { NAV_THEME } from '@/lib/theme';
import { queryClient } from '@/lib/query-client';
import { setupOnlineManager } from '@/lib/query-online-manager';
import { useQueryAppStateSync } from '@/hooks/useQueryAppStateSync';
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap';
import { useAppStore } from '@/store';

SplashScreen.preventAutoHideAsync();

function SplashScreenController() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [hasHydrated]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? NAV_THEME.dark : NAV_THEME.light;

  useEffect(() => {
    setupOnlineManager();
  }, []);

  useQueryAppStateSync();
  useAuthBootstrap(); // reconcilia MMKV + SecureStore, marca hasHydrated cuando termina

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={theme}>
          <SplashScreenController />
          <Stack screenOptions={{ headerShown: false }} />
          <PortalHost />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

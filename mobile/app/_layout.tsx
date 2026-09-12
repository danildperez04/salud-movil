// app/_layout.tsx
import '../global.css';
import { Stack, SplashScreen } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import {
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { NAV_THEME } from '@/lib/theme';
import { queryClient } from '@/lib/query-client';
import { setupOnlineManager } from '@/lib/query-online-manager';
import { useQueryAppStateSync } from '@/hooks/useQueryAppStateSync';
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap';
import { useAppStore } from '@/store';

SplashScreen.preventAutoHideAsync();

function SplashScreenController({ fontsLoaded }: { fontsLoaded: boolean }) {
  const hasHydrated = useAppStore((state) => state.hasHydrated);

  useEffect(() => {
    if (fontsLoaded && hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, hasHydrated]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? NAV_THEME.dark : NAV_THEME.light;

  const [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    setupOnlineManager();
  }, []);

  useQueryAppStateSync();
  useAuthBootstrap();

  // No renderizar nada hasta que las fuentes estén listas
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={theme}>
          <SplashScreenController fontsLoaded={fontsLoaded || !!fontError} />
          <Stack screenOptions={{ headerShown: false }} />
          <PortalHost />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

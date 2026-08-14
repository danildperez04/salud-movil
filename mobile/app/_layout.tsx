// app/_layout.tsx
import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { NAV_THEME } from '@/lib/theme';
import { queryClient } from '@/lib/query-client';
import { setupOnlineManager } from '@/lib/query-online-manager';
import { useQueryAppStateSync } from '@/hooks/useQueryAppStateSync';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? NAV_THEME.dark : NAV_THEME.light;

  useEffect(() => {
    setupOnlineManager();
  }, []);

  useQueryAppStateSync();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={theme}>
          <Stack />
          <PortalHost />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

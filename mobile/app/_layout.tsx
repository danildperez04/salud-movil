import '../global.css';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { useColorScheme } from 'react-native';
import { NAV_THEME } from '../lib/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={theme}>
        <Stack />
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

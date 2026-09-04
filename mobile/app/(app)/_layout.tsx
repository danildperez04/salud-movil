// app/(app)/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useAppStore } from '@/store';

export default function AppLayout() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  // Nadie entra a pantallas reales sin sesión, sin importar cómo llegó a la URL.
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

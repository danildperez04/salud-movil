// app/(auth)/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useAppStore } from '@/store';

export default function AuthLayout() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  // Si alguien ya logueado intenta volver a /login a mano, lo mandamos a home.
  if (isAuthenticated) return <Redirect href="/(app)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

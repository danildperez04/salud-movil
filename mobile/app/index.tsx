// app/index.tsx
import { Redirect } from 'expo-router';
import { useAppStore } from '@/store';

export default function RootIndex() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const hasSeenOnboarding = useAppStore((state) => state.hasSeenOnboarding);

  if (!hasHydrated) return null;

  if (isAuthenticated) return <Redirect href="/(app)" />;
  if (!hasSeenOnboarding) return <Redirect href="/(onboarding)/welcome" />;
  return <Redirect href="/(auth)/login" />;
}

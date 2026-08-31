// app/(app)/health-indicators/_layout.tsx
import { Stack } from 'expo-router';

export default function HealthIndicatorsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="new" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

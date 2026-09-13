// app/(app)/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAppStore } from '@/store';

const ALLOWED_MOBILE_ROLES = ['patient', 'caregiver'];

export default function AppLayout() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const hasDisallowedRole = !!user && !ALLOWED_MOBILE_ROLES.includes(user.role);

  useEffect(() => {
    if (hasDisallowedRole) logout('role_not_allowed');
  }, [hasDisallowedRole, logout]);

  if (!isAuthenticated || hasDisallowedRole) return <Redirect href="/(auth)/login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

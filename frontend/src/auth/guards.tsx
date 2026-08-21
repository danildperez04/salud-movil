import { Navigate } from 'react-router';
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/auth';

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const bootstrapReady = useAuthStore((s) => s.bootstrapReady);
  if (!bootstrapReady) {
    return null;
  }
  if (!token) {
    return <Navigate to='/login' replace />;
  }
  return <>{children}</>;
}

export function RequireRole({
  roles,
  children,
}: {
  roles: string[];
  children: ReactNode;
}) {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  if (!token || !role) {
    return <Navigate to='/login' replace />;
  }
  if (!roles.includes(role)) {
    return <Navigate to='/' replace />;
  }
  return <>{children}</>;
}

export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const bootstrapReady = useAuthStore((s) => s.bootstrapReady);
  if (!bootstrapReady) {
    return null;
  }
  if (token) {
    return <Navigate to='/' replace />;
  }
  return <>{children}</>;
}

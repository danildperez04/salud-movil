// features/security/hooks/useSecurity.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api-client';
import { closeMockOtherSessions, closeMockSession, fetchMockSessions } from '../api/mock-security';
import { changePassword, type ChangePasswordInput } from '../api/security-api';

const SESSIONS_KEY = ['security', 'sessions'] as const;

// TODO: las sesiones son un mock hasta que el backend las exponga.

export function useDeviceSessions() {
  return useQuery({ queryKey: SESSIONS_KEY, queryFn: fetchMockSessions });
}

export function useCloseSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: closeMockSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSIONS_KEY }),
  });
}

export function useCloseOtherSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: closeMockOtherSessions,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSIONS_KEY }),
  });
}

export function useChangePassword() {
  return useMutation<void, ApiError, ChangePasswordInput>({ mutationFn: changePassword });
}

// features/security/hooks/useSecurity.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  changeMockPassword,
  closeMockOtherSessions,
  closeMockSession,
  fetchMockSessions,
} from '../api/mock-security';

const SESSIONS_KEY = ['security', 'sessions'] as const;

// TODO: reemplazar los mocks por apiClient cuando el backend exponga el endpoint.

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
  return useMutation({ mutationFn: changeMockPassword });
}

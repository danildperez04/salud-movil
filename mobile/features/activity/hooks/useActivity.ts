// features/activity/hooks/useActivity.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMockActivity, saveMockActivityEntry } from '../api/mock-activity';
import { getWeeklyStats } from '../domain/activity-stats';

const ACTIVITY_KEY = ['activity'] as const;

// TODO: reemplazar los mocks por apiClient cuando el backend exponga el endpoint.

/** Registros de actividad (del más reciente al más antiguo) y estadísticas de la semana. */
export function useActivityLog() {
  const { data, isLoading } = useQuery({ queryKey: ACTIVITY_KEY, queryFn: fetchMockActivity });
  const entries = data ?? [];

  return { entries, isLoading, weekly: getWeeklyStats(entries) };
}

export function useSaveActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveMockActivityEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ACTIVITY_KEY }),
  });
}

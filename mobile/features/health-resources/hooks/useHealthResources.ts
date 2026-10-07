// features/health-resources/hooks/useHealthResources.ts
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { formatTime12h } from '@/lib/date-format';
import { fetchMockHealthResources, fetchMockWaitTimes } from '../api/mock-health-resources';

const RESOURCES_KEY = ['health-resources', 'list'] as const;
const WAIT_TIMES_KEY = ['health-resources', 'wait-times'] as const;

// TODO: reemplazar los mocks por apiClient cuando el backend exponga el endpoint.

export function useHealthResources() {
  return useQuery({ queryKey: RESOURCES_KEY, queryFn: fetchMockHealthResources });
}

/** Un recurso por id; `null` si no existe. */
export function useHealthResource(id: string | undefined) {
  return useQuery({
    queryKey: RESOURCES_KEY,
    queryFn: fetchMockHealthResources,
    select: (resources) => resources.find((resource) => resource.id === id) ?? null,
  });
}

/** Esperas aproximadas, de la más corta a la más larga, con actualización manual. */
export function useWaitTimes() {
  const { data, isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: WAIT_TIMES_KEY,
    queryFn: fetchMockWaitTimes,
    select: (resources) =>
      [...resources].sort((a, b) => (a.waitMinutes ?? 0) - (b.waitMinutes ?? 0)),
  });

  // el indicador de "tirar para actualizar" solo debe verse en una actualización pedida por el usuario
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return {
    resources: data ?? [],
    isLoading,
    refreshing,
    refresh,
    updatedAt: dataUpdatedAt ? formatTime12h(new Date(dataUpdatedAt)) : undefined,
  };
}

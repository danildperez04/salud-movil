// features/health-indicators/hooks/useHealthIndicators.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMockHealthIndicators } from '../api/mock-health-indicators';
import { latestByType, recordsOfType } from '../domain/indicator-series';

export const HEALTH_INDICATORS_QUERY_KEY = ['health-indicators'] as const;

// TODO: reemplazar fetchMockHealthIndicators por apiClient.get('/health-indicators')
// cuando exista el endpoint.
export function useHealthIndicators() {
  return useQuery({
    queryKey: HEALTH_INDICATORS_QUERY_KEY,
    queryFn: fetchMockHealthIndicators,
  });
}

// Los hooks derivados comparten la query (y su caché) con useHealthIndicators;
// `select` solo transforma el resultado.

/** Última medición de cada tipo de indicador. */
export function useLatestIndicators() {
  return useQuery({
    queryKey: HEALTH_INDICATORS_QUERY_KEY,
    queryFn: fetchMockHealthIndicators,
    select: latestByType,
  });
}

/** Todas las mediciones de un tipo, de la más reciente a la más antigua. */
export function useIndicatorHistory(typeName: string | undefined) {
  return useQuery({
    queryKey: HEALTH_INDICATORS_QUERY_KEY,
    queryFn: fetchMockHealthIndicators,
    select: (records) => recordsOfType(records, typeName),
  });
}

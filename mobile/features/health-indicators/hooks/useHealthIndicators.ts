// features/health-indicators/hooks/useHealthIndicators.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMockHealthIndicators } from '../api/mock-health-indicators';

export const HEALTH_INDICATORS_QUERY_KEY = ['health-indicators'] as const;

// TODO: reemplazar fetchMockHealthIndicators por apiClient.get('/health-indicators')
// cuando exista el endpoint.
export function useHealthIndicators() {
  return useQuery({
    queryKey: HEALTH_INDICATORS_QUERY_KEY,
    queryFn: fetchMockHealthIndicators,
  });
}

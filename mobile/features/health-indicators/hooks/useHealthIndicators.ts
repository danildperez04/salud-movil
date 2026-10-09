// features/health-indicators/hooks/useHealthIndicators.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsPatient } from '@/hooks/useIsPatient';
import {
  createHealthIndicator,
  fetchHealthIndicators,
  fetchIndicatorTypes,
} from '../api/health-indicators-api';
import { latestByType, recordsOfType } from '../domain/indicator-series';

export const HEALTH_INDICATORS_QUERY_KEY = ['health-indicators'] as const;

export function useHealthIndicators() {
  const enabled = useIsPatient();
  return useQuery({
    queryKey: HEALTH_INDICATORS_QUERY_KEY,
    queryFn: fetchHealthIndicators,
    enabled,
  });
}

// Los hooks derivados comparten la query (y su caché) con useHealthIndicators;
// `select` solo transforma el resultado.

/** Última medición de cada tipo de indicador. */
export function useLatestIndicators() {
  const enabled = useIsPatient();
  return useQuery({
    queryKey: HEALTH_INDICATORS_QUERY_KEY,
    queryFn: fetchHealthIndicators,
    select: latestByType,
    enabled,
  });
}

/** Todas las mediciones de un tipo, de la más reciente a la más antigua. */
export function useIndicatorHistory(typeName: string | undefined) {
  const enabled = useIsPatient();
  return useQuery({
    queryKey: HEALTH_INDICATORS_QUERY_KEY,
    queryFn: fetchHealthIndicators,
    select: (records) => recordsOfType(records, typeName),
    enabled,
  });
}

/** Registra una medición. También cambia el IPCP, que se calcula con las lecturas. */
export function useCreateHealthIndicator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHealthIndicator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HEALTH_INDICATORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['ipcp'] });
    },
  });
}

/** Catálogo de tipos de indicador: casi no cambia, no hace falta pedirlo en cada visita. */
export function useIndicatorTypes() {
  return useQuery({
    queryKey: ['catalogues', 'type-indicators'],
    queryFn: fetchIndicatorTypes,
    staleTime: 60 * 60 * 1000,
  });
}

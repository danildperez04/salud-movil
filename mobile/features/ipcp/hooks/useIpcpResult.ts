// features/ipcp/hooks/useIpcpResult.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMockIpcp } from '../api/mock-ipcp';

export const IPCP_KEY = ['ipcp'] as const;

// TODO: reemplazar el mock por apiClient.get('/ipcp') cuando el backend lo calcule.

/**
 * IPCP actual del paciente, calculado automáticamente con los datos de la app. Depende de lo
 * que se registra en otros módulos (indicadores, tomas, citas), así que se recalcula cada vez
 * que se abre la pantalla en vez de esperar al `staleTime` global.
 */
export function useIpcpResult() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: IPCP_KEY,
    queryFn: fetchMockIpcp,
    staleTime: 0,
  });

  return { result: data ?? null, isLoading, isError, refetch };
}

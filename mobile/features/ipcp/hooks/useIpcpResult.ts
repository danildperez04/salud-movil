// features/ipcp/hooks/useIpcpResult.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMockLatestIpcp } from '../api/mock-ipcp';

export const IPCP_LATEST_KEY = ['ipcp', 'latest'] as const;

// TODO: reemplazar el mock por apiClient cuando el backend exponga el IPCP.

/** Última evaluación IPCP del paciente (null si todavía no hizo ninguna). */
export function useIpcpResult() {
  const { data, isLoading } = useQuery({
    queryKey: IPCP_LATEST_KEY,
    queryFn: fetchMockLatestIpcp,
  });

  return { result: data ?? null, isLoading };
}

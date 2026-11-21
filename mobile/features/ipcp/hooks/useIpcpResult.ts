// features/ipcp/hooks/useIpcpResult.ts
import { useQuery } from '@tanstack/react-query';
import { useIsPatient } from '@/hooks/useIsPatient';
import { fetchIpcp } from '../api/ipcp-api';

export const IPCP_KEY = ['ipcp'] as const;

/**
 * IPCP actual del paciente. Depende de lo que se registra en otros módulos (indicadores,
 * tomas, citas), así que se vuelve a pedir cada vez que se abre la pantalla en vez de
 * esperar al `staleTime` global.
 */
export function useIpcpResult() {
  const enabled = useIsPatient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: IPCP_KEY,
    queryFn: fetchIpcp,
    staleTime: 0,
    enabled,
  });

  return { result: data ?? null, isLoading, isError, refetch };
}

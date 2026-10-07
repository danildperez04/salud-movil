// features/health-resources/hooks/useReferralSearch.ts
import { useMemo, useState } from 'react';
import { findReferralOptions } from '../domain/referral';
import { DEFAULT_SERVICE, type ReferralPriority } from '../domain/resource-catalog';
import { useHealthResources } from './useHealthResources';

type SearchedCriteria = { service: string; priority: ReferralPriority };

/**
 * Formulario de referencia: los resultados solo cambian al pulsar "Buscar", no
 * al mover los selectores.
 */
export function useReferralSearch() {
  const { data: resources } = useHealthResources();
  const [service, setService] = useState<string>(DEFAULT_SERVICE);
  const [priority, setPriority] = useState<ReferralPriority>('scheduled');
  const [searched, setSearched] = useState<SearchedCriteria | null>(null);

  const results = useMemo(
    () =>
      searched && resources
        ? findReferralOptions(resources, searched.service, searched.priority)
        : null,
    [searched, resources],
  );

  return {
    service,
    setService,
    priority,
    setPriority,
    search: () => setSearched({ service, priority }),
    /** null mientras no se haya buscado */
    results,
    searchedService: searched?.service,
    isUrgentSearch: searched?.priority === 'urgent',
  };
}

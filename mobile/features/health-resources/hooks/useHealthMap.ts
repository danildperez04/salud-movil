// features/health-resources/hooks/useHealthMap.ts
import { useMemo, useState } from 'react';
import type { FilterChip } from '@/components/ui/filter-chips';
import { HEALTH_MAP_LABELS, RESOURCE_FILTER_LABELS } from '@/constants/labels';
import { filterResources, type ResourceFilter } from '../domain/resource-catalog';
import { useHealthResources } from './useHealthResources';

const FILTER_OPTIONS: FilterChip<ResourceFilter>[] = (
  Object.keys(RESOURCE_FILTER_LABELS) as ResourceFilter[]
).map((value) => ({ value, label: RESOURCE_FILTER_LABELS[value] }));

/** Filtro activo y recursos que se muestran en el mapa y en la lista. */
export function useHealthMap() {
  const { data, isLoading } = useHealthResources();
  const [filter, setFilter] = useState<ResourceFilter>('all');

  const resources = useMemo(() => filterResources(data ?? [], filter), [data, filter]);

  return {
    isLoading,
    filter,
    setFilter,
    filterOptions: FILTER_OPTIONS,
    resources,
    legend:
      filter === 'all'
        ? HEALTH_MAP_LABELS.legendAll
        : HEALTH_MAP_LABELS.legend(RESOURCE_FILTER_LABELS[filter]),
  };
}

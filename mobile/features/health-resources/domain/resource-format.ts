// features/health-resources/domain/resource-format.ts
// Textos de apoyo y clasificación de la espera. Sin React.
import { HEALTH_MAP_LABELS, RESOURCE_TYPE_LABELS, WAIT_TIMES_LABELS } from '@/constants/labels';
import { joinParts } from '@/lib/text-format';
import type { HealthResource } from '../api/mock-health-resources';

const { distance, open, waitApprox } = HEALTH_MAP_LABELS;

/** "Farmacia · Abierta · 0.8 km" · "Centro de salud · ~15 min · 1.2 km" */
export function describeResource(resource: HealthResource): string {
  return joinParts([
    RESOURCE_TYPE_LABELS[resource.type],
    resource.isOpen ? open : undefined,
    resource.waitMinutes === undefined ? undefined : waitApprox(resource.waitMinutes),
    distance(resource.distanceKm),
  ]);
}

export type WaitTier = keyof typeof WAIT_TIMES_LABELS.tiers;

const FAST_MAX_MINUTES = 20;
const MEDIUM_MAX_MINUTES = 35;

export function getWaitTier(minutes: number): WaitTier {
  if (minutes <= FAST_MAX_MINUTES) return 'fast';
  if (minutes <= MEDIUM_MAX_MINUTES) return 'medium';
  return 'busy';
}

/** "Atención especializada · Demanda alta" */
export function describeWait(resource: HealthResource): string {
  const tier = getWaitTier(resource.waitMinutes ?? 0);
  return joinParts([resource.description, WAIT_TIMES_LABELS.tiers[tier].flow]);
}

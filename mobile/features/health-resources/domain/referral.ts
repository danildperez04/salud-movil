// features/health-resources/domain/referral.ts
// Sugerencia de establecimientos según el servicio y la prioridad. Sin React.
// TODO: el backend debería resolver la referencia real según la red de servicios.
import type { HealthResource } from '../api/mock-health-resources';
import type { ReferralPriority, ResourceType } from './resource-catalog';

const DEFAULT_TYPES: ResourceType[] = ['hospital', 'health-center'];

/** Tipos de establecimiento que atienden cada servicio (si no está, hospital o centro de salud). */
const SERVICE_TYPES: Record<string, ResourceType[]> = {
  Farmacia: ['pharmacy'],
  'Laboratorio Clínico': ['laboratory'],
  'Banco de sangre': ['blood-bank'],
  Vacunación: ['vaccination', 'health-center'],
  Psicología: ['psychology', 'health-center'],
  Psiquiatría: ['hospital', 'psychology'],
  'Medicina de Emergencias': ['hospital'],
  'Radiología e Imagenología': ['hospital'],
};

const MAX_OPTIONS = 3;

const byDistance = (a: HealthResource, b: HealthResource) => a.distanceKm - b.distanceKm;

/** Menor espera primero; los que no informan espera, al final. */
const byWait = (a: HealthResource, b: HealthResource) =>
  (a.waitMinutes ?? Number.MAX_SAFE_INTEGER) - (b.waitMinutes ?? Number.MAX_SAFE_INTEGER) ||
  byDistance(a, b);

export function findReferralOptions(
  resources: HealthResource[],
  service: string,
  priority: ReferralPriority,
): HealthResource[] {
  const types = SERVICE_TYPES[service] ?? DEFAULT_TYPES;
  // una urgencia va a un hospital siempre que el servicio se atienda en uno
  const urgentTypes = types.filter((type) => type === 'hospital');
  const allowed = priority === 'urgent' && urgentTypes.length > 0 ? urgentTypes : types;

  return resources
    .filter((resource) => allowed.includes(resource.type))
    .sort(priority === 'scheduled' ? byDistance : byWait)
    .slice(0, MAX_OPTIONS);
}

// features/health-resources/domain/resource-catalog.ts
// Tipos de recurso, filtros del mapa y catálogo de servicios. Sin React.
import { REFERRAL_LABELS, RESOURCE_FILTER_LABELS, RESOURCE_TYPE_LABELS } from '@/constants/labels';
import type { HealthResource } from '../api/mock-health-resources';

export type ResourceType = keyof typeof RESOURCE_TYPE_LABELS;
export type ResourceFilter = keyof typeof RESOURCE_FILTER_LABELS;
export type ReferralPriority = keyof typeof REFERRAL_LABELS.priorities;

/** Qué tipos de recurso muestra cada filtro del mapa ("all" los muestra todos). */
const FILTER_TYPES: Record<Exclude<ResourceFilter, 'all'>, ResourceType[]> = {
  pharmacy: ['pharmacy'],
  health: ['health-center', 'hospital'],
  laboratory: ['laboratory'],
  vaccination: ['vaccination'],
  'blood-bank': ['blood-bank'],
  ambulance: ['ambulance'],
  psychology: ['psychology'],
};

export function filterResources(
  resources: HealthResource[],
  filter: ResourceFilter,
): HealthResource[] {
  if (filter === 'all') return resources;
  return resources.filter((resource) => FILTER_TYPES[filter].includes(resource.type));
}

/** Especialidades y servicios que se pueden buscar o consultar en un hospital. */
export const HEALTH_SERVICES = [
  'Medicina General',
  'Medicina Familiar',
  'Medicina Interna',
  'Pediatría',
  'Ginecología y Obstetricia',
  'Cardiología',
  'Dermatología',
  'Endocrinología',
  'Gastroenterología',
  'Neurología',
  'Neumología',
  'Nefrología',
  'Reumatología',
  'Hematología',
  'Oncología',
  'Infectología',
  'Alergología e Inmunología',
  'Psiquiatría',
  'Psicología',
  'Nutrición',
  'Cirugía General',
  'Ortopedia y Traumatología',
  'Urología',
  'Otorrinolaringología',
  'Oftalmología',
  'Odontología / Estomatología',
  'Cirugía Maxilofacial',
  'Neurocirugía',
  'Cirugía Cardiovascular',
  'Cirugía Pediátrica',
  'Anestesiología',
  'Medicina de Emergencias',
  'Geriatría',
  'Fisiatría y Rehabilitación',
  'Radiología e Imagenología',
  'Patología',
  'Laboratorio Clínico',
  'Vacunación',
  'Farmacia',
  'Banco de sangre',
] as const;

export const DEFAULT_SERVICE = HEALTH_SERVICES[0];

/** Opciones listas para un selector (el valor es el mismo texto). */
export const HEALTH_SERVICE_OPTIONS = HEALTH_SERVICES.map((service) => ({
  value: service,
  label: service,
}));

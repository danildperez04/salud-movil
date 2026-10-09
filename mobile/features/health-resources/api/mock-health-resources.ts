// features/health-resources/api/mock-health-resources.ts
//
// Mock temporal — el backend no expone recursos sanitarios ni tiempos de espera
// todavía. Cuando existan los endpoints, reemplazar estas funciones por apiClient
// sin tocar las pantallas.
// TODO: los teléfonos oficiales deben venir del backend; mientras falten, las
// acciones "Llamar" y "WhatsApp" abren la app sin número para no marcar uno inventado.
import type { ResourceType } from '../domain/resource-catalog';

export type HealthResource = {
  id: string;
  name: string;
  type: ResourceType;
  /** descripción corta (ej. "Atención especializada") */
  description: string;
  distanceKm: number;
  /** espera aproximada en minutos (solo centros de atención) */
  waitMinutes?: number;
  isOpen?: boolean;
  /** texto que se busca en las apps de mapas */
  address: string;
  phone?: string;
  /** posición en la vista ilustrativa del mapa, en % del ancho y del alto */
  mapPosition: { x: number; y: number };
};

const RESOURCES: HealthResource[] = [
  {
    id: 'pharmacy-central',
    name: 'Farmacia Central',
    type: 'pharmacy',
    description: 'Medicamentos y orientación farmacéutica',
    distanceKm: 0.8,
    isOpen: true,
    address: 'Farmacia Central, Estelí, Nicaragua',
    mapPosition: { x: 24, y: 24 },
  },
  {
    id: 'health-center-north',
    name: 'Centro de Salud Norte',
    type: 'health-center',
    description: 'Atención primaria',
    distanceKm: 1.2,
    waitMinutes: 15,
    address: 'Centro de Salud Norte, Estelí, Nicaragua',
    mapPosition: { x: 76, y: 14 },
  },
  {
    id: 'lab-vida',
    name: 'Laboratorio Vida',
    type: 'laboratory',
    description: 'Resultados el mismo día',
    distanceKm: 1.6,
    address: 'Laboratorio Vida, Estelí, Nicaragua',
    mapPosition: { x: 56, y: 52 },
  },
  {
    id: 'vaccination-center',
    name: 'Centro de Vacunación',
    type: 'vaccination',
    description: 'Esquema de vacunación para toda la familia',
    distanceKm: 1.9,
    address: 'Centro de Vacunación, Estelí, Nicaragua',
    mapPosition: { x: 84, y: 46 },
  },
  {
    id: 'support-center',
    name: 'Centro de apoyo',
    type: 'psychology',
    description: 'Atención con cita previa',
    distanceKm: 2.1,
    address: 'Centro de apoyo psicológico, Estelí, Nicaragua',
    mapPosition: { x: 38, y: 64 },
  },
  {
    id: 'blood-bank',
    name: 'Banco de Sangre',
    type: 'blood-bank',
    description: 'Disponibilidad por confirmar',
    distanceKm: 2.4,
    address: 'Banco de Sangre, Estelí, Nicaragua',
    mapPosition: { x: 16, y: 54 },
  },
  {
    id: 'heart-clinic',
    name: 'Clínica del Corazón',
    type: 'health-center',
    description: 'Cardiología y consulta general',
    distanceKm: 2.7,
    waitMinutes: 25,
    address: 'Clínica del Corazón, Estelí, Nicaragua',
    mapPosition: { x: 66, y: 74 },
  },
  {
    id: 'ambulance-service',
    name: 'Servicio de Ambulancias',
    type: 'ambulance',
    description: 'Traslado de pacientes',
    distanceKm: 3,
    address: 'Servicio de Ambulancias, Estelí, Nicaragua',
    mapPosition: { x: 10, y: 80 },
  },
  {
    id: 'hospital-regional',
    name: 'Hospital Regional',
    type: 'hospital',
    description: 'Atención especializada',
    distanceKm: 3.4,
    waitMinutes: 45,
    address: 'Hospital Regional, Estelí, Nicaragua',
    mapPosition: { x: 88, y: 78 },
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockHealthResources(): Promise<HealthResource[]> {
  await delay(250);
  return RESOURCES;
}

// Una espera real cambia de un momento a otro: cada actualización la mueve un poco.
const WAIT_JITTER = [0, 3, -2, 4, -3];
const MIN_WAIT_MINUTES = 5;
let refreshCount = 0;

/** Centros de atención con su espera aproximada actual. */
export async function fetchMockWaitTimes(): Promise<HealthResource[]> {
  await delay(350);
  const round = refreshCount;
  refreshCount += 1;

  return RESOURCES.flatMap((resource, index) =>
    resource.waitMinutes === undefined
      ? []
      : [
          {
            ...resource,
            waitMinutes: Math.max(
              MIN_WAIT_MINUTES,
              resource.waitMinutes + WAIT_JITTER[(round + index) % WAIT_JITTER.length],
            ),
          },
        ],
  );
}

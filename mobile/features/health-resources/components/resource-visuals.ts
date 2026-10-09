// features/health-resources/components/resource-visuals.ts
// Íconos y colores de cada tipo de recurso y de cada nivel de espera.
import {
  Ambulance,
  Droplet,
  FlaskConical,
  Heart,
  Hospital,
  Pill,
  Syringe,
  type LucideIcon,
} from 'lucide-react-native';
import { statusColors } from '@/lib/tokens';
import type { ResourceType } from '../domain/resource-catalog';
import type { WaitTier } from '../domain/resource-format';

export const RESOURCE_ICONS: Record<ResourceType, LucideIcon> = {
  pharmacy: Pill,
  'health-center': Hospital,
  hospital: Hospital,
  laboratory: FlaskConical,
  'blood-bank': Droplet,
  vaccination: Syringe,
  ambulance: Ambulance,
  psychology: Heart,
};

/** Color del marcador de cada tipo en el mapa. */
export const RESOURCE_COLORS: Record<ResourceType, string> = {
  pharmacy: '#2DB79A',
  'health-center': '#2A9BB5',
  hospital: '#2A9BB5',
  laboratory: '#7A6AD8',
  'blood-bank': '#DC2626',
  vaccination: '#2D7F8E',
  ambulance: '#EA580C',
  psychology: '#E99B36',
};

export const WAIT_TIER_COLORS: Record<WaitTier, string> = {
  fast: statusColors.success,
  medium: statusColors.success,
  busy: statusColors.warning,
};

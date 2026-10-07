// features/health-indicators/routes.ts
// Destinos de navegación del feature, en un solo lugar para no repetir strings.
import type { Href } from 'expo-router';
import { slugFromTypeName } from './domain/indicator-type';

export const indicatorRoutes = {
  evolution: (typeName: string): Href =>
    `/(app)/health-indicators/${slugFromTypeName(typeName)}/evolution`,
  history: (typeName: string): Href =>
    `/(app)/health-indicators/${slugFromTypeName(typeName)}/history`,
  /** `typeName` preselecciona el tipo en el formulario */
  register: (typeName?: string): Href => ({
    pathname: '/(app)/health-indicators/new',
    params: typeName ? { type: slugFromTypeName(typeName) } : {},
  }),
};

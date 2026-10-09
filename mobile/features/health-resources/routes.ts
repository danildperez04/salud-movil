// features/health-resources/routes.ts
import type { Href } from 'expo-router';

export const healthResourceRoutes = {
  map: '/(app)/health-map' as Href,
  resource: (id: string): Href => `/(app)/health-map/${id}`,
  referral: '/(app)/referral' as Href,
  waitTimes: '/(app)/wait-times' as Href,
  /** `resourceId` indica el hospital; `service` preselecciona la especialidad */
  hospitalGuide: (resourceId?: string, service?: string): Href => ({
    pathname: '/(app)/referral/hospital-guide',
    params: { ...(resourceId && { resourceId }), ...(service && { service }) },
  }),
};

// features/security/routes.ts
import type { Href } from 'expo-router';

const BASE = '/(app)/security';

export const securityRoutes = {
  home: BASE as Href,
  password: `${BASE}/password` as Href,
  biometric: `${BASE}/biometric` as Href,
  devices: `${BASE}/devices` as Href,
};

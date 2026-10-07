// features/emergency/routes.ts
import type { Href } from 'expo-router';

const BASE = '/(app)/emergency';

export const emergencyRoutes = {
  home: BASE as Href,
  newContact: `${BASE}/contacts/new` as Href,
};

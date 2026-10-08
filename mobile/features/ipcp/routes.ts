// features/ipcp/routes.ts
import type { Href } from 'expo-router';

const BASE = '/(app)/ipcp';

export const ipcpRoutes = {
  assessment: BASE as Href,
  result: `${BASE}/result` as Href,
};

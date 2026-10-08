// features/ipcp/routes.ts
import type { Href } from 'expo-router';

export const ipcpRoutes = {
  /** El IPCP se calcula solo: no hay formulario, la pantalla muestra el resultado actual. */
  overview: '/(app)/ipcp' as Href,
};

/** Ciclo de vida de una solicitud, de la llegada al cierre. */
export const DEMO_REQUEST_STATUSES = [
  'pending',
  'contacted',
  'scheduled',
  'completed',
  'discarded',
] as const;
export type DemoRequestStatus = (typeof DEMO_REQUEST_STATUSES)[number];

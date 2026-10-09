import type { DemoRequestStatus } from '../types';

/** Orden del ciclo de vida: el de los filtros y el del selector de estado. */
export const DEMO_STATUSES: DemoRequestStatus[] = [
  'pending',
  'contacted',
  'scheduled',
  'completed',
  'discarded',
];

export const DEMO_STATUS_LABELS: Record<DemoRequestStatus, string> = {
  pending: 'Pendiente',
  contacted: 'Contactada',
  scheduled: 'Agendada',
  completed: 'Realizada',
  discarded: 'Descartada',
};

export const DEMO_STATUS_VARIANTS: Record<
  DemoRequestStatus,
  'warning' | 'primary' | 'success' | 'neutral'
> = {
  pending: 'warning',
  contacted: 'primary',
  scheduled: 'primary',
  completed: 'success',
  discarded: 'neutral',
};

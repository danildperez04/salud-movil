// features/appointments/domain/appointment-status.ts
import { APPOINTMENT_STATUS_LABELS } from '@/constants/labels';

type AppointmentStatusStyle = {
  /** fondo de la píldora */
  badge: string;
  /** color del texto */
  text: string;
};

const DEFAULT_STYLE: AppointmentStatusStyle = {
  badge: 'bg-muted/40',
  text: 'text-muted-foreground',
};

// Claves = cat_appointment_state.name
const STATUS_STYLES: Record<string, AppointmentStatusStyle> = {
  Scheduled: { badge: 'bg-primary/15', text: 'text-primary' },
  Completed: { badge: 'bg-secondary-steel/10', text: 'text-secondary-steel' },
  Cancelled: { badge: 'bg-destructive/10', text: 'text-destructive' },
  'No show': { badge: 'bg-destructive/10', text: 'text-destructive' },
};

/** Estados desde los que todavía tiene sentido cancelar la cita */
const CANCELLABLE_STATUSES = ['Scheduled'];

export function getAppointmentStatus(status: string) {
  return {
    label: APPOINTMENT_STATUS_LABELS[status] ?? status,
    ...(STATUS_STYLES[status] ?? DEFAULT_STYLE),
  };
}

export const isCancellable = (status: string) => CANCELLABLE_STATUSES.includes(status);

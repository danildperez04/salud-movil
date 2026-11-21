// features/appointments/domain/appointment-record.ts
// Cita tal como la usan las pantallas, y la conversión desde la respuesta de la API.
// Sin dependencias de React.
import { APPOINTMENT_TYPE_LABELS } from '@/constants/labels';
import { formatTime12h, toLocalIsoDate } from '@/lib/date-format';

export type AppointmentRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  /** especialidad o tipo de cita: lo que encabeza la tarjeta */
  title: string;
  doctorName: string;
  time: string;
  /** valor tal cual viene de cat_appointment_state.name (ej "Scheduled") */
  status: string;
  /** dónde es; la API no lo trae, el detalle usa el centro de salud del paciente */
  location?: string;
  /** motivo de la consulta */
  reason?: string;
};

/** Lo que usa la app de `PublicAppointment`. */
export type ApiAppointment = {
  id: string;
  /** ISO 8601 */
  dateHour: string;
  reason: string;
  appointmentStateName: string;
  appointmentTypeName: string;
  healthcareWorkerName: string;
};

export function toAppointmentRecord(appointment: ApiAppointment): AppointmentRecord {
  const when = new Date(appointment.dateHour);
  return {
    id: appointment.id,
    date: toLocalIsoDate(when),
    time: formatTime12h(when),
    title:
      APPOINTMENT_TYPE_LABELS[appointment.appointmentTypeName] ?? appointment.appointmentTypeName,
    doctorName: appointment.healthcareWorkerName,
    status: appointment.appointmentStateName,
    reason: appointment.reason,
  };
}

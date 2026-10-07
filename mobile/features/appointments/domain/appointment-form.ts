// features/appointments/domain/appointment-form.ts
// Validación y avance del formulario "Agendar Cita". Sin dependencias de React.
import { z } from 'zod';
import { APPOINTMENTS_LABELS } from '@/constants/labels';
import { combineDateAndTime } from './appointment-date';

const { errors } = APPOINTMENTS_LABELS;

const MAX_REASON_LENGTH = 300;

export const bookAppointmentSchema = z
  .object({
    specialtyId: z.string().min(1, errors.specialtyRequired),
    professionalId: z.string().min(1, errors.professionalRequired),
    // z.date con `error`: cubre también el campo sin elegir (undefined)
    date: z.date({ error: errors.dateRequired }),
    time: z.date({ error: errors.timeRequired }),
    reason: z
      .string()
      .trim()
      .min(1, errors.reasonRequired)
      .max(MAX_REASON_LENGTH, errors.reasonTooLong),
  })
  .superRefine((data, ctx) => {
    // elegir hoy con una hora que ya pasó
    if (combineDateAndTime(data.date, data.time) <= new Date()) {
      ctx.addIssue({ code: 'custom', path: ['time'], message: errors.timeInPast });
    }
  });

export type BookAppointmentValues = z.infer<typeof bookAppointmentSchema>;

/**
 * Paso del stepper (0-3) según lo ya completado: especialidad -> profesional ->
 * fecha y hora -> confirmar. Es el primer paso que todavía falta.
 */
export function getBookingStep(values: Partial<BookAppointmentValues>): number {
  if (!values.specialtyId) return 0;
  if (!values.professionalId) return 1;
  if (!values.date || !values.time) return 2;
  return 3;
}

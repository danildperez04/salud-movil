// features/activity/domain/activity-schema.ts
import { z } from 'zod';
import { ACTIVITY_LABELS } from '@/constants/labels';
import { ACTIVITY_INTENSITIES, ACTIVITY_TYPES } from './activity-catalogs';

const { errors } = ACTIVITY_LABELS;

const MAX_MINUTES = 600;

export const activityFormSchema = z
  .object({
    // sin valor inicial: hay que elegir Sí o No
    done: z.boolean({ error: errors.doneRequired }),
    minutes: z.string().trim(),
    type: z.enum(ACTIVITY_TYPES),
    intensity: z.enum(ACTIVITY_INTENSITIES),
    note: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    // los minutos solo importan cuando sí hubo ejercicio
    if (!data.done) return;

    if (!data.minutes) {
      ctx.addIssue({ code: 'custom', path: ['minutes'], message: errors.minutesRequired });
      return;
    }
    const minutes = Number(data.minutes.replace(',', '.'));
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > MAX_MINUTES) {
      ctx.addIssue({ code: 'custom', path: ['minutes'], message: errors.minutesInvalid });
    }
  });

export type ActivityFormValues = z.infer<typeof activityFormSchema>;

/** Valores con los que arranca (y se reinicia) el formulario. */
export const ACTIVITY_FORM_DEFAULTS = {
  minutes: '',
  type: 'walk',
  intensity: 'moderate',
  note: '',
} as const;

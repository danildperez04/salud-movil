// features/emergency/domain/emergency-contact-schema.ts
import { z } from 'zod';
import { EMERGENCY_LABELS, EMERGENCY_RELATION_LABELS } from '@/constants/labels';
import { keysOf } from '@/lib/catalog';

const { errors } = EMERGENCY_LABELS.form;

export type EmergencyRelation = keyof typeof EMERGENCY_RELATION_LABELS;
export const EMERGENCY_RELATIONS = keysOf(EMERGENCY_RELATION_LABELS);

/** Prefijo de Nicaragua: el teléfono arranca con él para que solo se escriba el número. */
export const DEFAULT_PHONE_PREFIX = '+505 ';

const MIN_PHONE_DIGITS = 8;
const MAX_PHONE_DIGITS = 15;

const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').length;
  return /^[+\d\s()-]+$/.test(value) && digits >= MIN_PHONE_DIGITS && digits <= MAX_PHONE_DIGITS;
};

export const emergencyContactSchema = z.object({
  name: z.string().trim().min(1, errors.nameRequired),
  relation: z.enum(EMERGENCY_RELATIONS),
  phone: z.string().trim().refine(isValidPhone, errors.phoneInvalid),
  isPrimary: z.boolean(),
});

export type EmergencyContactFormValues = z.infer<typeof emergencyContactSchema>;

// features/medications/domain/medication-form.ts
// Validación del formulario "Agregar medicamento" y utilidades de la lista.
// Sin dependencias de React.
import { z } from 'zod';
import { FREQUENCY_LABELS, MEDICATIONS_LABELS } from '@/constants/labels';
import { startOfDay, startOfToday } from '@/lib/date-format';
import { timeMinutes, type MedicationRecord } from './medication-record';

const { errors } = MEDICATIONS_LABELS;

export const DOSE_UNITS = ['mg', 'g', 'mcg', 'ml', 'UI'] as const;
export type DoseUnit = (typeof DOSE_UNITS)[number];

/** Claves de cat_frequency, en el orden en que se muestran. */
export const FREQUENCY_OPTIONS = Object.keys(FREQUENCY_LABELS);

const normalizeNumber = (text: string) => text.trim().replace(',', '.');

export const medicationSchema = z
  .object({
    drugName: z.string().trim().min(1, errors.nameRequired),
    doseAmount: z
      .string()
      .trim()
      .min(1, errors.doseRequired)
      .refine((text) => {
        const value = normalizeNumber(text);
        return /^\d+(\.\d+)?$/.test(value) && Number(value) > 0;
      }, errors.doseInvalid),
    doseUnit: z.enum(DOSE_UNITS),
    activeIngredient: z.string().trim(),
    frequency: z.string().min(1, errors.frequencyRequired),
    quantityLabel: z.string().trim().min(1, errors.quantityRequired),
    time: z.date({ error: errors.timeRequired }),
    startDate: z.date({ error: errors.startRequired }),
    endDate: z.date().optional(),
    expiryDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.endDate && startOfDay(data.endDate) < startOfDay(data.startDate)) {
      ctx.addIssue({ code: 'custom', path: ['endDate'], message: errors.endBeforeStart });
    }
    // un medicamento vencido no se debe registrar como activo
    if (data.expiryDate && startOfDay(data.expiryDate) < startOfToday()) {
      ctx.addIssue({ code: 'custom', path: ['expiryDate'], message: errors.expired });
    }
  });

export type MedicationFormValues = z.infer<typeof medicationSchema>;

/** ("50", "mg") -> "50mg", el formato que muestra la tarjeta. Acepta coma decimal. */
export const formatDose = (amount: string, unit: DoseUnit) => `${normalizeNumber(amount)}${unit}`;

/** Activos primero y, dentro de cada grupo, por hora de la toma. */
export function sortMedications(medications: MedicationRecord[]): MedicationRecord[] {
  return [...medications].sort(
    (a, b) => Number(b.active) - Number(a.active) || timeMinutes(a.time) - timeMinutes(b.time),
  );
}

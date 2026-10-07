// features/help/domain/report-schema.ts
import { z } from 'zod';
import { HELP_LABELS } from '@/constants/labels';
import { keysOf } from '@/lib/catalog';

const { errors } = HELP_LABELS.report;

export type ReportCategory = keyof typeof HELP_LABELS.report.categories;
export const REPORT_CATEGORIES = keysOf(HELP_LABELS.report.categories);

const MIN_DESCRIPTION_LENGTH = 10;

export const reportProblemSchema = z.object({
  category: z.enum(REPORT_CATEGORIES),
  description: z
    .string()
    .trim()
    .min(1, errors.descriptionRequired)
    .min(MIN_DESCRIPTION_LENGTH, errors.descriptionShort),
  email: z.string().trim().min(1, errors.emailRequired).email(errors.emailInvalid),
  // captura de pantalla opcional, elegida con useMediaPicker
  screenshot: z
    .object({
      uri: z.string().min(1),
      name: z.string(),
      mimeType: z.string().optional(),
      kind: z.enum(['image', 'document']),
    })
    .optional(),
});

export type ReportProblemValues = z.infer<typeof reportProblemSchema>;

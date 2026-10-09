// features/security/domain/password-schema.ts
import { z } from 'zod';
import { SECURITY_LABELS } from '@/constants/labels';

const { errors } = SECURITY_LABELS.password;

const MIN_PASSWORD_LENGTH = 8;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, errors.currentRequired),
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, errors.tooShort)
      .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), errors.needsLetterAndNumber),
    confirmPassword: z.string().min(1, errors.confirmRequired),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword && data.confirmPassword !== data.newPassword) {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'], message: errors.mismatch });
    }
    if (data.newPassword && data.newPassword === data.currentPassword) {
      ctx.addIssue({ code: 'custom', path: ['newPassword'], message: errors.sameAsCurrent });
    }
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

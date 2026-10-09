// features/auth/domain/otp-code.ts
import { z } from 'zod';
import { LOGIN_LABELS } from '@/constants/labels';

const { errors } = LOGIN_LABELS.twoFactor;

export const OTP_LENGTH = 6;

/** Deja solo los dígitos (el autocompletado de SMS puede traer espacios o guiones) y corta a 6. */
export function sanitizeOtpInput(text: string): string {
  return text.replace(/\D/g, '').slice(0, OTP_LENGTH);
}

export const otpCodeSchema = z.object({
  code: z
    .string()
    .min(1, errors.codeRequired)
    .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), errors.codeInvalid),
});

export type OtpCodeValues = z.infer<typeof otpCodeSchema>;

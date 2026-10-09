// features/auth/domain/otp-code.ts
import { z } from 'zod';
import { i18n } from '@/lib/i18n';

export const OTP_LENGTH = 6;

/** Deja solo los dígitos (el autocompletado de SMS puede traer espacios o guiones) y corta a 6. */
export function sanitizeOtpInput(text: string): string {
  return text.replace(/\D/g, '').slice(0, OTP_LENGTH);
}

// Los mensajes son funciones: se traducen al validar (en el idioma de ese momento), no al cargar
// el módulo, que es cuando se arma el esquema.
export const otpCodeSchema = z.object({
  code: z
    .string()
    .min(1, { error: () => i18n.t('login:twoFactor.errors.codeRequired') })
    .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), {
      error: () => i18n.t('login:twoFactor.errors.codeInvalid'),
    }),
});

export type OtpCodeValues = z.infer<typeof otpCodeSchema>;

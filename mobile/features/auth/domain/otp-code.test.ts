// features/auth/domain/otp-code.test.ts
// Ejecutar con `npm test`.
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { applyLanguage, i18n } from '@/lib/i18n';
import { otpCodeSchema, sanitizeOtpInput } from './otp-code';

afterEach(() => applyLanguage('es'));

describe('otpCodeSchema', () => {
  it('acepta exactamente 6 dígitos', () => {
    assert.equal(otpCodeSchema.safeParse({ code: '123456' }).success, true);
    assert.equal(otpCodeSchema.safeParse({ code: '000000' }).success, true);
  });

  it('rechaza vacío, corto, largo y no numérico', () => {
    for (const code of ['', '12345', '1234567', '12345a', '12 345']) {
      assert.equal(otpCodeSchema.safeParse({ code }).success, false, code);
    }
  });
});

describe('mensajes de otpCodeSchema', () => {
  const firstMessage = (code: string) => {
    const result = otpCodeSchema.safeParse({ code });
    return result.success ? undefined : result.error.issues[0].message;
  };

  it('se traducen al validar, en el idioma activo en ese momento', () => {
    assert.equal(firstMessage(''), 'Ingresá el código');
    assert.equal(firstMessage('123'), 'El código tiene 6 dígitos');

    applyLanguage('bzk');
    assert.equal(firstMessage(''), 'Put in di code');
    assert.equal(firstMessage('123'), 'Di code have 6 digits');
    assert.equal(firstMessage(''), i18n.t('login:twoFactor.errors.codeRequired'));
  });
});

describe('sanitizeOtpInput', () => {
  it('quita lo que no es dígito y corta a 6', () => {
    assert.equal(sanitizeOtpInput('12a-3 4'), '1234');
    assert.equal(sanitizeOtpInput('1234567890'), '123456');
    assert.equal(sanitizeOtpInput(''), '');
  });
});

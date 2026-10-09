// features/auth/domain/otp-code.test.ts
// Ejecutar con `npm test`.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { otpCodeSchema, sanitizeOtpInput } from './otp-code';

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

describe('sanitizeOtpInput', () => {
  it('quita lo que no es dígito y corta a 6', () => {
    assert.equal(sanitizeOtpInput('12a-3 4'), '1234');
    assert.equal(sanitizeOtpInput('1234567890'), '123456');
    assert.equal(sanitizeOtpInput(''), '');
  });
});

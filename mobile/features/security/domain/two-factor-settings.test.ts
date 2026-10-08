// features/security/domain/two-factor-settings.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SECURITY_LABELS } from '@/constants/labels';
import {
  disableErrorMessage,
  disableTwoFactorSchema,
  enableErrorMessage,
  requestCodeErrorMessage,
} from './two-factor-settings';

const { errors } = SECURITY_LABELS.twoFactor;

describe('disableTwoFactorSchema', () => {
  it('exige la contraseña', () => {
    assert.equal(disableTwoFactorSchema.safeParse({ password: 'abc' }).success, true);
    const result = disableTwoFactorSchema.safeParse({ password: '' });
    assert.equal(result.success, false);
    assert.equal(result.error?.issues[0]?.message, errors.passwordRequired);
  });
});

describe('enableErrorMessage', () => {
  it('400 es código incorrecto y 429 demasiados intentos', () => {
    assert.equal(enableErrorMessage({ status: 400, message: 'x' }), errors.wrongCode);
    assert.equal(enableErrorMessage({ status: 429, message: 'x' }), errors.tooManyRequests);
    assert.equal(enableErrorMessage({ status: 500, message: 'Error 500' }), 'Error 500');
  });
});

describe('requestCodeErrorMessage', () => {
  it('409 ya activo, 429 demasiados intentos; el resto, el error genérico', () => {
    assert.equal(requestCodeErrorMessage({ status: 409, message: 'x' }), errors.alreadyEnabled);
    assert.equal(requestCodeErrorMessage({ status: 429, message: 'x' }), errors.tooManyRequests);
    assert.equal(
      requestCodeErrorMessage({ status: 500, message: 'x' }),
      SECURITY_LABELS.twoFactor.enableError,
    );
  });
});

describe('disableErrorMessage', () => {
  it('400 es contraseña incorrecta y 429 demasiados intentos', () => {
    assert.equal(disableErrorMessage({ status: 400, message: 'x' }), errors.wrongPassword);
    assert.equal(disableErrorMessage({ status: 429, message: 'x' }), errors.tooManyRequests);
    assert.equal(
      disableErrorMessage({ message: 'Network request failed' }),
      'Network request failed',
    );
  });
});

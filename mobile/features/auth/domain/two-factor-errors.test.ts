// features/auth/domain/two-factor-errors.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LOGIN_LABELS } from '@/constants/labels';
import { classifyResendError, verifyErrorMessage } from './two-factor-errors';

const { errors } = LOGIN_LABELS.twoFactor;

describe('verifyErrorMessage', () => {
  it('traduce 401 a código inválido o vencido (no a credenciales)', () => {
    assert.equal(
      verifyErrorMessage({ status: 401, message: 'Unauthorized' }),
      errors.wrongOrExpired,
    );
  });

  it('traduce 429 y deja pasar el resto', () => {
    assert.equal(verifyErrorMessage({ status: 429, message: 'x' }), errors.tooManyRequests);
    assert.equal(verifyErrorMessage({ status: 500, message: 'Error 500' }), 'Error 500');
    assert.equal(
      verifyErrorMessage({ message: 'Network request failed' }),
      'Network request failed',
    );
  });
});

describe('classifyResendError', () => {
  it('429 es demasiado pronto, 400 es desafío inexistente', () => {
    assert.equal(classifyResendError({ status: 429, message: 'x' }).kind, 'too-soon');
    assert.equal(classifyResendError({ status: 400, message: 'x' }).kind, 'gone');
    assert.deepEqual(classifyResendError({ status: 500, message: 'boom' }), {
      kind: 'other',
      message: 'boom',
    });
  });
});

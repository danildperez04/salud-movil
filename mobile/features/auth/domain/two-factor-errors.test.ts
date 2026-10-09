// features/auth/domain/two-factor-errors.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { COMMON_LABELS, LOGIN_LABELS } from '@/constants/labels';
import { classifyResendError, verifyErrorMessage } from './two-factor-errors';

const { errors } = LOGIN_LABELS.twoFactor;
const { unauthorized, unavailable, network } = COMMON_LABELS.errors;

describe('verifyErrorMessage', () => {
  it('traduce 401 a código inválido o vencido (no a credenciales)', () => {
    assert.equal(verifyErrorMessage({ status: 401, message: unauthorized }), errors.wrongOrExpired);
  });

  it('traduce 429 y deja pasar el resto', () => {
    assert.equal(verifyErrorMessage({ status: 429, message: 'x' }), errors.tooManyRequests);
    assert.equal(verifyErrorMessage({ status: 500, message: unavailable }), unavailable);
    assert.equal(verifyErrorMessage({ status: 0, message: network }), network);
  });
});

describe('classifyResendError', () => {
  it('429 es demasiado pronto, 400 es desafío inexistente', () => {
    assert.equal(classifyResendError({ status: 429, message: 'x' }).kind, 'too-soon');
    assert.equal(classifyResendError({ status: 400, message: 'x' }).kind, 'gone');
    assert.deepEqual(classifyResendError({ status: 500, message: unavailable }), {
      kind: 'other',
      message: unavailable,
    });
  });
});

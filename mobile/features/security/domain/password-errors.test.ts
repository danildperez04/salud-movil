// features/security/domain/password-errors.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SECURITY_LABELS } from '@/constants/labels';
import { changePasswordErrorMessage } from './password-errors';

const labels = SECURITY_LABELS.password;

describe('changePasswordErrorMessage', () => {
  it('400 es contraseña actual incorrecta, 429 demasiados intentos', () => {
    assert.equal(changePasswordErrorMessage({ status: 400 }), labels.currentIncorrect);
    assert.equal(changePasswordErrorMessage({ status: 429 }), labels.tooManyRequests);
  });

  it('cualquier otro error (o sin respuesta) es el genérico', () => {
    assert.equal(changePasswordErrorMessage({ status: 500 }), labels.saveError);
    assert.equal(changePasswordErrorMessage({}), labels.saveError);
  });
});

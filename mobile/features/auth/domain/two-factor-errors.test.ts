// features/auth/domain/two-factor-errors.test.ts
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { applyLanguage, i18n } from '@/lib/i18n';
import { AVAILABLE_LANGUAGES } from '@/lib/i18n/languages';
import { classifyResendError, verifyErrorMessage } from './two-factor-errors';

afterEach(() => applyLanguage('es'));

/** Corre el mismo caso en cada idioma: los mensajes del 2FA no pueden quedar sin traducir. */
function inEveryLanguage(name: string, run: () => void) {
  for (const language of AVAILABLE_LANGUAGES) {
    it(`${name} (${language})`, () => {
      applyLanguage(language);
      run();
    });
  }
}

describe('verifyErrorMessage', () => {
  inEveryLanguage('traduce 401 a código inválido o vencido (no a credenciales)', () => {
    assert.equal(
      verifyErrorMessage({ status: 401, message: i18n.t('errors.unauthorized') }),
      i18n.t('login:twoFactor.errors.wrongOrExpired'),
    );
  });

  inEveryLanguage('traduce 429 y deja pasar el resto', () => {
    const unavailable = i18n.t('errors.unavailable');
    const network = i18n.t('errors.network');

    assert.equal(
      verifyErrorMessage({ status: 429, message: 'x' }),
      i18n.t('login:twoFactor.errors.tooManyRequests'),
    );
    assert.equal(verifyErrorMessage({ status: 500, message: unavailable }), unavailable);
    assert.equal(verifyErrorMessage({ status: 0, message: network }), network);
  });

  it('el mensaje cambia con el idioma activo', () => {
    const spanish = verifyErrorMessage({ status: 401, message: '' });
    applyLanguage('bzk');
    assert.equal(
      verifyErrorMessage({ status: 401, message: '' }),
      'Di code wrong or it done expire. Check it or ask fi a new one.',
    );
    assert.notEqual(verifyErrorMessage({ status: 401, message: '' }), spanish);
  });
});

describe('classifyResendError', () => {
  inEveryLanguage('429 es demasiado pronto, 400 es desafío inexistente', () => {
    const unavailable = i18n.t('errors.unavailable');

    assert.equal(classifyResendError({ status: 429, message: 'x' }).kind, 'too-soon');
    assert.equal(classifyResendError({ status: 400, message: 'x' }).kind, 'gone');
    assert.equal(
      classifyResendError({ status: 400, message: 'x' }).message,
      i18n.t('login:twoFactor.errors.challengeGone'),
    );
    assert.deepEqual(classifyResendError({ status: 500, message: unavailable }), {
      kind: 'other',
      message: unavailable,
    });
  });
});

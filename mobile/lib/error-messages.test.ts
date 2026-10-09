// lib/error-messages.test.ts
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { applyLanguage, i18n } from '@/lib/i18n';
import { AVAILABLE_LANGUAGES } from '@/lib/i18n/languages';
import { messageForStatus, UserFacingError, userMessage } from './error-messages';

afterEach(() => applyLanguage('es'));

/** Corre el mismo caso en cada idioma: los mensajes de error no pueden quedar sin traducir. */
function inEveryLanguage(name: string, run: () => void) {
  for (const language of AVAILABLE_LANGUAGES) {
    it(`${name} (${language})`, () => {
      applyLanguage(language);
      run();
    });
  }
}

describe('messageForStatus', () => {
  inEveryLanguage('traduce los códigos más comunes', () => {
    assert.equal(messageForStatus(400), i18n.t('errors.invalidData'));
    assert.equal(messageForStatus(422), i18n.t('errors.invalidData'));
    assert.equal(messageForStatus(401), i18n.t('errors.unauthorized'));
    assert.equal(messageForStatus(403), i18n.t('errors.forbidden'));
    assert.equal(messageForStatus(404), i18n.t('errors.notFound'));
    assert.equal(messageForStatus(409), i18n.t('errors.conflict'));
    assert.equal(messageForStatus(413), i18n.t('errors.tooLarge'));
    assert.equal(messageForStatus(429), i18n.t('errors.tooManyRequests'));
  });

  inEveryLanguage('cualquier 5xx es un problema nuestro', () => {
    for (const status of [500, 502, 503, 504, 599]) {
      assert.equal(messageForStatus(status), i18n.t('errors.unavailable'));
    }
  });

  inEveryLanguage('un código desconocido cae en el mensaje genérico', () => {
    assert.equal(messageForStatus(418), i18n.t('errors.unexpected'));
    assert.equal(messageForStatus(0), i18n.t('errors.unexpected'));
  });

  inEveryLanguage('ningún mensaje deja ver códigos ni jerga técnica', () => {
    const technical = /\b(error|http|api|token|json|null|undefined|\d{3})\b/i;
    for (const status of [0, 400, 401, 403, 404, 409, 413, 418, 422, 429, 500, 503]) {
      assert.doesNotMatch(messageForStatus(status), technical);
    }
  });

  it('responde en el idioma activo al momento de llamar, no al cargar el módulo', () => {
    const spanish = messageForStatus(404);
    applyLanguage('bzk');
    const creole = messageForStatus(404);

    assert.notEqual(creole, spanish);
    assert.equal(creole, "Wi couldn't find wha yu de look fi.");
  });
});

describe('userMessage', () => {
  inEveryLanguage('deja pasar el texto de un UserFacingError', () => {
    assert.equal(userMessage(new UserFacingError('Ingresá desde la web')), 'Ingresá desde la web');
  });

  inEveryLanguage('reemplaza cualquier otro error por el mensaje genérico', () => {
    const unexpected = i18n.t('errors.unexpected');

    assert.equal(userMessage(new TypeError('Network request failed')), unexpected);
    assert.equal(
      userMessage(new SyntaxError('JSON Parse error: Unexpected character: <')),
      unexpected,
    );
    assert.equal(userMessage('Error 500'), unexpected);
    assert.equal(userMessage(undefined), unexpected);
  });
});

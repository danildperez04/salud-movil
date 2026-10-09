// lib/error-messages.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { COMMON_LABELS } from '@/constants/labels';
import { messageForStatus, UserFacingError, userMessage } from './error-messages';

const messages = COMMON_LABELS.errors;

describe('messageForStatus', () => {
  it('traduce los códigos más comunes', () => {
    assert.equal(messageForStatus(400), messages.invalidData);
    assert.equal(messageForStatus(422), messages.invalidData);
    assert.equal(messageForStatus(401), messages.unauthorized);
    assert.equal(messageForStatus(403), messages.forbidden);
    assert.equal(messageForStatus(404), messages.notFound);
    assert.equal(messageForStatus(409), messages.conflict);
    assert.equal(messageForStatus(413), messages.tooLarge);
    assert.equal(messageForStatus(429), messages.tooManyRequests);
  });

  it('cualquier 5xx es un problema nuestro', () => {
    for (const status of [500, 502, 503, 504, 599]) {
      assert.equal(messageForStatus(status), messages.unavailable);
    }
  });

  it('un código desconocido cae en el mensaje genérico', () => {
    assert.equal(messageForStatus(418), messages.unexpected);
    assert.equal(messageForStatus(0), messages.unexpected);
  });

  it('ningún mensaje deja ver códigos ni jerga técnica', () => {
    const technical = /\b(error|http|api|token|json|null|undefined|\d{3})\b/i;
    for (const status of [0, 400, 401, 403, 404, 409, 413, 418, 422, 429, 500, 503]) {
      assert.doesNotMatch(messageForStatus(status), technical);
    }
  });
});

describe('userMessage', () => {
  it('deja pasar el texto de un UserFacingError', () => {
    assert.equal(userMessage(new UserFacingError('Ingresá desde la web')), 'Ingresá desde la web');
  });

  it('reemplaza cualquier otro error por el mensaje genérico', () => {
    assert.equal(userMessage(new TypeError('Network request failed')), messages.unexpected);
    assert.equal(
      userMessage(new SyntaxError('JSON Parse error: Unexpected character: <')),
      messages.unexpected,
    );
    assert.equal(userMessage('Error 500'), messages.unexpected);
    assert.equal(userMessage(undefined), messages.unexpected);
  });
});

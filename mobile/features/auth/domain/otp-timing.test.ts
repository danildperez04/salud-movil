// features/auth/domain/otp-timing.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatCountdown, parseExpiry, secondsUntil } from './otp-timing';

describe('secondsUntil', () => {
  it('redondea hacia arriba y no baja de 0', () => {
    assert.equal(secondsUntil(10_000, 0), 10);
    assert.equal(secondsUntil(10_001, 0), 11);
    assert.equal(secondsUntil(10_000, 10_000), 0);
    assert.equal(secondsUntil(10_000, 20_000), 0);
  });
});

describe('parseExpiry', () => {
  it('lee fechas ISO y marca las inválidas con NaN', () => {
    assert.equal(parseExpiry('2026-10-08T12:00:00.000Z'), Date.UTC(2026, 9, 8, 12));
    assert.ok(Number.isNaN(parseExpiry('no-es-fecha')));
  });
});

describe('formatCountdown', () => {
  it('formatea m:ss', () => {
    assert.equal(formatCountdown(300), '5:00');
    assert.equal(formatCountdown(65), '1:05');
    assert.equal(formatCountdown(9), '0:09');
    assert.equal(formatCountdown(-3), '0:00');
  });
});

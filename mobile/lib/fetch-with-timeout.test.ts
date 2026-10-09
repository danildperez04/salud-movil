// lib/fetch-with-timeout.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RequestTimeoutError, withTimeout } from './fetch-with-timeout';

/** Una petición que nunca responde, salvo que la cancelen. */
const hangs = (signal: AbortSignal) =>
  new Promise<string>((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('aborted')));
  });

describe('withTimeout', () => {
  it('devuelve el resultado si responde a tiempo', async () => {
    assert.equal(await withTimeout(200, async () => 'ok'), 'ok');
  });

  it('cancela y falla con RequestTimeoutError si no responde', async () => {
    await assert.rejects(
      withTimeout(20, hangs),
      (error) => error instanceof RequestTimeoutError && error.timeoutMs === 20,
    );
  });

  it('un error propio de la petición se conserva tal cual', async () => {
    const boom = new Error('Network request failed');
    await assert.rejects(
      withTimeout(200, async () => {
        throw boom;
      }),
      (error) => error === boom,
    );
  });

  it('no deja el temporizador corriendo después de responder', async () => {
    let signalAborted = false;
    await withTimeout(30, async (signal) => {
      signal.addEventListener('abort', () => (signalAborted = true));
      return 'ok';
    });
    await new Promise((resolve) => setTimeout(resolve, 60));
    assert.equal(signalAborted, false);
  });
});

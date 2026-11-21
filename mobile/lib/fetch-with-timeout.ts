// lib/fetch-with-timeout.ts

export class RequestTimeoutError extends Error {
  constructor(public timeoutMs: number) {
    super(`La petición no respondió en ${Math.round(timeoutMs / 1000)} s`);
    this.name = 'RequestTimeoutError';
  }
}

/**
 * `fetch` que se cancela pasado `timeoutMs`. React Native no tiene timeout por defecto: si el
 * servidor acepta la conexión y no contesta (ej. un servicio dormido o caído) la petición
 * queda colgada minutos y la pantalla se queda en "cargando".
 *
 * `run` recibe la señal de cancelación y debe hacer el `fetch` Y leer el cuerpo, para que el
 * límite también cubra una respuesta que se corta a la mitad.
 */
export async function withTimeout<T>(
  timeoutMs: number,
  run: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    return await run(controller.signal);
  } catch (error) {
    if (timedOut) throw new RequestTimeoutError(timeoutMs);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

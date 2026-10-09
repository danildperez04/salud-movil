// features/auth/hooks/useSecondsLeft.ts
import { useEffect, useReducer } from 'react';
import { secondsUntil } from '../domain/otp-timing';

/** Segundos que faltan para `deadlineMs`, actualizado cada segundo (0 si ya pasó o no hay fecha). */
export function useSecondsLeft(deadlineMs: number | null | undefined): number {
  // El intervalo solo fuerza el re-render: el valor se calcula contra el reloj al renderizar,
  // así un plazo nuevo (reenvío) nunca muestra un valor viejo.
  const [, tick] = useReducer((count: number) => count + 1, 0);
  const hasDeadline = deadlineMs != null && !Number.isNaN(deadlineMs);

  useEffect(() => {
    if (!hasDeadline || Date.now() >= deadlineMs) return;

    const id = setInterval(() => {
      tick();
      if (Date.now() >= deadlineMs) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [hasDeadline, deadlineMs]);

  // eslint-disable-next-line react-hooks/purity -- leer el reloj es justo el objetivo de este hook
  return hasDeadline ? secondsUntil(deadlineMs, Date.now()) : 0;
}

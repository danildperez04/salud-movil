/** Formatea una fecha ISO al formato "dd de mes de yyyy" usado en toda la app. */
export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Fecha y hora para las marcas de tiempo de eventos (citas, tomas, consultas).
 * Los valores con hora llegan como `timestamp without time zone` en UTC, así que
 * se interpretan en la zona local del navegador, que es la del paciente.
 */
export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

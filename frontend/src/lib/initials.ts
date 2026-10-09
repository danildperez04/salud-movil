/**
 * Iniciales para los avatares. Se usa en el layout del panel y en la ficha del
 * paciente, así que vive aquí y no duplicada.
 */
export function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

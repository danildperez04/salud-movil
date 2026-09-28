/**
 * También vive duplicada como función local en layouts/AppLayout.tsx.
 * Cuando puedas, reemplázala ahí por este import para no repetirla.
 */
export function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

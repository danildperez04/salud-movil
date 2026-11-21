/** Tamaño de archivo legible: `1536` → "1.5 KB", `44040192` → "42 MB". */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  // Sin decimales cuando son inútiles (42 MB) y uno en los demás casos (1.5 KB).
  const text = value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1);
  return `${text} ${units[unit]}`;
}

/**
 * Monto en córdobas con separador de miles: `9000` → "C$ 9,000".
 *
 * Los separadores se fijan con `en-US` a propósito: el grupo de miles de las
 * variantes de español cambia según el navegador (algunas no agrupan los
 * números de cuatro cifras), y el precio no debe verse distinto en cada uno.
 */
export function formatCordobas(amount: number): string {
  return `C$ ${amount.toLocaleString('en-US')}`;
}

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

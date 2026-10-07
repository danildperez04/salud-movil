// lib/date-format.ts
// Formato fijo en vez de toLocale*: el AM/PM y las abreviaturas cambian según
// el motor de Intl y la versión de ICU del dispositivo.

/** Date -> "08:30 AM" */
export function formatTime12h(date: Date): string {
  const hours = date.getHours();
  const period = hours < 12 ? 'AM' : 'PM';
  const hours12 = String(hours % 12 || 12).padStart(2, '0');
  return `${hours12}:${String(date.getMinutes()).padStart(2, '0')} ${period}`;
}

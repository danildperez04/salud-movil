// features/security/domain/describe-session.ts
// Texto de apoyo de cada sesión ("Sesión actual · Nicaragua", "Último acceso: ayer, 08:42 PM").
import { SECURITY_LABELS } from '@/constants/labels';
import { formatDateShort, formatTime12h, startOfDay } from '@/lib/date-format';
import { joinParts } from '@/lib/text-format';
import type { DeviceSession } from '../api/mock-security';

const { devices } = SECURITY_LABELS;
const DAY_MS = 24 * 60 * 60 * 1000;

/** "hoy, 08:42 PM" · "ayer, 08:42 PM" · "09 sep 2026, 08:42 PM" */
export function formatLastAccess(date: Date, now: Date = new Date()): string {
  const time = formatTime12h(date);
  const daysAgo = Math.round((startOfDay(now).getTime() - startOfDay(date).getTime()) / DAY_MS);

  if (daysAgo === 0) return `${devices.today}, ${time}`;
  if (daysAgo === 1) return `${devices.yesterday}, ${time}`;
  return `${formatDateShort(date)}, ${time}`;
}

export function describeSession(session: DeviceSession, now: Date = new Date()): string {
  if (session.isCurrent) return joinParts([devices.currentSession, session.location]);
  return devices.lastAccess(formatLastAccess(new Date(session.lastAccessAt), now));
}

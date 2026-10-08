// features/ipcp/components/ipcp-visuals.ts
import { Activity, CalendarDays, Heart, ShieldCheck, TriangleAlert } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { statusColors } from '@/lib/tokens';
import type { IpcpLevel } from '../domain/ipcp-score';

/** Color e ícono de cada nivel de riesgo (verde, ámbar, rojo). */
export const LEVEL_VISUALS: Record<IpcpLevel, { color: string; icon: LucideIcon }> = {
  low: { color: '#15803D', icon: ShieldCheck },
  moderate: { color: statusColors.warning, icon: TriangleAlert },
  high: { color: statusColors.danger, icon: TriangleAlert },
};

/** Íconos de las tres recomendaciones, en el mismo orden que sus textos. */
export const RECOMMENDATION_ICONS: readonly LucideIcon[] = [Heart, Activity, CalendarDays];

// sufijos hex de opacidad: 1A ≈ 10 %, 33 ≈ 20 %
export const withAlpha = (color: string, alpha: '1A' | '33') => color + alpha;

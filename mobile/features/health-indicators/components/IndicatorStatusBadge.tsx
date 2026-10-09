// features/health-indicators/components/IndicatorStatusBadge.tsx
import { ToneBadge } from '@/components/ui/tone-badge';
import { INDICATOR_STATUS_LABELS } from '@/constants/labels';
import type { IndicatorStatus } from '../domain/indicator-range';
import { INDICATOR_STATUS_COLORS } from './IndicatorRangeBar';

export function IndicatorStatusBadge({ status }: { status: IndicatorStatus }) {
  return (
    <ToneBadge label={INDICATOR_STATUS_LABELS[status]} color={INDICATOR_STATUS_COLORS[status]} />
  );
}

// features/health-indicators/components/IndicatorStatusBadge.tsx
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { INDICATOR_STATUS_LABELS } from '@/constants/labels';
import type { IndicatorStatus } from '../domain/indicator-range';
import { INDICATOR_STATUS_COLORS } from './IndicatorRangeBar';

// sufijos hex de opacidad: 1A ≈ 10 %, 4D ≈ 30 %
const FILL_ALPHA = '1A';
const BORDER_ALPHA = '4D';

export function IndicatorStatusBadge({ status }: { status: IndicatorStatus }) {
  const color = INDICATOR_STATUS_COLORS[status];

  return (
    <Badge
      variant="outline"
      className="px-3 py-1.5"
      style={{ backgroundColor: color + FILL_ALPHA, borderColor: color + BORDER_ALPHA }}
    >
      <Text className="text-caption font-body-semibold" style={{ color }}>
        {INDICATOR_STATUS_LABELS[status]}
      </Text>
    </Badge>
  );
}

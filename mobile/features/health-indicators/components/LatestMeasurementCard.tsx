// features/health-indicators/components/LatestMeasurementCard.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { HEALTH_INDICATORS_LABELS, INDICATOR_EVOLUTION_LABELS } from '@/constants/labels';
import type { IndicatorEvaluation } from '../domain/indicator-range';
import { formatMeasurementDate, formatMeasurementTime } from '../domain/measurement-format';
import { IndicatorStatusBadge } from './IndicatorStatusBadge';

type LatestMeasurementCardProps = {
  value: string;
  unit: string;
  /** ISO de la medición */
  measuredAt: string;
  /** null si el tipo no tiene rango de referencia (ej. peso) */
  evaluation: IndicatorEvaluation | null;
};

export function LatestMeasurementCard({
  value,
  unit,
  measuredAt,
  evaluation,
}: LatestMeasurementCardProps) {
  return (
    <View className="bg-primary/5 border-primary/20 gap-2 rounded-3xl border p-5 shadow-lg shadow-black/5">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-caption font-body-semibold text-muted-foreground uppercase">
          {INDICATOR_EVOLUTION_LABELS.latestTitle}
        </Text>
        <Text className="text-caption font-body text-muted-foreground">
          {formatMeasurementDate(measuredAt)} · {formatMeasurementTime(measuredAt)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-h3 font-heading text-foreground shrink">
          {value} {unit}
        </Text>
        {evaluation && <IndicatorStatusBadge status={evaluation.status} />}
      </View>

      <Text className="text-small font-body text-muted-foreground">
        {evaluation
          ? INDICATOR_EVOLUTION_LABELS.statusDescriptions[evaluation.status]
          : HEALTH_INDICATORS_LABELS.noReferenceRange}
      </Text>
    </View>
  );
}

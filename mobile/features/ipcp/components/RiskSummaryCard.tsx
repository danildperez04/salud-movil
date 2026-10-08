// features/ipcp/components/RiskSummaryCard.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ToneBadge } from '@/components/ui/tone-badge';
import { IPCP_LABELS } from '@/constants/labels';
import { formatDayMonth, formatTime12h } from '@/lib/date-format';
import type { IpcpResult } from '../api/mock-ipcp';
import { LEVEL_VISUALS, withAlpha } from './ipcp-visuals';
import { RiskGauge } from './RiskGauge';

const labels = IPCP_LABELS.result;

type RiskSummaryCardProps = {
  result: IpcpResult;
};

/** Medidor con el puntaje, el nivel de riesgo y su resumen. */
export function RiskSummaryCard({ result }: RiskSummaryCardProps) {
  const { color, icon } = LEVEL_VISUALS[result.level];
  const content = labels.levels[result.level];
  const takenAt = new Date(result.takenAt);

  return (
    <View
      className="bg-card gap-4 rounded-3xl border p-5 shadow-lg shadow-black/5"
      style={{ borderColor: withAlpha(color, '33') }}
    >
      <View className="flex-row items-center gap-4">
        <RiskGauge
          score={result.score}
          color={color}
          accessibilityLabel={labels.scoreA11y(result.score, content.badge)}
        />

        <View className="flex-1 gap-2">
          <Text role="heading" className="text-body font-heading-semibold text-foreground">
            {labels.riskTitle}
          </Text>
          <View className="self-start">
            <ToneBadge label={content.badge} color={color} icon={icon} />
          </View>
          <Text className="text-small font-body text-muted-foreground">{content.summary}</Text>
        </View>
      </View>

      <View className="border-border border-t pt-3">
        <Text className="text-caption font-body text-muted-foreground text-center">
          {labels.takenAt(formatDayMonth(takenAt), formatTime12h(takenAt))}
        </Text>
      </View>
    </View>
  );
}

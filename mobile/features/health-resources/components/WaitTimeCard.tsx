// features/health-resources/components/WaitTimeCard.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ToneBadge } from '@/components/ui/tone-badge';
import { WAIT_TIMES_LABELS } from '@/constants/labels';
import type { HealthResource } from '../api/mock-health-resources';
import { describeWait, getWaitTier } from '../domain/resource-format';
import { WAIT_TIER_COLORS } from './resource-visuals';

// sufijo hex de opacidad: 1A ≈ 10 %
const TILE_ALPHA = '1A';

export function WaitTimeCard({ resource }: { resource: HealthResource }) {
  const minutes = resource.waitMinutes ?? 0;
  const tier = getWaitTier(minutes);
  const color = WAIT_TIER_COLORS[tier];

  return (
    <View
      accessible
      accessibilityLabel={WAIT_TIMES_LABELS.waitA11y(resource.name, minutes)}
      className="bg-card border-border flex-row items-center gap-4 rounded-3xl border p-4 shadow-lg shadow-black/5"
    >
      <View
        className="h-20 w-20 items-center justify-center rounded-2xl"
        style={{ backgroundColor: color + TILE_ALPHA }}
      >
        <Text className="text-h3 font-heading" style={{ color }}>
          {minutes}
        </Text>
        <Text className="text-caption font-body-semibold" style={{ color }}>
          {WAIT_TIMES_LABELS.minutes}
        </Text>
      </View>

      <View className="flex-1 gap-1">
        <Text className="text-body font-heading-semibold text-foreground">{resource.name}</Text>
        <Text className="text-small font-body text-muted-foreground">{describeWait(resource)}</Text>
      </View>

      <ToneBadge label={WAIT_TIMES_LABELS.tiers[tier].label} color={color} />
    </View>
  );
}

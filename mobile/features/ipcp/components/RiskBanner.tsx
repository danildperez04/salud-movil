// features/ipcp/components/RiskBanner.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { IPCP_LABELS } from '@/constants/labels';
import type { ReadyIpcpReport } from '../api/mock-ipcp';
import { LEVEL_VISUALS, withAlpha } from './ipcp-visuals';

const labels = IPCP_LABELS.result;

type RiskBannerProps = {
  result: ReadyIpcpReport;
};

/** Aviso con el color del nivel: qué hacer ahora según el riesgo. */
export function RiskBanner({ result }: RiskBannerProps) {
  const { color, icon: Icon } = LEVEL_VISUALS[result.level];
  const content = labels.levels[result.level];

  return (
    <View
      accessibilityRole="alert"
      className="flex-row items-start gap-4 rounded-3xl border p-5"
      style={{ backgroundColor: withAlpha(color, '1A'), borderColor: withAlpha(color, '33') }}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: withAlpha(color, '1A') }}
      >
        <Icon size={22} color={color} />
      </View>

      <View className="flex-1 gap-1">
        <Text className="text-body font-heading-semibold" style={{ color }}>
          {content.bannerTitle}
        </Text>
        <Text className="text-small font-body-medium" style={{ color }}>
          {content.bannerText}
          {result.alertSent ? ` ${labels.alertSent}` : ''}
        </Text>
      </View>
    </View>
  );
}

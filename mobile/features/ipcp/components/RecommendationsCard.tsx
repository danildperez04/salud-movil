// features/ipcp/components/RecommendationsCard.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { IPCP_LABELS } from '@/constants/labels';
import { colors } from '@/lib/tokens';
import { RECOMMENDATION_ICONS } from './ipcp-visuals';

type RecommendationsCardProps = {
  recommendations: readonly string[];
};

/** Lista de recomendaciones, cada una con su ícono. */
export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  return (
    <View className="bg-card border-border gap-4 rounded-3xl border p-5 shadow-lg shadow-black/5">
      <Text role="heading" className="text-body font-heading-semibold text-foreground">
        {IPCP_LABELS.result.recommendationsTitle}
      </Text>

      <View className="gap-3">
        {recommendations.map((text, index) => {
          const Icon = RECOMMENDATION_ICONS[index % RECOMMENDATION_ICONS.length];
          return (
            <View
              key={text}
              className="bg-background border-border flex-row items-center gap-4 rounded-2xl border p-3"
            >
              <View className="bg-primary/10 h-11 w-11 items-center justify-center rounded-full">
                <Icon size={20} color={colors.brandGreen} />
              </View>
              <Text className="text-small font-body-medium text-foreground flex-1">{text}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

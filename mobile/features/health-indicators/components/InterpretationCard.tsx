// features/health-indicators/components/InterpretationCard.tsx
import { Info } from 'lucide-react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { INDICATOR_EVOLUTION_LABELS } from '@/constants/labels';
import { colors } from '@/lib/tokens';

export function InterpretationCard({ message }: { message: string }) {
  return (
    <View className="bg-secondary-steel/5 border-secondary-steel/20 flex-row items-start gap-4 rounded-3xl border p-5">
      <View className="bg-secondary-steel/10 h-12 w-12 items-center justify-center rounded-full">
        <Info size={22} color={colors.secondarySteel} />
      </View>

      <View className="flex-1 gap-1">
        <Text className="text-body font-heading-semibold text-foreground">
          {INDICATOR_EVOLUTION_LABELS.interpretationTitle}
        </Text>
        <Text className="text-small font-body text-muted-foreground">{message}</Text>
      </View>
    </View>
  );
}

// features/medications/components/MedicationTipCard.tsx
import { Calendar } from '@/lib/icons';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { MEDICATIONS_LABELS } from '@/constants/labels';

export function MedicationTipCard() {
  return (
    <View className="bg-card border-border flex-row items-center gap-4 rounded-3xl border p-5">
      <View className="bg-muted/60 h-14 w-14 items-center justify-center rounded-full">
        <Calendar size={24} color="#2DB79A" />
      </View>

      <View className="flex-1 gap-1">
        <Text className="text-body font-heading-semibold text-foreground">
          {MEDICATIONS_LABELS.tipTitle}
        </Text>
        <Text className="text-small font-body text-muted-foreground">
          {MEDICATIONS_LABELS.tipSubtitle}
        </Text>
      </View>
    </View>
  );
}

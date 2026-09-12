// features/reminders/components/ReminderCard.tsx
import { Bell, ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { FREQUENCY_LABELS } from '@/constants/labels';

type ReminderCardProps = {
  title: string;
  time: string;
  /** valor tal cual viene de cat_frequency.name (ej "Daily") */
  frequency: string;
  onPress?: () => void;
};

export function ReminderCard({ title, time, frequency, onPress }: ReminderCardProps) {
  const frequencyLabel = FREQUENCY_LABELS[frequency] ?? frequency;

  return (
    <Pressable
      onPress={onPress}
      className="bg-muted/40 flex-row items-center gap-4 rounded-2xl p-4 active:opacity-80"
    >
      <View className="bg-background h-11 w-11 items-center justify-center rounded-full">
        <Bell size={20} color="#2DB79A" />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-body font-heading-medium text-foreground">{title}</Text>
        <Text className="text-small font-body text-muted-foreground">
          {time} - {frequencyLabel}
        </Text>
      </View>

      <ChevronRight size={18} color="#6B7280" />
    </Pressable>
  );
}

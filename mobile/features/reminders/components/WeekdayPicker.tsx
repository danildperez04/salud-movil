// features/reminders/components/WeekdayPicker.tsx
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { REMINDERS_LABELS } from '@/constants/labels';
import { cn } from '@/lib/utils';

type WeekdayPickerProps = {
  /** índices 0-6 con el lunes en 0 */
  selected: number[];
  onToggle: (day: number) => void;
};

/** Siete botones L-D para elegir los días del recordatorio. */
export function WeekdayPicker({ selected, onToggle }: WeekdayPickerProps) {
  return (
    <View className="flex-row gap-2">
      {REMINDERS_LABELS.weekdays.map((day, index) => {
        const isSelected = selected.includes(index);
        return (
          <Pressable
            key={day.name}
            onPress={() => onToggle(index)}
            accessibilityRole="checkbox"
            accessibilityLabel={day.name}
            accessibilityState={{ checked: isSelected }}
            className={cn(
              'h-12 flex-1 items-center justify-center rounded-xl active:opacity-80',
              isSelected ? 'bg-primary' : 'bg-neutral-medium/50',
            )}
          >
            <Text className="text-small font-body-semibold text-white">{day.short}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

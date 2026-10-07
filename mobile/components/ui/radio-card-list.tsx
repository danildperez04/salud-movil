// components/ui/radio-card-list.tsx
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type RadioOption<T extends string> = { value: T; label: string };

type RadioCardListProps<T extends string> = {
  options: readonly RadioOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
};

/** Lista de tarjetas con un radio a la derecha; la elegida se resalta. */
export function RadioCardList<T extends string>({
  options,
  value,
  onValueChange,
}: RadioCardListProps<T>) {
  return (
    <View accessibilityRole="radiogroup" className="gap-3">
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onValueChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            className={cn(
              'h-14 flex-row items-center justify-between gap-3 rounded-2xl border px-5 active:opacity-80',
              selected ? 'bg-primary/5 border-primary' : 'bg-card border-border',
            )}
          >
            <Text className="text-body font-heading-semibold text-foreground">{option.label}</Text>
            <View
              className={cn(
                'h-6 w-6 items-center justify-center rounded-full border-2',
                selected ? 'border-primary' : 'border-border',
              )}
            >
              {selected && <View className="bg-primary h-3.5 w-3.5 rounded-full" />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

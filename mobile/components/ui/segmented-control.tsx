// components/ui/segmented-control.tsx
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type SegmentedOption<T extends string> = { value: T; label: string };

type SegmentedControlProps<T extends string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
};

/** Selector de una opción entre pocas, a ancho completo (ej. rango de fechas). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View
      accessibilityRole="tablist"
      className={cn('bg-muted/30 flex-row rounded-full p-1.5', className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onValueChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            className={cn(
              'flex-1 items-center rounded-full py-2.5',
              selected && 'bg-background shadow-sm shadow-black/10',
            )}
          >
            <Text
              className={cn(
                'text-small font-body-semibold',
                selected ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

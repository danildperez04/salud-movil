// components/ui/filter-chips.tsx
import { Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type FilterChip<T extends string> = { value: T; label: string };

type FilterChipsProps<T extends string> = {
  options: readonly FilterChip<T>[];
  value: T;
  onValueChange: (value: T) => void;
};

/**
 * Chips de filtro en una fila con desplazamiento horizontal. Ocupa el ancho de
 * la pantalla (compensa el padding de 24px del contenedor).
 */
export function FilterChips<T extends string>({
  options,
  value,
  onValueChange,
}: FilterChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-6 grow-0"
      contentContainerClassName="gap-2 px-6"
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onValueChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className={cn(
              'rounded-full border px-4 py-2.5 active:opacity-80',
              selected ? 'bg-primary border-primary' : 'bg-card border-border',
            )}
          >
            <Text
              className={cn(
                'text-caption font-body-semibold',
                selected ? 'text-primary-foreground' : 'text-muted-foreground',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

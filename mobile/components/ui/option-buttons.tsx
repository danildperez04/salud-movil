// components/ui/option-buttons.tsx
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type OptionTone = 'default' | 'success' | 'danger';

export type OptionButton<T extends string> = {
  value: T;
  label: string;
  /** texto para lectores de pantalla cuando la etiqueta visible es corta (A, A+) */
  accessibilityLabel?: string;
  /** colorea el texto de la opción aunque no esté elegida (ej. Sí en verde, No en rojo) */
  tone?: OptionTone;
};

const TONE_STYLES: Record<
  OptionTone,
  { idleText: string; selectedBox: string; selectedText: string }
> = {
  default: {
    idleText: 'text-foreground',
    selectedBox: 'bg-primary/10 border-primary',
    selectedText: 'text-primary',
  },
  success: {
    idleText: 'text-primary',
    selectedBox: 'bg-primary/10 border-primary',
    selectedText: 'text-primary',
  },
  danger: {
    idleText: 'text-destructive',
    selectedBox: 'bg-destructive/10 border-destructive',
    selectedText: 'text-destructive',
  },
};

type OptionButtonsProps<T extends string> = {
  options: readonly OptionButton<T>[];
  value?: T;
  onValueChange: (value: T) => void;
};

/** Fila de botones de igual ancho para elegir una opción (tamaño de texto, Sí/No…). */
export function OptionButtons<T extends string>({
  options,
  value,
  onValueChange,
}: OptionButtonsProps<T>) {
  return (
    <View accessibilityRole="radiogroup" className="flex-row gap-3">
      {options.map((option) => {
        const selected = option.value === value;
        const tone = TONE_STYLES[option.tone ?? 'default'];

        return (
          <Pressable
            key={option.value}
            onPress={() => onValueChange(option.value)}
            accessibilityRole="radio"
            accessibilityLabel={option.accessibilityLabel ?? option.label}
            accessibilityState={{ selected }}
            className={cn(
              'h-14 flex-1 items-center justify-center rounded-2xl border active:opacity-80',
              selected ? tone.selectedBox : 'bg-card border-border',
            )}
          >
            <Text
              className={cn(
                'text-body font-heading-semibold',
                selected ? tone.selectedText : tone.idleText,
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

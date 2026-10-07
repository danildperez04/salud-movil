// components/ui/form-field.tsx
import { ChevronDown } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Apariencia de campo del Figma: más redondeado y con fondo tenue. Se aplica a Input/Select. */
export const FIELD_CLASS_NAME = 'h-14 rounded-2xl bg-muted/10 px-4 shadow-none';

type FormFieldProps = {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function FormField({ label, error, className, children }: FormFieldProps) {
  return (
    <View className={cn('gap-2', className)}>
      <Label className="font-heading-semibold text-foreground">{label}</Label>
      {children}
      {error && <Text className="text-small text-destructive">{error}</Text>}
    </View>
  );
}

type PickerFieldProps = {
  value: string;
  onPress: () => void;
};

/** Campo que se ve como un select pero abre un picker nativo de fecha/hora. */
export function PickerField({ value, onPress }: PickerFieldProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={cn(
        'border-input flex-row items-center justify-between gap-2 border active:opacity-80',
        FIELD_CLASS_NAME,
      )}
    >
      <Text className="text-body text-foreground">{value}</Text>
      <ChevronDown size={16} color="#2D7F8E" />
    </Pressable>
  );
}

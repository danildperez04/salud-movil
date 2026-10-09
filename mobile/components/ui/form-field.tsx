// components/ui/form-field.tsx
import { ChevronDown, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Apariencia de campo del Figma: más redondeado y con fondo tenue. Se aplica a Input/Select. */
export const FIELD_CLASS_NAME = 'h-14 rounded-2xl bg-muted/10 px-4 shadow-none';

/** Mismo estilo para campos de varias líneas (notas, motivo, detalle). */
export const TEXTAREA_CLASS_NAME = 'bg-muted/10 h-36 rounded-2xl px-4 py-4';

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
  /** vacío -> se muestra `placeholder` */
  value?: string;
  placeholder?: string;
  /** por defecto una flecha hacia abajo */
  icon?: LucideIcon;
  onPress: () => void;
};

/** Campo que se ve como un select pero abre un picker nativo de fecha/hora. */
export function PickerField({ value, placeholder, icon, onPress }: PickerFieldProps) {
  const Icon = icon ?? ChevronDown;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={cn(
        'border-input flex-row items-center justify-between gap-2 border active:opacity-80',
        FIELD_CLASS_NAME,
      )}
    >
      <Text className={cn('text-body', value ? 'text-foreground' : 'text-muted-foreground')}>
        {value || placeholder}
      </Text>
      <Icon size={icon ? 20 : 16} color="#2D7F8E" />
    </Pressable>
  );
}

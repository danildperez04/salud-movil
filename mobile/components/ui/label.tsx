import { cn } from '@/lib/utils';
import * as LabelPrimitive from '@rn-primitives/label';
import { Platform } from 'react-native';

function Label({
  className,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Text>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'flex flex-row items-center gap-2 select-none',
        Platform.select({
          web: 'cursor-default leading-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        }),
        disabled && 'opacity-50',
      )}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <LabelPrimitive.Text
        className={cn(
          // FIX: "text-sm font-medium" era el default de shadcn (sistema
          // sans genérico). Se reemplaza por la tipografía de marca: Inter
          // (font-body-medium) en el tamaño "small" de la escala de marca,
          // que es el usado para labels/captions en el Figma.
          'text-foreground font-body-medium text-small',
          Platform.select({ web: 'leading-none' }),
          className,
        )}
        {...props}
      />
    </LabelPrimitive.Root>
  );
}

export { Label };

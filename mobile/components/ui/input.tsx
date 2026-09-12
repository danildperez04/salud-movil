import { cn } from '@/lib/utils';
import { Platform, TextInput } from 'react-native';

// FIX: el default anterior (h-10, rounded-md, text-base) es el input
// genérico de shadcn/ui. El Figma usa un input más alto (56px / h-14),
// bien redondeado (rounded-xl) y tipografía de marca (Inter / text-body).
// Antes esto se corregía a mano en cada pantalla con overrides de className
// (ver LoginScreen) — ahora el default ya coincide, así no hace falta
// repetir "h-14 rounded-xl px-4" en cada uso.
function Input({
  className,
  placeholderClassName,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        // Sin sombra — el Figma usa solo un stroke fino, no elevación.
        'dark:bg-input/30 border-input bg-background text-foreground font-body text-body flex h-14 w-full min-w-0 flex-row items-center rounded-xl border px-4 py-1 leading-5',
        props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' }),
          ),
        Platform.select({
          web: cn(
            'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground transition-[color,box-shadow] outline-none md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          ),
          native: 'placeholder:text-muted-foreground/50',
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Input };

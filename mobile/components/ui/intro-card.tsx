// components/ui/intro-card.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

type IntroCardProps = {
  title: string;
  description: string;
  /** danger: aviso con tono de alerta (modo emergencia) */
  tone?: 'primary' | 'danger';
};

/**
 * Tarjeta de bienvenida al inicio de un formulario o sección. Es información
 * secundaria, así que no se muestra con el "Modo lectura simple" activo.
 */
export function IntroCard({ title, description, tone = 'primary' }: IntroCardProps) {
  const simpleMode = useAppStore((state) => state.accessibility.simpleMode);
  if (simpleMode) return null;

  return (
    <View
      className={cn(
        'gap-2 rounded-3xl border p-5',
        tone === 'danger'
          ? 'bg-destructive/5 border-destructive/20'
          : 'bg-primary/5 border-primary/20',
      )}
    >
      <Text className="text-body font-heading-semibold text-foreground">{title}</Text>
      <Text className="text-small font-body text-muted-foreground">{description}</Text>
    </View>
  );
}

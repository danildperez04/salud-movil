// components/ui/list-item-card.tsx
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors, statusColors } from '@/lib/tokens';
import { cn } from '@/lib/utils';

type Tone = 'primary' | 'danger' | 'muted';

const TONE_STYLES: Record<Tone, { background: string; icon: string }> = {
  primary: { background: 'bg-primary/10', icon: colors.brandGreen },
  danger: { background: 'bg-destructive/10', icon: statusColors.danger },
  muted: { background: 'bg-muted/60', icon: colors.neutralMedium },
};

type ListItemCardProps = {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  /** forma del recuadro del ícono: círculo (por defecto) o cuadrado redondeado */
  iconShape?: 'circle' | 'square';
  tone?: Tone;
  /** atenúa el título (ej. un recordatorio pausado) */
  muted?: boolean;
  /** contenido a la derecha, antes de la flecha (ej. un badge de estado) */
  trailing?: ReactNode;
  /** línea extra bajo el subtítulo */
  footer?: ReactNode;
  /** con `onPress` la tarjeta es tocable y muestra la flecha */
  onPress?: () => void;
  className?: string;
};

/** Tarjeta de lista: ícono, título, subtítulo y (si es tocable) flecha. */
export function ListItemCard({
  title,
  subtitle,
  icon: Icon,
  iconShape = 'circle',
  tone = 'primary',
  muted = false,
  trailing,
  footer,
  onPress,
  className,
}: ListItemCardProps) {
  const toneStyle = TONE_STYLES[tone];

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      className={cn(
        'bg-card border-border flex-row items-center gap-4 rounded-3xl border p-5 shadow-lg shadow-black/5',
        onPress && 'active:opacity-80',
        className,
      )}
    >
      <View
        className={cn(
          'h-14 w-14 items-center justify-center',
          iconShape === 'circle' ? 'rounded-full' : 'rounded-2xl',
          toneStyle.background,
        )}
      >
        <Icon size={24} color={toneStyle.icon} />
      </View>

      <View className="flex-1 gap-1">
        <Text
          className={cn(
            'text-body font-heading-semibold',
            muted ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {title}
        </Text>
        {subtitle && <Text className="text-small font-body text-muted-foreground">{subtitle}</Text>}
        {footer}
      </View>

      {trailing}
      {onPress && <ChevronRight size={20} color={colors.secondarySteel} />}
    </Pressable>
  );
}

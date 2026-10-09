// components/ui/hero-card.tsx
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

type HeroCardProps = {
  /** ícono o avatar que va arriba, centrado */
  visual: ReactNode;
  title: string;
  subtitle?: string;
};

/** Tarjeta centrada con un elemento visual, un título y un subtítulo (perfil, biometría…). */
export function HeroCard({ visual, title, subtitle }: HeroCardProps) {
  return (
    <View className="bg-primary/5 border-primary/20 items-center gap-3 rounded-3xl border p-6">
      {visual}
      <View className="items-center gap-1">
        <Text className="text-h3 font-heading-semibold text-foreground text-center">{title}</Text>
        {subtitle && (
          <Text className="text-small font-body text-muted-foreground text-center">{subtitle}</Text>
        )}
      </View>
    </View>
  );
}

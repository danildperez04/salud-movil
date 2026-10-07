// components/ui/intro-card.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

type IntroCardProps = {
  title: string;
  description: string;
};

/** Tarjeta de bienvenida al inicio de un formulario o sección. */
export function IntroCard({ title, description }: IntroCardProps) {
  return (
    <View className="bg-primary/5 border-primary/20 gap-2 rounded-3xl border p-5">
      <Text className="text-body font-heading-semibold text-foreground">{title}</Text>
      <Text className="text-small font-body text-muted-foreground">{description}</Text>
    </View>
  );
}

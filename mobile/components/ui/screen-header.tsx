// components/ui/screen-header.tsx
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  /**
   * FIX: el Figma en realidad tiene DOS patrones de header distintos:
   * - 'default' (Top Header Bar del sistema de componentes): botón de
   *   retroceso circular + título en la misma fila. Es el usado en flujos
   *   puntuales como "Agendar Cita". Se deja intacto para no romper esos
   *   usos.
   * - 'large': el usado en pantallas "landing" como "Indicadores de Salud".
   *   Acá el botón de retroceso va SOLO en su propia fila (sin círculo/borde,
   *   ícono simple) y el título va debajo, en un tamaño grande (H2) y con
   *   separación generosa. Antes ScreenHeader solo tenía el patrón inline,
   *   por eso el espacio entre botón y título no coincidía con el Figma.
   */
  size?: 'default' | 'large';
};

export function ScreenHeader({ title, onBack, size = 'default' }: ScreenHeaderProps) {
  const handleBack = onBack ?? (() => router.back());

  if (size === 'large') {
    return (
      <View className="gap-6 px-6 pt-4 pb-2">
        <Pressable
          onPress={handleBack}
          hitSlop={8}
          className="h-9 w-9 items-center justify-center active:opacity-60"
        >
          <ChevronLeft size={24} color="#0E2A3A" />
        </Pressable>
        <Text className="text-h2 font-heading text-foreground">{title}</Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-3 px-6 pt-4 pb-2">
      <Pressable
        onPress={handleBack}
        className="border-border h-9 w-9 items-center justify-center rounded-full border active:opacity-70"
      >
        <ChevronLeft size={18} color="#0E2A3A" />
      </Pressable>
      <Text className="text-h3 font-heading text-foreground">{title}</Text>
    </View>
  );
}

// components/ui/screen-header.tsx
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  size?: 'default' | 'large';
  /** center: flecha a la izquierda y título centrado en la misma fila (ignora size) */
  align?: 'start' | 'center';
};

export function ScreenHeader({
  title,
  onBack,
  size = 'default',
  align = 'start',
}: ScreenHeaderProps) {
  const handleBack = onBack ?? (() => router.back());

  if (align === 'center') {
    return (
      <View className="justify-center py-4">
        {/* La flecha va absoluta para que el título quede centrado en la pantalla,
            no entre la flecha y el borde derecho. */}
        <Pressable
          onPress={handleBack}
          hitSlop={8}
          className="absolute top-4 bottom-4 left-6 z-10 w-9 justify-center active:opacity-60"
        >
          <ChevronLeft size={24} color="#2D7F8E" />
        </Pressable>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          className="text-h3 font-heading text-foreground px-14 text-center"
        >
          {title}
        </Text>
      </View>
    );
  }

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

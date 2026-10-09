// components/ui/screen-header.tsx
import { router } from 'expo-router';
import { ChevronLeft } from '@/lib/icons';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const BACK_ICON_COLOR = '#2D7F8E';
/** Espacio entre el borde seguro (status bar / notch) y el contenido del header */
const TOP_GAP = 16;

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  size?: 'default' | 'large';
  /** center: flecha a la izquierda y título centrado en la misma fila (ignora size) */
  align?: 'start' | 'center';
  /** outlined: flecha dentro de un círculo con borde (solo con align="center") */
  backButton?: 'plain' | 'outlined';
};

type BackButtonProps = {
  onPress: () => void;
  className?: string;
  iconSize?: number;
};

function BackButton({ onPress, className, iconSize = 24 }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Volver"
      className={cn('h-10 w-10 items-center justify-center active:opacity-60', className)}
    >
      <ChevronLeft size={iconSize} color={BACK_ICON_COLOR} />
    </Pressable>
  );
}

export function ScreenHeader({
  title,
  onBack,
  size = 'default',
  align = 'start',
  backButton = 'plain',
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const handleBack = onBack ?? (() => router.back());
  const paddingTop = insets.top + TOP_GAP;

  if (align === 'center') {
    return (
      <View className="justify-center pb-5" style={{ paddingTop }}>
        {/* La flecha va absoluta para que el título quede centrado en la pantalla
            y no entre la flecha y el borde derecho. */}
        {backButton === 'outlined' ? (
          <BackButton
            onPress={handleBack}
            className="border-border bg-background absolute bottom-3 left-6 z-10 rounded-full border"
            iconSize={20}
          />
        ) : (
          <BackButton
            onPress={handleBack}
            className="absolute bottom-4 left-3 z-10"
            iconSize={26}
          />
        )}
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          className="text-h3 font-heading text-foreground px-16 text-center"
        >
          {title}
        </Text>
      </View>
    );
  }

  if (size === 'large') {
    return (
      <View className="gap-6 px-6 pb-2" style={{ paddingTop }}>
        <BackButton onPress={handleBack} className="-ml-2" />
        <Text className="text-h2 font-heading text-foreground">{title}</Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-3 px-6 pb-2" style={{ paddingTop }}>
      <Pressable
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        className="border-border h-9 w-9 items-center justify-center rounded-full border active:opacity-70"
      >
        <ChevronLeft size={18} color="#0E2A3A" />
      </Pressable>
      <Text className="text-h3 font-heading text-foreground">{title}</Text>
    </View>
  );
}

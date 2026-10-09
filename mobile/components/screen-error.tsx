// components/screen-error.tsx
import { View } from 'react-native';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { FooterButton } from '@/components/ui/footer-button';
import { COMMON_LABELS } from '@/constants/labels';
import { TriangleAlert } from '@/lib/icons';

/**
 * Pantalla de último recurso cuando algo falla al dibujar una pantalla. Reemplaza a la de
 * Expo Router, que está en inglés y muestra el texto del error. Nunca recibe ni muestra el error.
 */
export function ScreenError({ onRetry }: { onRetry: () => void }) {
  const { title, description } = COMMON_LABELS.errors.screenCrash;

  return (
    <View className="bg-background flex-1 justify-center">
      <View className="px-6" role="alert">
        <EmptyStateCard
          icon={TriangleAlert}
          tone="danger"
          title={title}
          description={description}
        />
      </View>
      <FooterButton label={COMMON_LABELS.retry} onPress={onRetry} />
    </View>
  );
}

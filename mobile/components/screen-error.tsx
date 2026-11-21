// components/screen-error.tsx
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { FooterButton } from '@/components/ui/footer-button';
import { TriangleAlert } from '@/lib/icons';

/**
 * Pantalla de último recurso cuando algo falla al dibujar una pantalla. Reemplaza a la de
 * Expo Router, que está en inglés y muestra el texto del error. Nunca recibe ni muestra el error.
 */
export function ScreenError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();

  return (
    <View className="bg-background flex-1 justify-center">
      <View className="px-6" role="alert">
        <EmptyStateCard
          icon={TriangleAlert}
          tone="danger"
          title={t('errors.screenCrash.title')}
          description={t('errors.screenCrash.description')}
        />
      </View>
      <FooterButton label={t('retry')} onPress={onRetry} />
    </View>
  );
}

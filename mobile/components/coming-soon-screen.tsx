// components/coming-soon-screen.tsx
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Construction } from '@/lib/icons';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { colors } from '@/lib/tokens';

/**
 * Pantalla provisional para rutas que ya existen en la navegación pero todavía
 * no tienen diseño implementado. Reemplazar el `export default` del archivo en
 * `app/` por la pantalla real cuando exista (ver el comentario de cada ruta).
 */
function ComingSoonScreen({ title }: { title: string }) {
  const { t } = useTranslation();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={title} align="center" />

      <View className="flex-1 items-center justify-center gap-4 px-10 pb-24">
        <View className="bg-primary/10 h-20 w-20 items-center justify-center rounded-full">
          <Construction size={34} color={colors.brandGreen} />
        </View>
        <Text className="text-body font-heading-semibold text-foreground text-center">
          {t('comingSoonTitle')}
        </Text>
        <Text className="text-small font-body text-muted-foreground text-center">
          {t('comingSoonDescription')}
        </Text>
        <Button variant="outline" className="mt-2 px-8" onPress={() => router.back()}>
          <Text className="text-body font-heading-semibold">{t('back')}</Text>
        </Button>
      </View>
    </View>
  );
}

/** Crea el componente de una ruta provisional con el título indicado. */
export function createComingSoonScreen(title: string) {
  function PlaceholderScreen() {
    return <ComingSoonScreen title={title} />;
  }
  PlaceholderScreen.displayName = `ComingSoon(${title})`;
  return PlaceholderScreen;
}

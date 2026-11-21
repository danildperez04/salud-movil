// features/accessibility/screens/AccessibilityScreen.tsx
import { useTranslation } from 'react-i18next';
import { Volume2 } from '@/lib/icons';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { OptionButtons, type OptionButton } from '@/components/ui/option-buttons';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { SwitchRowsCard } from '@/components/ui/switch-rows-card';
import { Text } from '@/components/ui/text';
import { colors } from '@/lib/tokens';
import type { TextSize } from '@/types/preferences';
import { useAccessibilitySettings } from '../hooks/useAccessibilitySettings';

const TEXT_SIZES: TextSize[] = ['normal', 'large', 'xlarge'];

export default function AccessibilityScreen() {
  const { t } = useTranslation(['accessibility', 'navigation']);
  const { textSize, setTextSize, rows, testReading, reset } = useAccessibilitySettings();

  const textSizeOptions: OptionButton<TextSize>[] = TEXT_SIZES.map((value) => ({
    value,
    label: t(`textSizes.${value}`),
    accessibilityLabel: t(`textSizeDescriptions.${value}`),
  }));

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={t('navigation:screens.accessibility')} align="center" />

      <ScrollView contentContainerClassName="gap-6 px-6 pt-2 pb-10">
        <View className="gap-3">
          <SectionHeader title={t('textSizeTitle')} />
          <OptionButtons options={textSizeOptions} value={textSize} onValueChange={setTextSize} />
        </View>

        <SwitchRowsCard rows={rows} />

        <View className="gap-2">
          <Button variant="outline" size="lg" className="border-primary" onPress={testReading}>
            <Volume2 size={20} color={colors.brandGreen} />
            <Text className="text-body font-heading-semibold text-primary">{t('testReading')}</Text>
          </Button>

          {/* salida de emergencia: un tamaño de texto o contraste mal elegido no debe atrapar al usuario */}
          <Button variant="ghost" onPress={reset}>
            <Text className="text-small font-body-semibold text-muted-foreground">
              {t('reset')}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

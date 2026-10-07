// features/accessibility/screens/AccessibilityScreen.tsx
import { Volume2 } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { OptionButtons, type OptionButton } from '@/components/ui/option-buttons';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { SwitchRowsCard } from '@/components/ui/switch-rows-card';
import { Text } from '@/components/ui/text';
import { ACCESSIBILITY_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { colors } from '@/lib/tokens';
import type { TextSize } from '@/types/preferences';
import { useAccessibilitySettings } from '../hooks/useAccessibilitySettings';

const labels = ACCESSIBILITY_LABELS;

const TEXT_SIZE_OPTIONS: OptionButton<TextSize>[] = (
  Object.keys(labels.textSizes) as TextSize[]
).map((value) => ({
  value,
  label: labels.textSizes[value],
  accessibilityLabel: labels.textSizeDescriptions[value],
}));

export default function AccessibilityScreen() {
  const { textSize, setTextSize, rows, testReading, reset } = useAccessibilitySettings();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.accessibility} align="center" />

      <ScrollView contentContainerClassName="gap-6 px-6 pt-2 pb-10">
        <View className="gap-3">
          <SectionHeader title={labels.textSizeTitle} />
          <OptionButtons options={TEXT_SIZE_OPTIONS} value={textSize} onValueChange={setTextSize} />
        </View>

        <SwitchRowsCard rows={rows} />

        <View className="gap-2">
          <Button variant="outline" size="lg" className="border-primary" onPress={testReading}>
            <Volume2 size={20} color={colors.brandGreen} />
            <Text className="text-body font-heading-semibold text-primary">
              {labels.testReading}
            </Text>
          </Button>

          {/* salida de emergencia: un tamaño de texto o contraste mal elegido no debe atrapar al usuario */}
          <Button variant="ghost" onPress={reset}>
            <Text className="text-small font-body-semibold text-muted-foreground">
              {labels.reset}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

// features/language/screens/LanguageScreen.tsx
import { ScrollView, View } from 'react-native';
import { FooterButton } from '@/components/ui/footer-button';
import { IntroCard } from '@/components/ui/intro-card';
import { RadioCardList } from '@/components/ui/radio-card-list';
import { ScreenHeader } from '@/components/ui/screen-header';
import { LANGUAGE_SCREEN_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { useLanguageSettings } from '../hooks/useLanguageSettings';

const labels = LANGUAGE_SCREEN_LABELS;

export default function LanguageScreen() {
  const { options, selected, select, save } = useLanguageSettings();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.language} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-6">
        <IntroCard title={labels.introTitle} description={labels.introDescription} />
        <RadioCardList options={options} value={selected} onValueChange={select} />
      </ScrollView>

      <FooterButton label={labels.save} onPress={save} />
    </View>
  );
}

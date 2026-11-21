// features/language/screens/LanguageScreen.tsx
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { FooterButton } from '@/components/ui/footer-button';
import { IntroCard } from '@/components/ui/intro-card';
import { RadioCardList } from '@/components/ui/radio-card-list';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useLanguageSettings } from '../hooks/useLanguageSettings';

export default function LanguageScreen() {
  const { t } = useTranslation(['language', 'navigation']);
  const { options, selected, select, save } = useLanguageSettings();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={t('navigation:screens.language')} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-6">
        <IntroCard title={t('introTitle')} description={t('introDescription')} />
        <RadioCardList options={options} value={selected} onValueChange={select} />
      </ScrollView>

      <FooterButton label={t('save')} onPress={save} />
    </View>
  );
}

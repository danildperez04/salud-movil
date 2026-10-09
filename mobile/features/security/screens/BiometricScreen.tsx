// features/security/screens/BiometricScreen.tsx
import { ShieldCheck } from '@/lib/icons';
import { ScrollView, View } from 'react-native';
import { FooterButton } from '@/components/ui/footer-button';
import { HeroCard } from '@/components/ui/hero-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SwitchRowsCard } from '@/components/ui/switch-rows-card';
import { SCREEN_TITLES, SECURITY_LABELS } from '@/constants/labels';
import { colors } from '@/lib/tokens';
import { useBiometricSettings } from '../hooks/useBiometricSettings';

const labels = SECURITY_LABELS.biometric;

export default function BiometricScreen() {
  const { rows, save } = useBiometricSettings();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.biometric} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-6">
        <HeroCard
          visual={
            <View className="bg-primary/15 h-20 w-20 items-center justify-center rounded-full">
              <ShieldCheck size={36} color={colors.brandGreen} />
            </View>
          }
          title={labels.heroTitle}
          subtitle={labels.heroSubtitle}
        />
        <SwitchRowsCard rows={rows} />
      </ScrollView>

      <FooterButton label={labels.save} onPress={save} />
    </View>
  );
}

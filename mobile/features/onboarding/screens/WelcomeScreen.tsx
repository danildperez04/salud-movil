// features/onboarding/screens/WelcomeScreen.tsx
import { router } from 'expo-router';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { LOGIN_LABELS, ONBOARDING_LABELS } from '@/constants/labels';
import { useAppStore } from '@/store';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const markOnboardingSeen = useAppStore((state) => state.markOnboardingSeen);

  const handleContinue = () => {
    markOnboardingSeen();
    router.replace('/(auth)/login');
  };

  return (
    <View
      className="bg-background flex-1"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
    >
      {/* TOP */}
      <View className="items-center gap-2 px-6">
        <Text className="font-heading text-foreground text-center text-[40px] leading-12">
          Salud <Text className="font-heading text-primary text-[40px] leading-12">Móvil</Text>
        </Text>
        <Text className="font-body-medium text-primary text-center text-[16px]">
          {LOGIN_LABELS.tagline}
        </Text>
      </View>

      {/* ILUSTRACIÓN — ocupa el espacio del medio */}
      <View className="flex-1 items-center justify-center">
        <Image
          source={require('@/assets/welcome-illustration.png')}
          style={{ width: '100%', height: '100%', maxHeight: 420 }}
          resizeMode="contain"
          accessibilityLabel=""
        />
      </View>

      {/* BOTTOM */}
      <View className="items-center gap-5 px-6">
        <View className="items-center gap-3">
          <Text className="font-heading text-foreground text-center text-[24px] leading-8.5">
            {ONBOARDING_LABELS.welcomePrefix}{' '}
            <Text className="font-heading text-foreground text-[24px] leading-8.5">SALUD</Text>{' '}
            <Text className="font-heading text-primary text-[24px] leading-8.5">MÓVIL</Text>
          </Text>

          <Text className="font-body-semibold text-primary px-2 text-center text-[14px] leading-6">
            {ONBOARDING_LABELS.description}
          </Text>
        </View>

        <Button size="lg" onPress={handleContinue} className="h-14 w-full rounded-2xl">
          <Text className="font-body-semibold text-primary-foreground text-[20px]">
            {ONBOARDING_LABELS.cta}
          </Text>
        </Button>
      </View>
    </View>
  );
}

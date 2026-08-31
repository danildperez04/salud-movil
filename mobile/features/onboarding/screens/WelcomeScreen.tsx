// features/onboarding/screens/WelcomeScreen.tsx
import { router } from 'expo-router';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ONBOARDING_LABELS } from '@/constants/labels';
import { useAppStore } from '@/store';

// TODO: reemplazar layout con el diseño real de Figma cuando esté disponible
export default function WelcomeScreen() {
  const markOnboardingSeen = useAppStore((state) => state.markOnboardingSeen);

  const handleContinue = () => {
    markOnboardingSeen();
    router.replace('/(auth)/login');
  };

  return (
    <View className="bg-background flex-1 items-center justify-center gap-6 px-6">
      <Text className="text-h1 font-heading text-foreground">{ONBOARDING_LABELS.brand}</Text>
      <Text className="text-body font-body text-muted-foreground text-center">
        {ONBOARDING_LABELS.description}
      </Text>
      <Button onPress={handleContinue} className="mt-4">
        <Text>{ONBOARDING_LABELS.cta}</Text>
      </Button>
    </View>
  );
}

// features/onboarding/screens/WelcomeScreen.tsx
import { router } from 'expo-router';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppStore } from '@/store';

// Placeholder — reemplazar con el diseño real de Figma cuando esté a mano.
export default function WelcomeScreen() {
  const markOnboardingSeen = useAppStore((state) => state.markOnboardingSeen);

  const handleContinue = () => {
    markOnboardingSeen();
    router.replace('/(auth)/login');
  };

  return (
    <View className="bg-background flex-1 items-center justify-center gap-6 px-6">
      <Text className="text-h1 font-heading text-foreground">Salud Móvil</Text>
      <Text className="text-body font-body text-muted-foreground text-center">
        Seguimiento de pacientes, indicadores de salud y recordatorios de medicamentos
      </Text>
      <Button onPress={handleContinue} className="mt-4">
        <Text>Comenzar</Text>
      </Button>
    </View>
  );
}

// features/appointments/screens/AppointmentsScreen.tsx
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SCREEN_TITLES } from '@/constants/labels';

// TODO: conectar a GET /appointments cuando el backend lo exponga
// (según el README, este módulo todavía no tiene controlador/servicio)
export default function AppointmentsScreen() {
  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-4 p-6">
      <Text className="text-h1 font-heading text-foreground">{SCREEN_TITLES.appointments}</Text>
      <View className="items-center justify-center py-12">
        <Text className="text-body text-muted-foreground">
          Pantalla en construcción — pendiente de endpoint del backend
        </Text>
      </View>
    </ScrollView>
  );
}

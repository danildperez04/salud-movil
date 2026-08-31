// features/medications/screens/MedicationsScreen.tsx
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SCREEN_TITLES } from '@/constants/labels';

// TODO: conectar a endpoint de medicamentos cuando exista en el backend
export default function MedicationsScreen() {
  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-4 p-6">
      <Text className="text-h1 font-heading text-foreground">{SCREEN_TITLES.medications}</Text>
      <View className="items-center justify-center py-12">
        <Text className="text-body text-muted-foreground">
          Pantalla en construcción — pendiente de endpoint del backend
        </Text>
      </View>
    </ScrollView>
  );
}

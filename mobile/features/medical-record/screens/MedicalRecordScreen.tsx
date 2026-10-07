// features/medical-record/screens/MedicalRecordScreen.tsx
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { ListItemCard } from '@/components/ui/list-item-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SCREEN_TITLES } from '@/constants/labels';
import { MENU_VISUALS } from '../components/record-visuals';
import { useMedicalRecordMenu } from '../hooks/useMedicalRecordMenu';

export default function MedicalRecordScreen() {
  const menu = useMedicalRecordMenu();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.medicalRecord} align="center" />

      <ScrollView contentContainerClassName="gap-4 px-6 pt-2 pb-10">
        {menu.map((item) => (
          <ListItemCard
            key={item.id}
            icon={MENU_VISUALS[item.id].icon}
            tone={MENU_VISUALS[item.id].tone}
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => router.push(item.href)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

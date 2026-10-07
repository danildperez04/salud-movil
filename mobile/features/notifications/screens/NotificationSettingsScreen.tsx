// features/notifications/screens/NotificationSettingsScreen.tsx
import { ScrollView, View } from 'react-native';
import { FooterButton } from '@/components/ui/footer-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SwitchRowsCard } from '@/components/ui/switch-rows-card';
import { NOTIFICATION_SETTINGS_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { useNotificationSettings } from '../hooks/useNotificationSettings';

export default function NotificationSettingsScreen() {
  const { rows, save } = useNotificationSettings();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.notificationSettings} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-6">
        <SwitchRowsCard rows={rows} />
      </ScrollView>

      <FooterButton label={NOTIFICATION_SETTINGS_LABELS.save} onPress={save} />
    </View>
  );
}

// features/more/screens/MoreScreen.tsx
import { router } from 'expo-router';
import { LogOut } from '@/lib/icons';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { MORE_LABELS, ROLE_LABELS } from '@/constants/labels';
import { useAppStore } from '@/store';
import { IpcpCard } from '../components/IpcpCard';
import { MenuSection } from '../components/MenuSection';
import { ProfileCard } from '../components/ProfileCard';
import { MENU_SECTIONS } from '../domain/menu-sections';

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const profileSubtitle = [user && ROLE_LABELS[user.role], user?.email].filter(Boolean).join(' · ');

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerClassName="gap-7 px-6 pb-12"
      contentContainerStyle={{ paddingTop: insets.top + 16 }}
    >
      <Text className="text-h2 font-heading text-foreground text-center">{MORE_LABELS.title}</Text>

      <View className="gap-4">
        <ProfileCard
          name={user?.name ?? MORE_LABELS.fallbackName}
          subtitle={profileSubtitle}
          onPress={() => router.push('/(app)/profile')}
        />
        <IpcpCard />
      </View>

      {MENU_SECTIONS.map((section) => (
        <MenuSection key={section.id} section={section} />
      ))}

      <Pressable
        onPress={() => logout()}
        accessibilityRole="button"
        className="border-destructive/40 flex-row items-center justify-center gap-3 rounded-2xl border py-4 active:opacity-70"
      >
        <LogOut size={20} color="#DC2626" />
        <Text className="text-body font-heading-semibold text-destructive">
          {MORE_LABELS.logout}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

// features/profile/screens/ProfileScreen.tsx
import { LogOut } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { HeroCard } from '@/components/ui/hero-card';
import { InfoTileGrid } from '@/components/ui/info-tile';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Text } from '@/components/ui/text';
import { MORE_LABELS, PROFILE_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { statusColors } from '@/lib/tokens';
import { useAccountProfile } from '../hooks/useAccountProfile';

export default function ProfileScreen() {
  const { name, initials, subtitle, tiles, logout } = useAccountProfile();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.profile} align="center" />

      <ScrollView contentContainerClassName="gap-6 px-6 pt-2 pb-10">
        <HeroCard
          visual={
            <View className="bg-primary/15 h-20 w-20 items-center justify-center rounded-full">
              <Text className="text-h3 font-heading text-primary">{initials}</Text>
            </View>
          }
          title={name}
          subtitle={subtitle}
        />

        <View className="gap-3">
          <SectionHeader title={PROFILE_LABELS.sectionTitle} />
          <InfoTileGrid tiles={tiles} />
        </View>

        <Button variant="outline" size="lg" className="border-destructive/50" onPress={logout}>
          <LogOut size={20} color={statusColors.danger} />
          <Text className="text-body font-heading-semibold text-destructive">
            {MORE_LABELS.logout}
          </Text>
        </Button>
      </ScrollView>
    </View>
  );
}

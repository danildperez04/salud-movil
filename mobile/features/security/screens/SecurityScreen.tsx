// features/security/screens/SecurityScreen.tsx
import { router, type Href } from 'expo-router';
import { FingerprintPattern, Lock, Smartphone, type LucideIcon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { ListItemCard } from '@/components/ui/list-item-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SCREEN_TITLES, SECURITY_LABELS } from '@/constants/labels';
import { securityRoutes } from '../routes';

const { menu } = SECURITY_LABELS;

const ITEMS: { id: string; icon: LucideIcon; title: string; subtitle: string; href: Href }[] = [
  { id: 'password', icon: Lock, ...menu.password, href: securityRoutes.password },
  { id: 'biometric', icon: FingerprintPattern, ...menu.biometric, href: securityRoutes.biometric },
  { id: 'devices', icon: Smartphone, ...menu.devices, href: securityRoutes.devices },
];

export default function SecurityScreen() {
  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.security} align="center" />

      <ScrollView contentContainerClassName="gap-4 px-6 pt-2 pb-10">
        {ITEMS.map(({ id, icon, title, subtitle, href }) => (
          <ListItemCard
            key={id}
            icon={icon}
            title={title}
            subtitle={subtitle}
            onPress={() => router.push(href)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

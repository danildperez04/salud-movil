// features/help/screens/HelpScreen.tsx
import { router, type Href } from 'expo-router';
import {
  CircleQuestionMark,
  MessageCircle,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { ListItemCard } from '@/components/ui/list-item-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { HELP_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { helpRoutes } from '../routes';

const { menu } = HELP_LABELS;

const ITEMS: { id: string; icon: LucideIcon; title: string; subtitle: string; href: Href }[] = [
  { id: 'faq', icon: CircleQuestionMark, ...menu.faq, href: helpRoutes.faq },
  { id: 'chat', icon: MessageCircle, ...menu.chat, href: helpRoutes.chat },
  { id: 'report', icon: TriangleAlert, ...menu.report, href: helpRoutes.report },
];

export default function HelpScreen() {
  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.help} align="center" />

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

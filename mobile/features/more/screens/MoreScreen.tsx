// features/more/screens/MoreScreen.tsx
import { router } from 'expo-router';
import { Bell, ChevronRight, FileText, LogOut } from 'lucide-react-native';
import { Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { SCREEN_TITLES, TAB_LABELS } from '@/constants/labels';
import { useAppStore } from '@/store';

const MENU_ITEMS = [
  { icon: Bell, label: SCREEN_TITLES.reminders, href: '/(app)/reminders' as const },
  { icon: FileText, label: SCREEN_TITLES.medicalRecord, href: '/(app)/medical-record' as const },
];

export default function MoreScreen() {
  const logout = useAppStore((state) => state.logout);

  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-3 p-6">
      <Text className="text-h1 font-heading text-foreground">{TAB_LABELS.more}</Text>

      {MENU_ITEMS.map((item) => (
        <Pressable
          key={item.href}
          onPress={() => router.push(item.href)}
          className="bg-muted/40 flex-row items-center gap-4 rounded-2xl p-4 active:opacity-80"
        >
          <item.icon size={20} color="#2DB79A" />
          <Text className="text-body font-heading-medium text-foreground flex-1">{item.label}</Text>
          <ChevronRight size={18} color="#6B7280" />
        </Pressable>
      ))}

      <Pressable
        onPress={logout}
        className="bg-destructive/10 mt-4 flex-row items-center gap-4 rounded-2xl p-4 active:opacity-80"
      >
        <LogOut size={20} color="#DC2626" />
        <Text className="text-body font-heading-medium text-destructive">Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

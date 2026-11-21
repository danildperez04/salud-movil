// components/ui/notice-card.tsx
import { Info, type LucideIcon } from '@/lib/icons';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/lib/tokens';

type NoticeCardProps = {
  title: string;
  message: string;
  icon?: LucideIcon;
};

/** Aviso informativo con ícono (interpretaciones, notas importantes). */
export function NoticeCard({ title, message, icon: Icon = Info }: NoticeCardProps) {
  return (
    <View className="bg-secondary-steel/5 border-secondary-steel/20 flex-row items-start gap-4 rounded-3xl border p-5">
      <View className="bg-secondary-steel/10 h-12 w-12 items-center justify-center rounded-full">
        <Icon size={22} color={colors.secondarySteel} />
      </View>

      <View className="flex-1 gap-1">
        <Text className="text-body font-heading-semibold text-foreground">{title}</Text>
        <Text className="text-small font-body text-muted-foreground">{message}</Text>
      </View>
    </View>
  );
}

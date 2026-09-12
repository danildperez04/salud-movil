// features/home/components/QuickActionCard.tsx
import { ArrowUpRight, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';

type QuickActionCardProps = {
  icon: LucideIcon;
  title: number | string;
  subtitle: string;
  onPress: () => void;
};

export function QuickActionCard({ icon: Icon, title, subtitle, onPress }: QuickActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-accent/20 flex-1 gap-4 rounded-3xl p-5 active:opacity-80"
    >
      <View className="flex-row items-start justify-between">
        {/* FIX: círculo de ícono h-10 (40px) -> h-12 (48px), como en el mock */}
        <View className="bg-accent/40 h-12 w-12 items-center justify-center rounded-full">
          <Icon size={22} color="#2D7F8E" />
        </View>
        <ArrowUpRight size={16} color="#2D7F8E" />
      </View>
      <View className="gap-0.5">
        <Text className="text-body font-heading-medium text-foreground">{title}</Text>
        <Text className="text-small font-body text-muted-foreground">{subtitle}</Text>
      </View>
    </Pressable>
  );
}

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
      className="bg-accent/20 flex-1 gap-3 rounded-2xl p-4 active:opacity-80"
    >
      <View className="flex-row items-start justify-between">
        <View className="bg-accent/40 h-10 w-10 items-center justify-center rounded-full">
          <Icon size={20} color="#0E2A3A" />
        </View>
        <ArrowUpRight size={16} color="#0E2A3A" />
      </View>
      <View>
        <Text className="text-body font-heading-medium text-foreground">{title}</Text>
        <Text className="text-small font-body text-muted-foreground">{subtitle}</Text>
      </View>
    </Pressable>
  );
}

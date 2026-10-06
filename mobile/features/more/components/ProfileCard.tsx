// features/more/components/ProfileCard.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { getInitials } from '../domain/user-initials';

type ProfileCardProps = {
  name: string;
  /** rol y/o correo, ya formateado para mostrar */
  subtitle: string;
};

export function ProfileCard({ name, subtitle }: ProfileCardProps) {
  return (
    <View className="bg-primary/5 border-primary/20 flex-row items-center gap-4 rounded-3xl border p-5">
      <View className="bg-primary h-16 w-16 items-center justify-center rounded-full">
        <Text className="text-h3 font-heading text-primary-foreground">{getInitials(name)}</Text>
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-body font-heading-semibold text-foreground" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-small font-body text-muted-foreground" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

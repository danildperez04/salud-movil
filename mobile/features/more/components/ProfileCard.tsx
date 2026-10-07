// features/more/components/ProfileCard.tsx
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/lib/tokens';
import { getInitials } from '../domain/user-initials';

type ProfileCardProps = {
  name: string;
  /** rol y/o correo, ya formateado para mostrar */
  subtitle: string;
  /** con `onPress` la tarjeta abre el perfil y muestra la flecha */
  onPress?: () => void;
};

export function ProfileCard({ name, subtitle, onPress }: ProfileCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      className="bg-primary/5 border-primary/20 flex-row items-center gap-4 rounded-3xl border p-5 active:opacity-80"
    >
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

      {onPress && <ChevronRight size={20} color={colors.secondarySteel} />}
    </Pressable>
  );
}

// features/reminders/components/ReminderCard.tsx
import { Bell, ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { REMINDERS_LABELS } from '@/constants/labels';
import { colors } from '@/lib/tokens';
import { cn } from '@/lib/utils';

type ReminderCardProps = {
  title: string;
  /** línea secundaria, ya formateada (ej. "08:00 AM - Todos los días") */
  description: string;
  icon?: LucideIcon;
  /** false: el recordatorio está pausado y la tarjeta se atenúa */
  active?: boolean;
  onPress?: () => void;
};

export function ReminderCard({
  title,
  description,
  icon: Icon = Bell,
  active = true,
  onPress,
}: ReminderCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      className={cn(
        'bg-card border-border flex-row items-center gap-4 rounded-3xl border p-5 shadow-lg shadow-black/5',
        onPress && 'active:opacity-80',
      )}
    >
      <View
        className={cn(
          'h-14 w-14 items-center justify-center rounded-full',
          active ? 'bg-primary/10' : 'bg-muted/60',
        )}
      >
        <Icon size={24} color={active ? colors.brandGreen : colors.neutralMedium} />
      </View>

      <View className="flex-1 gap-1">
        <Text
          className={cn(
            'text-body font-heading-semibold',
            active ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {title}
        </Text>
        <Text className="text-small font-body text-muted-foreground">{description}</Text>
      </View>

      {!active && (
        <Badge variant="outline">
          <Text className="text-caption font-body-semibold text-muted-foreground">
            {REMINDERS_LABELS.paused}
          </Text>
        </Badge>
      )}
      <ChevronRight size={20} color={colors.secondarySteel} />
    </Pressable>
  );
}

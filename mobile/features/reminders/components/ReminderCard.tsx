// features/reminders/components/ReminderCard.tsx
import { Bell, type LucideIcon } from 'lucide-react-native';
import { Badge } from '@/components/ui/badge';
import { ListItemCard } from '@/components/ui/list-item-card';
import { Text } from '@/components/ui/text';
import { REMINDERS_LABELS } from '@/constants/labels';

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
  icon = Bell,
  active = true,
  onPress,
}: ReminderCardProps) {
  return (
    <ListItemCard
      title={title}
      subtitle={description}
      icon={icon}
      tone={active ? 'primary' : 'muted'}
      muted={!active}
      trailing={
        active ? undefined : (
          <Badge variant="outline">
            <Text className="text-caption font-body-semibold text-muted-foreground">
              {REMINDERS_LABELS.paused}
            </Text>
          </Badge>
        )
      }
      onPress={onPress}
    />
  );
}

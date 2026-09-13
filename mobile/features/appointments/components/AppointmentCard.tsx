// features/appointments/components/AppointmentCard.tsx
import { Pressable, View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_VARIANT } from '@/constants/labels';

type AppointmentCardProps = {
  date: Date;
  specialty: string;
  doctorName: string;
  time: string;
  /** valor tal cual viene de cat_appointment_state.name (ej "Scheduled") */
  status: string;
  onPress?: () => void;
};

export function AppointmentCard({
  date,
  specialty,
  doctorName,
  time,
  status,
  onPress,
}: AppointmentCardProps) {
  const day = date.getDate();
  const month = date.toLocaleDateString('es', { month: 'short' }).replace('.', '').toUpperCase();

  const statusLabel = APPOINTMENT_STATUS_LABELS[status] ?? status;
  const statusVariant = APPOINTMENT_STATUS_VARIANT[status] ?? 'outline';

  return (
    <Pressable
      onPress={onPress}
      className="bg-muted/40 flex-row gap-4 rounded-2xl p-4 active:opacity-80"
    >
      <View className="items-center">
        <Text className="text-h3 font-heading text-foreground">{day}</Text>
        <Text className="text-caption font-body-semibold text-muted-foreground">{month}</Text>
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-body font-heading-medium text-foreground">{specialty}</Text>
        <Text className="text-small font-body text-muted-foreground">{doctorName}</Text>
      </View>

      <View className="items-end justify-between">
        <Badge variant={statusVariant}>
          <Text>{statusLabel}</Text>
        </Badge>
        <Text className="text-small font-heading-medium text-foreground">{time}</Text>
      </View>
    </Pressable>
  );
}

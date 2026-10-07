// features/appointments/components/AppointmentCard.tsx
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { formatDay, formatMonthShort } from '../domain/appointment-date';
import { getAppointmentStatus } from '../domain/appointment-status';

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
  const statusStyle = getAppointmentStatus(status);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        'bg-card border-border flex-row gap-5 rounded-3xl border p-5 shadow-lg shadow-black/5',
        onPress && 'active:opacity-80',
      )}
    >
      <View className="w-12 items-center">
        <Text className="text-h3 font-heading text-foreground">{formatDay(date)}</Text>
        <Text className="text-small font-body-medium text-muted-foreground">
          {formatMonthShort(date)}
        </Text>
      </View>

      <View className="flex-1 gap-4">
        <View className="gap-1">
          <Text className="text-body font-heading-semibold text-foreground">{specialty}</Text>
          <Text className="text-small font-body text-muted-foreground">{doctorName}</Text>
        </View>

        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-body font-heading-semibold text-foreground">{time}</Text>
          <View className={cn('rounded-full px-3 py-1', statusStyle.badge)}>
            <Text className={cn('text-caption font-body-semibold', statusStyle.text)}>
              {statusStyle.label}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

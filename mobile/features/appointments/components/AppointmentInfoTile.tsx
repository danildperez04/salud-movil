// features/appointments/components/AppointmentInfoTile.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type AppointmentInfoTileProps = {
  label: string;
  value: string;
  className?: string;
};

export function AppointmentInfoTile({ label, value, className }: AppointmentInfoTileProps) {
  return (
    <View className={cn('bg-card border-border gap-1 rounded-2xl border px-4 py-3', className)}>
      <Text className="text-caption font-body-semibold text-muted-foreground tracking-widest uppercase">
        {label}
      </Text>
      <Text className="text-body font-heading-semibold text-foreground">{value}</Text>
    </View>
  );
}

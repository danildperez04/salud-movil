// features/health-indicators/components/HealthIndicatorCard.tsx
import { Activity, Droplet, Scale, Thermometer, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { INDICATOR_STATUS_LABELS, INDICATOR_STATUS_VARIANT } from '@/constants/labels';

const INDICATOR_ICONS: Record<string, LucideIcon> = {
  'blood pressure': Activity,
  glucose: Droplet,
  weight: Scale,
  temperature: Thermometer,
};

export type IndicatorStatus = keyof typeof INDICATOR_STATUS_LABELS;

type HealthIndicatorCardProps = {
  /** nombre del catálogo (cat_type_indicator.name), en minúscula o no — se normaliza */
  typeName: string;
  value: string | number;
  unit: string;
  status: IndicatorStatus;
  onPress?: () => void;
};

export function HealthIndicatorCard({
  typeName,
  value,
  unit,
  status,
  onPress,
}: HealthIndicatorCardProps) {
  const Icon = INDICATOR_ICONS[typeName.toLowerCase()] ?? Activity;

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'bg-muted/40 flex-row items-center gap-4 rounded-2xl p-4',
        onPress && 'active:opacity-80',
      )}
    >
      <View className="bg-background h-11 w-11 items-center justify-center rounded-full">
        <Icon size={20} color="#2DB79A" />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-body font-heading-medium text-foreground">{typeName}</Text>
        <Text className="text-small font-body text-muted-foreground">
          {value} {unit}
        </Text>
      </View>

      <Badge variant={INDICATOR_STATUS_VARIANT[status]}>
        <Text>{INDICATOR_STATUS_LABELS[status]}</Text>
      </Badge>
    </Pressable>
  );
}

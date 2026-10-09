// features/health-indicators/components/HealthIndicatorCard.tsx
import {
  ChevronRight,
  Droplet,
  Heart,
  Pencil,
  Scale,
  Thermometer,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  HEALTH_INDICATORS_LABELS,
  INDICATOR_STATUS_LABELS,
  INDICATOR_TYPE_LABELS,
} from '@/constants/labels';
import { colors } from '@/lib/tokens';
import { cn } from '@/lib/utils';
import { evaluateIndicator } from '../domain/indicator-range';
import { formatMeasurementDate, formatMeasurementTime } from '../domain/measurement-format';
import { IndicatorRangeBar } from './IndicatorRangeBar';

const INDICATOR_ICONS: Record<string, LucideIcon> = {
  'Blood pressure': Heart,
  Glucose: Droplet,
  Weight: Scale,
  Temperature: Thermometer,
};

type HealthIndicatorCardProps = {
  /** nombre del tipo tal como viene de cat_type_indicator (en inglés) */
  typeName: string;
  value: string | number;
  unit: string;
  /** ISO de la medición; en variant="default" se muestra como "Actualizado ..." */
  measuredAt?: string;
  /**
   * default: tarjeta de la lista de indicadores. summary: versión destacada
   * para el Home (valor grande, sin ícono, con acción de editar).
   */
  variant?: 'default' | 'summary';
  onPress?: () => void;
  /** solo aplica en variant="summary" */
  onEdit?: () => void;
};

export function HealthIndicatorCard({
  typeName,
  value,
  unit,
  measuredAt,
  variant = 'default',
  onPress,
  onEdit,
}: HealthIndicatorCardProps) {
  const Icon = INDICATOR_ICONS[typeName] ?? Heart;
  const title = INDICATOR_TYPE_LABELS[typeName] ?? typeName;
  const evaluation = evaluateIndicator(typeName, String(value));

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        'bg-card border-border gap-4 rounded-3xl border p-5 shadow-lg shadow-black/5',
        onPress && 'active:opacity-80',
      )}
    >
      {variant === 'summary' ? (
        <>
          <View className="flex-row items-center justify-between">
            <Text className="text-body font-heading-medium text-muted-foreground">{title}</Text>
            {onEdit && (
              <Pressable
                onPress={onEdit}
                accessibilityRole="button"
                className="border-primary/40 flex-row items-center gap-2 rounded-full border px-4 py-2 active:opacity-70"
              >
                <Pencil size={16} color="#2DB79A" />
                <Text className="text-small font-body-semibold text-primary">
                  {HEALTH_INDICATORS_LABELS.editButton}
                </Text>
              </Pressable>
            )}
          </View>

          <View className="flex-row items-end justify-between">
            <Text className="text-h1 font-heading text-foreground">{value}</Text>
            <Text className="text-body font-body-medium text-muted-foreground pb-2">{unit}</Text>
          </View>
        </>
      ) : (
        <View className="flex-row items-start gap-4">
          <View className="bg-primary/10 h-14 w-14 items-center justify-center rounded-2xl">
            <Icon size={24} color="#2DB79A" />
          </View>

          <View className="flex-1 gap-1.5">
            <Text className="text-body font-heading-semibold text-foreground">{title}</Text>
            <Text className="text-small font-body text-muted-foreground">
              {evaluation
                ? `${HEALTH_INDICATORS_LABELS.currentStatus}: ${INDICATOR_STATUS_LABELS[evaluation.status].toLowerCase()}`
                : HEALTH_INDICATORS_LABELS.noReferenceRange}
            </Text>
            {measuredAt && (
              <Text className="text-caption font-body text-muted-foreground">
                {HEALTH_INDICATORS_LABELS.updatedPrefix} {formatMeasurementDate(measuredAt)} ·{' '}
                {formatMeasurementTime(measuredAt)}
              </Text>
            )}
          </View>

          <View className="items-end gap-1">
            <Text className="text-h3 font-heading text-foreground">{value}</Text>
            <Text className="text-caption font-body-semibold text-muted-foreground">{unit}</Text>
          </View>

          {onPress && (
            <View className="self-center">
              <ChevronRight size={20} color={colors.neutralMedium} />
            </View>
          )}
        </View>
      )}

      {evaluation && (
        <IndicatorRangeBar status={evaluation.status} position={evaluation.position} />
      )}
    </Pressable>
  );
}

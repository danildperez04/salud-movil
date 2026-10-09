// features/health-indicators/components/IndicatorRangeBar.tsx
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Text } from '@/components/ui/text';
import { INDICATOR_STATUS_LABELS } from '@/constants/labels';
import { cn } from '@/lib/utils';
import { ZONE_BOUNDARIES, type IndicatorStatus } from '../domain/indicator-range';

// Azul = bajo, verde de marca = normal, ámbar -> rojo = alto (mismo degradé
// cálido del Figma, pero con una zona fría para distinguir "bajo" de "normal").
export const INDICATOR_STATUS_COLORS: Record<IndicatorStatus, string> = {
  low: '#3B82F6',
  normal: '#2DB79A',
  high: '#EF4444',
};

const GRADIENT_STOPS = [
  { offset: 0, color: INDICATOR_STATUS_COLORS.low },
  { offset: ZONE_BOUNDARIES.lowEnd + 0.05, color: INDICATOR_STATUS_COLORS.normal },
  { offset: ZONE_BOUNDARIES.highStart - 0.05, color: INDICATOR_STATUS_COLORS.normal },
  { offset: 0.86, color: '#F5B53D' },
  { offset: 1, color: INDICATOR_STATUS_COLORS.high },
];

const STATUS_ORDER: IndicatorStatus[] = ['low', 'normal', 'high'];
const LABEL_ALIGN = { low: 'text-left', normal: 'text-center', high: 'text-right' } as const;

const BAR_HEIGHT = 10;
const MARKER_SIZE = 20;

type IndicatorRangeBarProps = {
  status: IndicatorStatus;
  /** 0 a 1 */
  position: number;
};

export function IndicatorRangeBar({ status, position }: IndicatorRangeBarProps) {
  const clamped = Math.min(1, Math.max(0, position));

  return (
    <View className="gap-2" accessible accessibilityLabel={INDICATOR_STATUS_LABELS[status]}>
      <View className="justify-center" style={{ height: MARKER_SIZE }}>
        <Svg width="100%" height={BAR_HEIGHT}>
          <Defs>
            <LinearGradient id="indicator-range-gradient" x1="0" y1="0" x2="1" y2="0">
              {GRADIENT_STOPS.map((stop) => (
                <Stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </LinearGradient>
          </Defs>
          <Rect
            width="100%"
            height={BAR_HEIGHT}
            rx={BAR_HEIGHT / 2}
            fill="url(#indicator-range-gradient)"
          />
        </Svg>

        <View
          className="bg-background absolute rounded-full shadow-md shadow-black/20"
          style={{
            left: `${clamped * 100}%`,
            marginLeft: -MARKER_SIZE / 2,
            width: MARKER_SIZE,
            height: MARKER_SIZE,
            borderWidth: 3,
            borderColor: INDICATOR_STATUS_COLORS[status],
          }}
        />
      </View>

      <View className="flex-row">
        {STATUS_ORDER.map((item) => (
          <Text
            key={item}
            className={cn('text-caption font-body-semibold flex-1', LABEL_ALIGN[item])}
            style={{ color: INDICATOR_STATUS_COLORS[item], opacity: item === status ? 1 : 0.45 }}
          >
            {INDICATOR_STATUS_LABELS[item]}
          </Text>
        ))}
      </View>
    </View>
  );
}

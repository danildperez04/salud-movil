// features/health-indicators/components/TrendChartCard.tsx
import { View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { LineChart, type ChartPoint } from '@/components/ui/line-chart';
import { Text } from '@/components/ui/text';
import { INDICATOR_HISTORY_LABELS } from '@/constants/labels';
import type { IndicatorTrend, SeriesStats } from '../domain/indicator-series';
import { seriesDateLabels } from '../domain/measurement-format';

const CHART_HEIGHT = 200;

/** 121.4 -> "121.4"; 129 -> "129" */
const formatStat = (value: number) => String(Number(value.toFixed(1)));

type TrendChartCardProps = {
  title: string;
  unit: string;
  /** null cuando hay menos de 2 mediciones: no se muestra el badge */
  trend: IndicatorTrend | null;
  points: ChartPoint[];
  domain: [number, number];
  /** null si el período no tiene mediciones */
  stats: SeriesStats | null;
  /** aclaración sobre lo que se grafica (ej. presión: solo la sistólica) */
  note?: string;
};

/** Tarjeta de la pantalla de historial: título, badge de tendencia, gráfico y resumen del período. */
export function TrendChartCard({
  title,
  unit,
  trend,
  points,
  domain,
  stats,
  note,
}: TrendChartCardProps) {
  const summary = stats
    ? INDICATOR_HISTORY_LABELS.chartSummary(
        points.length,
        formatStat(stats.min),
        formatStat(stats.max),
      )
    : INDICATOR_HISTORY_LABELS.emptyRange;

  return (
    <View className="bg-card border-border gap-4 rounded-3xl border p-5 shadow-lg shadow-black/5">
      <View className="flex-row items-center justify-between">
        <Text className="text-body font-heading-semibold text-foreground">{title}</Text>
        {trend && (
          <Badge variant={trend === 'stable' ? 'success' : 'outline'} className="px-3 py-1.5">
            <Text className="text-caption font-body-semibold">
              {INDICATOR_HISTORY_LABELS.trends[trend]}
            </Text>
          </Badge>
        )}
      </View>

      <View className="bg-primary/5 border-border overflow-hidden rounded-2xl border">
        {points.length > 0 ? (
          <LineChart
            points={points}
            domain={domain}
            height={CHART_HEIGHT}
            xLabels={seriesDateLabels(points)}
            accessibilityLabel={`${title}: ${summary}`}
          />
        ) : (
          <View className="items-center justify-center px-6" style={{ height: CHART_HEIGHT }}>
            <Text className="text-small text-muted-foreground text-center">{summary}</Text>
          </View>
        )}
      </View>

      {note && stats && (
        <Text className="text-caption font-body text-muted-foreground">{note}</Text>
      )}

      {stats && (
        <View className="border-border flex-row border-t pt-4">
          <Stat label={INDICATOR_HISTORY_LABELS.stats.average} value={stats.average} unit={unit} />
          <Stat label={INDICATOR_HISTORY_LABELS.stats.min} value={stats.min} unit={unit} />
          <Stat label={INDICATOR_HISTORY_LABELS.stats.max} value={stats.max} unit={unit} />
        </View>
      )}
    </View>
  );
}

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <View className="flex-1 items-center gap-0.5" accessible>
      <Text className="text-caption font-body text-muted-foreground">{label}</Text>
      <Text className="text-body font-heading-semibold text-foreground">{formatStat(value)}</Text>
      <Text className="text-caption font-body text-muted-foreground">{unit}</Text>
    </View>
  );
}

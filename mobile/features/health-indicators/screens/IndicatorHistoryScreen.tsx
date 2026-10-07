// features/health-indicators/screens/IndicatorHistoryScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/segmented-control';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { INDICATOR_HISTORY_LABELS, INDICATOR_TYPE_LABELS, SCREEN_TITLES } from '@/constants/labels';
import type { HealthIndicatorRecord } from '../api/mock-health-indicators';
import { MeasurementList } from '../components/MeasurementList';
import { TrendChartCard } from '../components/TrendChartCard';
import { typeNameFromSlug } from '../domain/indicator-type';
import {
  TIME_RANGES,
  buildSeries,
  chartDomain,
  filterByRange,
  getTrend,
  summarizeSeries,
  type TimeRange,
} from '../domain/indicator-series';
import { useIndicatorHistory } from '../hooks/useHealthIndicators';
import { indicatorRoutes } from '../routes';

/** Cuántas mediciones se listan bajo el gráfico; el gráfico sí usa todas las del período. */
const MAX_RECENT = 10;

const RANGE_OPTIONS: SegmentedOption<TimeRange>[] = TIME_RANGES.map((value) => ({
  value,
  label: INDICATOR_HISTORY_LABELS.ranges[value],
}));

export default function IndicatorHistoryScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const typeName = typeNameFromSlug(type);
  const { data: records, isLoading } = useIndicatorHistory(typeName);

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.indicatorHistory} align="center" />

      {isLoading ? (
        <View className="gap-6 px-6 pt-2">
          <Skeleton className="h-14 w-full rounded-full" />
          <Skeleton className="h-72 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </View>
      ) : typeName && records ? (
        <IndicatorHistory typeName={typeName} records={records} />
      ) : (
        <Text className="text-body text-muted-foreground px-6 py-10 text-center">
          {INDICATOR_HISTORY_LABELS.notFound}
        </Text>
      )}
    </View>
  );
}

type IndicatorHistoryProps = {
  typeName: string;
  /** del más reciente al más antiguo */
  records: HealthIndicatorRecord[];
};

function IndicatorHistory({ typeName, records }: IndicatorHistoryProps) {
  const [range, setRange] = useState<TimeRange>('7d');

  const inRange = useMemo(() => filterByRange(records, range), [records, range]);
  const series = useMemo(() => buildSeries(inRange), [inRange]);
  const values = useMemo(() => series.map((p) => p.y), [series]);

  return (
    <ScrollView contentContainerClassName="gap-6 px-6 pt-2 pb-10">
      <SegmentedControl options={RANGE_OPTIONS} value={range} onValueChange={setRange} />

      <TrendChartCard
        title={INDICATOR_TYPE_LABELS[typeName] ?? typeName}
        unit={records[0]?.unit ?? ''}
        trend={getTrend(values)}
        points={series}
        domain={chartDomain(values, typeName)}
        stats={summarizeSeries(values)}
        note={INDICATOR_HISTORY_LABELS.seriesNotes[typeName]}
      />

      <View className="gap-4">
        <SectionHeader
          title={INDICATOR_HISTORY_LABELS.recentTitle}
          action={{
            label: INDICATOR_HISTORY_LABELS.register,
            onPress: () => router.push(indicatorRoutes.register(typeName)),
          }}
        />

        {inRange.length > 0 ? (
          <MeasurementList records={inRange.slice(0, MAX_RECENT)} />
        ) : (
          <Text className="text-small text-muted-foreground py-6 text-center">
            {INDICATOR_HISTORY_LABELS.emptyRange}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

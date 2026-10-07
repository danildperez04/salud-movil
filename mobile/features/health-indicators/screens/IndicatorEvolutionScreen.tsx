// features/health-indicators/screens/IndicatorEvolutionScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { LineChart } from '@/components/ui/line-chart';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import {
  INDICATOR_EVOLUTION_LABELS,
  INDICATOR_HISTORY_LABELS,
  INDICATOR_TYPE_LABELS,
  SCREEN_TITLES,
} from '@/constants/labels';
import type { HealthIndicatorRecord } from '../api/mock-health-indicators';
import { InterpretationCard } from '../components/InterpretationCard';
import { LatestMeasurementCard } from '../components/LatestMeasurementCard';
import { evaluateIndicator } from '../domain/indicator-range';
import { buildSeries, chartDomain, filterByRange, getTrend } from '../domain/indicator-series';
import { seriesDateLabels } from '../domain/measurement-format';
import { typeNameFromSlug } from '../domain/indicator-type';
import { useIndicatorHistory } from '../hooks/useHealthIndicators';
import { indicatorRoutes } from '../routes';

export default function IndicatorEvolutionScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const typeName = typeNameFromSlug(type);
  const { data: records, isLoading } = useIndicatorHistory(typeName);

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.indicatorEvolution} align="center" />

      {isLoading ? (
        <View className="gap-6 px-6 pt-2">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-28 w-full rounded-3xl" />
        </View>
      ) : typeName && records ? (
        <IndicatorEvolution typeName={typeName} records={records} />
      ) : (
        <Text className="text-body text-muted-foreground px-6 py-10 text-center">
          {INDICATOR_HISTORY_LABELS.notFound}
        </Text>
      )}
    </View>
  );
}

type IndicatorEvolutionProps = {
  typeName: string;
  /** del más reciente al más antiguo */
  records: HealthIndicatorRecord[];
};

function IndicatorEvolution({ typeName, records }: IndicatorEvolutionProps) {
  const latest = records[0];
  const title = INDICATOR_TYPE_LABELS[typeName] ?? typeName;

  // la tendencia siempre se calcula sobre los últimos 30 días
  const series = useMemo(() => buildSeries(filterByRange(records, '30d')), [records]);
  const values = useMemo(() => series.map((p) => p.y), [series]);
  const trend = getTrend(values);

  return (
    <>
      <ScrollView contentContainerClassName="gap-6 px-6 pt-2 pb-6">
        {latest ? (
          <>
            <LatestMeasurementCard
              value={latest.value}
              unit={latest.unit}
              measuredAt={latest.dateHour}
              evaluation={evaluateIndicator(typeName, latest.value)}
            />

            <View className="gap-4">
              <SectionHeader
                title={INDICATOR_EVOLUTION_LABELS.trendTitle}
                subtitle={INDICATOR_EVOLUTION_LABELS.trendPeriod}
                action={{
                  label: INDICATOR_EVOLUTION_LABELS.viewHistory,
                  chevron: true,
                  onPress: () => router.push(indicatorRoutes.history(typeName)),
                }}
              />

              <View className="bg-card border-border overflow-hidden rounded-3xl border">
                <LineChart
                  points={series}
                  domain={chartDomain(values, typeName)}
                  height={220}
                  xLabels={seriesDateLabels(series)}
                  accessibilityLabel={`${title}: ${INDICATOR_EVOLUTION_LABELS.trendPeriod}`}
                />
              </View>
            </View>

            <InterpretationCard
              message={INDICATOR_EVOLUTION_LABELS.interpretations[trend ?? 'insufficient']}
            />
          </>
        ) : (
          <Text className="text-body text-muted-foreground py-10 text-center">
            {INDICATOR_EVOLUTION_LABELS.empty}
          </Text>
        )}
      </ScrollView>

      <View className="px-6 pt-2 pb-8">
        <Button
          size="lg"
          className="h-14"
          onPress={() => router.push(indicatorRoutes.register(typeName))}
        >
          <Text className="text-body text-primary-foreground">
            {INDICATOR_EVOLUTION_LABELS.newMeasurement}
          </Text>
        </Button>
      </View>
    </>
  );
}

// features/health-indicators/screens/HealthIndicatorsScreen.tsx
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { HEALTH_INDICATORS_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { HealthIndicatorCard } from '../components/HealthIndicatorCard';
import { useLatestIndicators } from '../hooks/useHealthIndicators';
import { indicatorRoutes } from '../routes';

export default function HealthIndicatorsScreen() {
  const { data: indicators, isLoading } = useLatestIndicators();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.healthIndicators} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-10">
        <Text className="text-small font-body text-muted-foreground px-1">
          {HEALTH_INDICATORS_LABELS.hint}
        </Text>

        {isLoading ? (
          <View className="gap-5">
            <Skeleton className="h-40 w-full rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-3xl" />
          </View>
        ) : (
          indicators?.map((indicator) => (
            <HealthIndicatorCard
              key={indicator.id}
              typeName={indicator.typeName}
              value={indicator.value}
              unit={indicator.unit}
              measuredAt={indicator.dateHour}
              onPress={() => router.push(indicatorRoutes.evolution(indicator.typeName))}
            />
          ))
        )}

        <Button
          size="lg"
          className="mt-2 h-14"
          onPress={() => router.push(indicatorRoutes.register())}
        >
          <Text className="text-body text-primary-foreground">
            {HEALTH_INDICATORS_LABELS.registerButton}
          </Text>
        </Button>
      </ScrollView>
    </View>
  );
}

// features/health-indicators/screens/HealthIndicatorsScreen.tsx
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { HEALTH_INDICATORS_LABELS, SCREEN_TITLES, SUMMARY_TABS_LABELS } from '@/constants/labels';
import { fetchMockHealthIndicators } from '../api/mock-health-indicators';
import { HealthIndicatorCard } from '../components/HealthIndicatorCard';

export default function HealthIndicatorsScreen() {
  const [tab, setTab] = useState<'summary' | 'history'>('summary');

  // TODO: reemplazar fetchMockHealthIndicators por apiClient.get('/health-indicators')
  // cuando el backend exponga el endpoint. El resto de la pantalla no cambia.
  const { data: indicators, isLoading } = useQuery({
    queryKey: ['health-indicators'],
    queryFn: fetchMockHealthIndicators,
  });

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.healthIndicators} />

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as 'summary' | 'history')}
        className="flex-1"
      >
        <TabsList className="mx-6">
          <TabsTrigger value="summary" className="flex-1">
            <Text>{SUMMARY_TABS_LABELS.summary}</Text>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            <Text>{SUMMARY_TABS_LABELS.history}</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="flex-1">
          <ScrollView contentContainerClassName="gap-3 p-6">
            {isLoading ? (
              <View className="gap-3">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </View>
            ) : (
              indicators?.map((indicator) => (
                <HealthIndicatorCard
                  key={indicator.id}
                  typeName={indicator.typeName}
                  value={indicator.value}
                  unit={indicator.unit}
                  status={indicator.status}
                />
              ))
            )}
            <Button className="mt-2" onPress={() => router.push('/(app)/health-indicators/new')}>
              <Text>{HEALTH_INDICATORS_LABELS.registerButton}</Text>
            </Button>
          </ScrollView>
        </TabsContent>

        <TabsContent value="history" className="flex-1">
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-body text-muted-foreground text-center">
              {HEALTH_INDICATORS_LABELS.historyPlaceholder}
            </Text>
          </View>
        </TabsContent>
      </Tabs>
    </View>
  );
}

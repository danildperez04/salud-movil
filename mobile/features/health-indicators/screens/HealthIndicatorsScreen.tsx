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
  const { data: indicators, isLoading } = useQuery({
    queryKey: ['health-indicators'],
    queryFn: fetchMockHealthIndicators,
  });

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.healthIndicators} size="large" />

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as 'summary' | 'history')}
        className="flex-1"
      >
        <TabsList className="px-6">
          <TabsTrigger value="summary">
            <Text>{SUMMARY_TABS_LABELS.summary}</Text>
          </TabsTrigger>
          <TabsTrigger value="history">
            <Text>{SUMMARY_TABS_LABELS.history}</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="flex-1">
          <ScrollView contentContainerClassName="gap-5 px-6 pt-6 pb-10">
            {isLoading ? (
              <View className="gap-5">
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
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
            <Button
              size="lg"
              className="mt-2 h-14"
              onPress={() => router.push('/(app)/health-indicators/new')}
            >
              <Text className="text-body text-primary-foreground">
                {HEALTH_INDICATORS_LABELS.registerButton}
              </Text>
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

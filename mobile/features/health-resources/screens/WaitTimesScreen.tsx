// features/health-resources/screens/WaitTimesScreen.tsx
import { router } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { IntroCard } from '@/components/ui/intro-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { SCREEN_TITLES, WAIT_TIMES_LABELS } from '@/constants/labels';
import { colors } from '@/lib/tokens';
import { WaitTimeCard } from '../components/WaitTimeCard';
import { useWaitTimes } from '../hooks/useHealthResources';
import { healthResourceRoutes } from '../routes';

const labels = WAIT_TIMES_LABELS;

export default function WaitTimesScreen() {
  const { resources, isLoading, refreshing, refresh, updatedAt } = useWaitTimes();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.waitTimes} align="center" />

      <ScrollView
        contentContainerClassName="gap-4 px-6 pt-2 pb-10"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.brandGreen}
            colors={[colors.brandGreen]}
          />
        }
      >
        <IntroCard title={labels.introTitle} description={labels.introDescription} />

        {isLoading ? (
          <View className="gap-4">
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-28 w-full rounded-3xl" />
          </View>
        ) : (
          resources.map((resource) => <WaitTimeCard key={resource.id} resource={resource} />)
        )}

        <Button
          variant="outline"
          size="lg"
          className="border-primary mt-2"
          onPress={() => router.push(healthResourceRoutes.map)}
        >
          <Text className="text-body font-heading-semibold text-primary">{labels.viewOnMap}</Text>
        </Button>

        {updatedAt && (
          <Text className="text-caption font-body text-muted-foreground text-center">
            {labels.updatedAt(updatedAt)}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

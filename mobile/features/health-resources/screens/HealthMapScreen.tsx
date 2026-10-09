// features/health-resources/screens/HealthMapScreen.tsx
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { FilterChips } from '@/components/ui/filter-chips';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { HEALTH_MAP_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { MapPreview } from '../components/MapPreview';
import { ResourceCard } from '../components/ResourceCard';
import { useHealthMap } from '../hooks/useHealthMap';
import { healthResourceRoutes } from '../routes';

const labels = HEALTH_MAP_LABELS;

export default function HealthMapScreen() {
  const { isLoading, filter, setFilter, filterOptions, resources, legend } = useHealthMap();
  const openResource = (id: string) => router.push(healthResourceRoutes.resource(id));

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.healthMap} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-10">
        <FilterChips options={filterOptions} value={filter} onValueChange={setFilter} />

        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-3xl" />
        ) : (
          <MapPreview resources={resources} legend={legend} onSelect={openResource} />
        )}

        <View className="gap-4">
          <SectionHeader title={labels.listTitle} subtitle={labels.listHint} />

          {isLoading ? (
            <View className="gap-4">
              <Skeleton className="h-24 w-full rounded-3xl" />
              <Skeleton className="h-24 w-full rounded-3xl" />
            </View>
          ) : resources.length > 0 ? (
            resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onPress={() => openResource(resource.id)}
              />
            ))
          ) : (
            <Text className="text-small font-body text-muted-foreground px-1">{labels.empty}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

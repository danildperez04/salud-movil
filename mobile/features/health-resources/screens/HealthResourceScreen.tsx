// features/health-resources/screens/HealthResourceScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, Hospital, Map, ShieldCheck } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ListItemCard } from '@/components/ui/list-item-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { HEALTH_MAP_LABELS, RESOURCE_TYPE_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { joinParts } from '@/lib/text-format';
import { colors } from '@/lib/tokens';
import type { HealthResource } from '../api/mock-health-resources';
import { useHealthResource } from '../hooks/useHealthResources';
import { useResourceActions } from '../hooks/useResourceActions';
import { healthResourceRoutes } from '../routes';

const labels = HEALTH_MAP_LABELS.detail;

export default function HealthResourceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: resource, isLoading } = useHealthResource(id);

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.healthResource} align="center" />

      <ScrollView contentContainerClassName="gap-6 px-6 pt-2 pb-10">
        {isLoading ? (
          <View className="gap-6">
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-52 w-full rounded-3xl" />
          </View>
        ) : resource ? (
          <ResourceDetail resource={resource} />
        ) : (
          <Text className="text-body text-muted-foreground py-10 text-center">
            {labels.notFound}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

function ResourceDetail({ resource }: { resource: HealthResource }) {
  const actions = useResourceActions(resource);
  const hasInternalGuide = resource.type === 'hospital' || resource.type === 'health-center';

  return (
    <>
      <View className="bg-primary/5 border-primary/20 gap-1 rounded-3xl border p-5">
        <Text className="text-caption font-body-semibold text-primary tracking-widest uppercase">
          {RESOURCE_TYPE_LABELS[resource.type]}
        </Text>
        <Text className="text-h3 font-heading text-foreground">{resource.name}</Text>
        <Text className="text-small font-body text-muted-foreground">
          {joinParts([
            resource.description,
            resource.waitMinutes === undefined
              ? undefined
              : HEALTH_MAP_LABELS.waitApprox(resource.waitMinutes),
          ])}
        </Text>
      </View>

      <View className="gap-3">
        <SectionHeader title={labels.servicesTitle} />
        {resource.waitMinutes !== undefined && (
          <ListItemCard icon={Clock} title={labels.timeTitle} subtitle={labels.timeDescription} />
        )}
        <ListItemCard
          icon={ShieldCheck}
          title={labels.accessTitle}
          subtitle={labels.accessDescription}
        />
      </View>

      <View className="gap-3">
        <Button size="lg" onPress={actions.openDirections}>
          <Map size={20} color="#FFFFFF" />
          <Text className="text-body text-primary-foreground">{labels.directions}</Text>
        </Button>

        <View className="flex-row gap-3">
          <Button variant="outline" size="lg" className="flex-1" onPress={actions.openGoogleMaps}>
            <Text className="text-small font-body-semibold text-foreground">
              {labels.googleMaps}
            </Text>
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onPress={actions.openWaze}>
            <Text className="text-small font-body-semibold text-foreground">{labels.waze}</Text>
          </Button>
        </View>

        <View className="flex-row gap-3">
          <Button
            variant="outline"
            size="lg"
            className="border-primary/40 flex-1"
            onPress={actions.call}
          >
            <Text className="text-small font-body-semibold text-primary">{labels.call}</Text>
          </Button>
          <Button size="lg" className="flex-1" onPress={actions.openWhatsApp}>
            <Text className="text-small font-body-semibold text-primary-foreground">
              {labels.whatsapp}
            </Text>
          </Button>
        </View>

        {hasInternalGuide && (
          <Button
            variant="outline"
            size="lg"
            className="border-primary"
            onPress={() => router.push(healthResourceRoutes.hospitalGuide(resource.id))}
          >
            <Hospital size={20} color={colors.brandGreen} />
            <Text className="text-body font-heading-semibold text-primary">
              {labels.hospitalGuide}
            </Text>
          </Button>
        )}
      </View>
    </>
  );
}

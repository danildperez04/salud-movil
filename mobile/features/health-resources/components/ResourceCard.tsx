// features/health-resources/components/ResourceCard.tsx
import { ListItemCard } from '@/components/ui/list-item-card';
import type { HealthResource } from '../api/mock-health-resources';
import { describeResource } from '../domain/resource-format';
import { RESOURCE_ICONS } from './resource-visuals';

type ResourceCardProps = {
  resource: HealthResource;
  onPress: () => void;
};

export function ResourceCard({ resource, onPress }: ResourceCardProps) {
  return (
    <ListItemCard
      icon={RESOURCE_ICONS[resource.type]}
      title={resource.name}
      subtitle={describeResource(resource)}
      onPress={onPress}
    />
  );
}

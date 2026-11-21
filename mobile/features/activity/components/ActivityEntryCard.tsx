// features/activity/components/ActivityEntryCard.tsx
import { Check, Moon } from '@/lib/icons';
import { ListItemCard } from '@/components/ui/list-item-card';
import { ToneBadge } from '@/components/ui/tone-badge';
import { ACTIVITY_LABELS } from '@/constants/labels';
import { statusColors } from '@/lib/tokens';
import type { ActivityEntry } from '../api/mock-activity';
import { describeEntryDetails, describeEntryTitle } from '../domain/activity-stats';

export function ActivityEntryCard({ entry }: { entry: ActivityEntry }) {
  return (
    <ListItemCard
      icon={entry.done ? Check : Moon}
      tone={entry.done ? 'primary' : 'muted'}
      title={describeEntryTitle(entry)}
      subtitle={describeEntryDetails(entry)}
      trailing={
        entry.done ? (
          <ToneBadge label={ACTIVITY_LABELS.done} color={statusColors.success} />
        ) : (
          <ToneBadge label={ACTIVITY_LABELS.rest} color={statusColors.warning} />
        )
      }
    />
  );
}

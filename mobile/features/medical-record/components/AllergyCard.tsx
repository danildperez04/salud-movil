// features/medical-record/components/AllergyCard.tsx
import { TriangleAlert } from '@/lib/icons';
import { ListItemCard } from '@/components/ui/list-item-card';
import { ToneBadge } from '@/components/ui/tone-badge';
import {
  ALLERGY_SEVERITY_LABELS,
  ALLERGY_TYPE_LABELS,
  MEDICAL_RECORD_LABELS,
} from '@/constants/labels';
import type { Allergy } from '../domain/record-types';
import { joinParts } from '../domain/clinical-summary';
import { ALLERGY_SEVERITY_COLORS } from './record-visuals';

export function AllergyCard({ allergy }: { allergy: Allergy }) {
  return (
    <ListItemCard
      icon={TriangleAlert}
      tone="danger"
      title={allergy.name}
      subtitle={joinParts([
        ALLERGY_TYPE_LABELS[allergy.type],
        allergy.reaction ?? MEDICAL_RECORD_LABELS.allergies.unspecifiedReaction,
      ])}
      trailing={
        allergy.severity && (
          <ToneBadge
            label={ALLERGY_SEVERITY_LABELS[allergy.severity]}
            color={ALLERGY_SEVERITY_COLORS[allergy.severity]}
          />
        )
      }
    />
  );
}

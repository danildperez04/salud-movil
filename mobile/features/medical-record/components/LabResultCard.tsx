// features/medical-record/components/LabResultCard.tsx
import { FlaskConical } from '@/lib/icons';
import { ListItemCard } from '@/components/ui/list-item-card';
import { Text } from '@/components/ui/text';
import { ToneBadge } from '@/components/ui/tone-badge';
import { LAB_STATUS_LABELS, MEDICAL_RECORD_LABELS } from '@/constants/labels';
import { formatIsoDateShort } from '@/lib/date-format';
import type { LabResult } from '../api/mock-medical-record';
import { joinParts } from '../domain/clinical-summary';
import { LAB_STATUS_COLORS } from './record-visuals';

type LabResultCardProps = {
  lab: LabResult;
  onPress: () => void;
};

export function LabResultCard({ lab, onPress }: LabResultCardProps) {
  return (
    <ListItemCard
      icon={FlaskConical}
      title={lab.name}
      subtitle={joinParts([lab.resultValue, formatIsoDateShort(lab.issuedAt)])}
      footer={
        <Text className="text-caption font-body-semibold text-primary">
          {MEDICAL_RECORD_LABELS.labs.scanned}
        </Text>
      }
      trailing={
        <ToneBadge label={LAB_STATUS_LABELS[lab.status]} color={LAB_STATUS_COLORS[lab.status]} />
      }
      onPress={onPress}
    />
  );
}

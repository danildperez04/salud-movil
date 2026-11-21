// features/health-indicators/components/MeasurementList.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { INDICATOR_HISTORY_LABELS } from '@/constants/labels';
import type { HealthIndicatorRecord } from '../domain/indicator-record';
import { formatMeasurementDate, formatMeasurementTime } from '../domain/measurement-format';

function MeasurementRow({ record }: { record: HealthIndicatorRecord }) {
  // "11 sep · 08:30 AM · Sin observaciones"
  const details = [
    formatMeasurementDate(record.dateHour),
    formatMeasurementTime(record.dateHour),
    record.notes ?? INDICATOR_HISTORY_LABELS.noNotes,
  ].join(' · ');

  return (
    <View className="gap-1" accessible>
      <Text className="text-body font-heading-semibold text-foreground">
        {record.value} {record.unit}
      </Text>
      <Text className="text-small font-body text-muted-foreground">{details}</Text>
    </View>
  );
}

type MeasurementListProps = {
  /** del más reciente al más antiguo */
  records: HealthIndicatorRecord[];
};

export function MeasurementList({ records }: MeasurementListProps) {
  return (
    <View className="bg-card border-border gap-5 rounded-3xl border p-5 shadow-lg shadow-black/5">
      {records.map((record) => (
        <MeasurementRow key={record.id} record={record} />
      ))}
    </View>
  );
}

// features/medical-record/screens/LabDetailScreen.tsx
import { useLocalSearchParams } from 'expo-router';
import { FileX } from '@/lib/icons';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { InfoRowsCard, type InfoRow } from '@/components/ui/info-rows-card';
import { NoticeCard } from '@/components/ui/notice-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { LAB_STATUS_LABELS, MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { formatIsoDateShort } from '@/lib/date-format';
import type { LabResult } from '../api/mock-medical-record';
import { ScanImage } from '../components/ScanImage';
import { joinParts } from '../domain/clinical-summary';
import { labShareContent } from '../domain/share-content';
import { useLab } from '../hooks/useMedicalRecord';
import { useShareRecord } from '../hooks/useShareRecord';

const labels = MEDICAL_RECORD_LABELS.labs.detail;

export default function LabDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: lab, isLoading } = useLab(id);

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.labDetail} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-10">
        {isLoading ? (
          <View className="gap-5">
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-72 w-full rounded-3xl" />
          </View>
        ) : lab ? (
          <LabDetail lab={lab} />
        ) : (
          <Text className="text-body text-muted-foreground py-10 text-center">
            {labels.notFound}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

function LabDetail({ lab }: { lab: LabResult }) {
  const shareRecord = useShareRecord();
  const details = labDetails(lab);

  return (
    <>
      <View className="bg-primary/5 border-primary/20 gap-1 rounded-3xl border p-5">
        <Text className="text-caption font-body-semibold text-primary tracking-widest uppercase">
          {labels.eyebrow}
        </Text>
        <Text className="text-h3 font-heading text-foreground">{lab.name}</Text>
        <Text className="text-small font-body text-muted-foreground">
          {joinParts([formatIsoDateShort(lab.issuedAt), LAB_STATUS_LABELS[lab.status]])}
        </Text>
      </View>

      {lab.imageUri ? (
        <ScanImage uri={lab.imageUri} label={lab.name} />
      ) : (
        <EmptyStateCard
          icon={FileX}
          title={labels.noImageTitle}
          description={labels.noImageDescription}
        />
      )}

      {details.length > 0 && <InfoRowsCard rows={details} />}

      <NoticeCard title={labels.noticeTitle} message={labels.noticeMessage} />

      <Button
        variant="outline"
        size="lg"
        className="border-primary"
        onPress={() => shareRecord(labShareContent(lab, LAB_STATUS_LABELS[lab.status]))}
      >
        <Text className="text-body font-heading-semibold text-primary">{labels.share}</Text>
      </Button>
    </>
  );
}

/** Filas con los datos que el examen sí tiene registrados. */
function labDetails(lab: LabResult): InfoRow[] {
  const rows: InfoRow[] = [];
  if (lab.resultValue) {
    rows.push({ id: 'result', title: labels.resultLabel, subtitle: lab.resultValue });
  }
  if (lab.notes) rows.push({ id: 'notes', title: labels.notesLabel, subtitle: lab.notes });
  return rows;
}

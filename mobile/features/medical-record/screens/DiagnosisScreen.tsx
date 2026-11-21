// features/medical-record/screens/DiagnosisScreen.tsx
import { router } from 'expo-router';
import { Stethoscope } from '@/lib/icons';
import { ScrollView, View } from 'react-native';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { FooterButton } from '@/components/ui/footer-button';
import { InfoRowsCard } from '@/components/ui/info-rows-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { describeDiagnosis } from '../domain/record-format';
import { useDiagnoses } from '../hooks/useMedicalRecord';
import { recordRoutes } from '../routes';

const labels = MEDICAL_RECORD_LABELS.diagnosis;

export default function DiagnosisScreen() {
  const { data: diagnoses, isLoading } = useDiagnoses();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.diagnosis} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-6">
        {isLoading ? (
          <Skeleton className="h-60 w-full rounded-3xl" />
        ) : diagnoses && diagnoses.length > 0 ? (
          <InfoRowsCard
            rows={diagnoses.map((diagnosis) => ({
              id: diagnosis.id,
              title: diagnosis.name,
              subtitle: describeDiagnosis(diagnosis),
            }))}
          />
        ) : (
          <EmptyStateCard
            icon={Stethoscope}
            title={labels.emptyTitle}
            description={labels.emptyDescription}
          />
        )}
      </ScrollView>

      <FooterButton label={labels.add} onPress={() => router.push(recordRoutes.newDiagnosis)} />
    </View>
  );
}

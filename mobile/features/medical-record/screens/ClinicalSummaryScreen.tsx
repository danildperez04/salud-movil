// features/medical-record/screens/ClinicalSummaryScreen.tsx
import { Phone } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { InfoRowsCard } from '@/components/ui/info-rows-card';
import { ListItemCard } from '@/components/ui/list-item-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { PatientCard } from '../components/PatientCard';
import { joinParts } from '../domain/clinical-summary';
import { useClinicalSummary } from '../hooks/useClinicalSummary';

const labels = MEDICAL_RECORD_LABELS.summary;

export default function ClinicalSummaryScreen() {
  const { isLoading, patientName, updatedAt, rows, emergencyContact } = useClinicalSummary();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.clinicalSummary} align="center" />

      <ScrollView contentContainerClassName="gap-6 px-6 pt-2 pb-10">
        <PatientCard name={patientName} updatedAt={updatedAt} />

        {isLoading ? (
          <View className="gap-6">
            <Skeleton className="h-72 w-full rounded-3xl" />
            <Skeleton className="h-24 w-full rounded-3xl" />
          </View>
        ) : (
          <>
            <View className="gap-3">
              <SectionHeader title={labels.generalInfo} />
              <InfoRowsCard rows={rows} />
            </View>

            <View className="gap-3">
              <SectionHeader title={labels.emergencyContact} />
              {emergencyContact ? (
                <ListItemCard
                  icon={Phone}
                  title={emergencyContact.name}
                  subtitle={joinParts([emergencyContact.relation, emergencyContact.phone])}
                />
              ) : (
                <Text className="text-small font-body text-muted-foreground px-1">
                  {labels.noEmergencyContact}
                </Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

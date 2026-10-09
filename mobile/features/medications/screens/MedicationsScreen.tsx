// features/medications/screens/MedicationsScreen.tsx
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { MEDICATIONS_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { TodayDosesCard } from '@/features/reminders/components/TodayDosesCard';
import { MedicationCard } from '../components/MedicationCard';
import { MedicationTipCard } from '../components/MedicationTipCard';
import { sortMedications } from '../domain/medication-form';
import { useMedications, useToggleMedication } from '../hooks/useMedications';

export default function MedicationsScreen() {
  const { data, isLoading } = useMedications();
  const toggleMedication = useToggleMedication();

  const medications = useMemo(() => (data ? sortMedications(data) : []), [data]);
  const activeCount = medications.filter((medication) => medication.active).length;

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.medications} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-10">
        <TodayDosesCard />

        {isLoading ? (
          <View className="gap-5">
            <Skeleton className="h-36 w-full rounded-3xl" />
            <Skeleton className="h-36 w-full rounded-3xl" />
            <Skeleton className="h-36 w-full rounded-3xl" />
          </View>
        ) : medications.length > 0 ? (
          <>
            <SectionHeader
              title={MEDICATIONS_LABELS.listTitle}
              subtitle={MEDICATIONS_LABELS.activeCount(activeCount, medications.length)}
            />
            {medications.map((medication) => (
              <MedicationCard
                key={medication.id}
                drugName={medication.drugName}
                dose={medication.dose}
                quantityLabel={medication.quantityLabel}
                frequency={medication.frequency}
                time={medication.time}
                active={medication.active}
                onToggleActive={(active) => toggleMedication.mutate({ id: medication.id, active })}
              />
            ))}
          </>
        ) : (
          <Text className="text-body text-muted-foreground py-6 text-center">
            {MEDICATIONS_LABELS.empty}
          </Text>
        )}

        <View className="mt-3 gap-5">
          <MedicationTipCard />

          <Button size="lg" onPress={() => router.push('/(app)/medications/new')}>
            <Plus size={20} color="#FFFFFF" />
            <Text className="text-body text-primary-foreground">
              {MEDICATIONS_LABELS.addButton}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

// features/medications/screens/MedicationsScreen.tsx
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { SummaryTabsList, type SummaryTab } from '@/components/ui/summary-tabs-list';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { MEDICATIONS_LABELS, SCREEN_TITLES, SUMMARY_TABS_LABELS } from '@/constants/labels';
import { MedicationCard } from '../components/MedicationCard';
import { MedicationTipCard } from '../components/MedicationTipCard';
import { useMedications, useToggleMedication } from '../hooks/useMedications';

export default function MedicationsScreen() {
  const [tab, setTab] = useState<SummaryTab>('summary');
  const { data: medications, isLoading } = useMedications();
  const toggleMedication = useToggleMedication();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.medications} align="center" />

      <Tabs value={tab} onValueChange={(value) => setTab(value as SummaryTab)} className="flex-1">
        <SummaryTabsList value={tab} />

        <TabsContent value="summary" className="flex-1">
          <ScrollView contentContainerClassName="gap-5 px-6 pt-6 pb-10">
            {isLoading ? (
              <View className="gap-5">
                <Skeleton className="h-36 w-full rounded-3xl" />
                <Skeleton className="h-36 w-full rounded-3xl" />
                <Skeleton className="h-36 w-full rounded-3xl" />
              </View>
            ) : medications?.length ? (
              medications.map((medication) => (
                <MedicationCard
                  key={medication.id}
                  drugName={medication.drugName}
                  dose={medication.dose}
                  quantityLabel={medication.quantityLabel}
                  time={medication.time}
                  active={medication.active}
                  onToggleActive={(active) =>
                    toggleMedication.mutate({ id: medication.id, active })
                  }
                />
              ))
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
        </TabsContent>

        <TabsContent value="history" className="flex-1">
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-body text-muted-foreground text-center">
              {SUMMARY_TABS_LABELS.historyPlaceholder}
            </Text>
          </View>
        </TabsContent>
      </Tabs>
    </View>
  );
}

// features/medications/screens/MedicationsScreen.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { MEDICATIONS_LABELS, SCREEN_TITLES, SUMMARY_TABS_LABELS } from '@/constants/labels';
import { fetchMockMedications, toggleMockMedicationActive } from '../api/mock-medications';
import { MedicationCard } from '../components/MedicationCard';

export default function MedicationsScreen() {
  const [tab, setTab] = useState<'summary' | 'history'>('summary');
  const queryClient = useQueryClient();

  // TODO: reemplazar fetchMockMedications por apiClient.get('/medications')
  // cuando el backend exponga el endpoint.
  const { data: medications, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: fetchMockMedications,
  });

  // TODO: reemplazar por apiClient.patch('/medications/:id', { active })
  const toggleActive = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleMockMedicationActive(id, active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medications'] }),
  });

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.medications} />

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as 'summary' | 'history')}
        className="flex-1"
      >
        <TabsList className="mx-6">
          <TabsTrigger value="summary" className="flex-1">
            <Text>{SUMMARY_TABS_LABELS.summary}</Text>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            <Text>{SUMMARY_TABS_LABELS.history}</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="flex-1">
          <ScrollView contentContainerClassName="gap-3 p-6">
            {isLoading ? (
              <View className="gap-3">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </View>
            ) : (
              medications?.map((medication) => (
                <MedicationCard
                  key={medication.id}
                  drugName={medication.drugName}
                  dose={medication.dose}
                  quantityLabel={medication.quantityLabel}
                  time={medication.time}
                  active={medication.active}
                  onToggleActive={(value) =>
                    toggleActive.mutate({ id: medication.id, active: value })
                  }
                />
              ))
            )}

            <View className="bg-muted/40 flex-row items-center gap-4 rounded-2xl p-4">
              <View className="bg-background h-11 w-11 items-center justify-center rounded-full">
                <Bell size={20} color="#2DB79A" />
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-body font-heading-medium text-foreground">
                  {MEDICATIONS_LABELS.tipTitle}
                </Text>
                <Text className="text-small font-body text-muted-foreground">
                  {MEDICATIONS_LABELS.tipSubtitle}
                </Text>
              </View>
            </View>
          </ScrollView>
        </TabsContent>

        <TabsContent value="history" className="flex-1">
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-body text-muted-foreground text-center">
              El historial estará disponible próximamente
            </Text>
          </View>
        </TabsContent>
      </Tabs>
    </View>
  );
}

// features/appointments/screens/AppointmentsScreen.tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { SummaryTabsList, type SummaryTab } from '@/components/ui/summary-tabs-list';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { APPOINTMENTS_LABELS, SCREEN_TITLES, SUMMARY_TABS_LABELS } from '@/constants/labels';
import { AppointmentCard } from '../components/AppointmentCard';
import { parseLocalDate } from '../domain/appointment-date';
import { useAppointments } from '../hooks/useAppointments';

export default function AppointmentsScreen() {
  const [tab, setTab] = useState<SummaryTab>('summary');
  const { data: appointments, isLoading } = useAppointments();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.appointments} align="center" />

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
            ) : (
              appointments?.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  date={parseLocalDate(appointment.date)}
                  specialty={appointment.specialty}
                  doctorName={appointment.doctorName}
                  time={appointment.time}
                  status={appointment.status}
                  onPress={() => router.push(`/(app)/appointments/${appointment.id}`)}
                />
              ))
            )}

            {/* TODO: la ruta /appointments/new (formulario de agendado) aún no existe */}
            <Button
              size="lg"
              className="mt-2"
              onPress={() => router.push('/(app)/appointments/new')}
            >
              <Text className="text-body text-primary-foreground">
                {APPOINTMENTS_LABELS.bookButton}
              </Text>
            </Button>
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

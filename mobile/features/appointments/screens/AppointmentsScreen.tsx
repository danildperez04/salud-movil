// features/appointments/screens/AppointmentsScreen.tsx
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { APPOINTMENTS_LABELS, SCREEN_TITLES, SUMMARY_TABS_LABELS } from '@/constants/labels';
import { fetchMockAppointments } from '../api/mock-appointments';
import { AppointmentCard } from '../components/AppointmentCard';

export default function AppointmentsScreen() {
  const [tab, setTab] = useState<'summary' | 'history'>('summary');

  // TODO: reemplazar fetchMockAppointments por apiClient.get('/appointments')
  // cuando el backend exponga el endpoint.
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchMockAppointments,
  });

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.appointments} />

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
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </View>
            ) : (
              appointments?.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  date={new Date(appointment.date)}
                  specialty={appointment.specialty}
                  doctorName={appointment.doctorName}
                  time={appointment.time}
                  status={appointment.status}
                />
              ))
            )}

            {/* TODO: crear pantalla /(app)/appointments/new con el Stepper
                que ya armamos (Especialidad → Profesional → Fecha → Confirmar) */}
            <Button className="mt-2" onPress={() => router.push('/(app)/appointments/new')}>
              <Text>{APPOINTMENTS_LABELS.bookButton}</Text>
            </Button>
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

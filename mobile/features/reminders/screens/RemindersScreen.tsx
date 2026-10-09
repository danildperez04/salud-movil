// features/reminders/screens/RemindersScreen.tsx
import { router } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { UnderlineTabs, type UnderlineTabOption } from '@/components/ui/underline-tabs';
import { REMINDERS_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { formatDayMonth, timeLabelToMinutes } from '@/lib/date-format';
import { parseLocalDate } from '@/features/appointments/domain/appointment-date';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import { useMedications } from '@/features/medications/hooks/useMedications';
import { ReminderCard } from '../components/ReminderCard';
import { describeDays } from '../domain/reminder-days';
import { getAppointmentDateTime } from '../domain/reminder-forms';
import { useAppointmentReminders, useMedicationReminders } from '../hooks/useReminders';
import { reminderRoutes } from '../routes';

type ReminderTab = 'medications' | 'appointments';

const TAB_OPTIONS: UnderlineTabOption<ReminderTab>[] = [
  { value: 'medications', label: REMINDERS_LABELS.tabs.medications },
  { value: 'appointments', label: REMINDERS_LABELS.tabs.appointments },
];

export default function RemindersScreen() {
  const [tab, setTab] = useState<ReminderTab>('medications');

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.reminders} align="center" />
      <UnderlineTabs options={TAB_OPTIONS} value={tab} onValueChange={setTab} />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-5 pb-6">
        <Text className="text-small font-body text-secondary-steel px-1">
          {REMINDERS_LABELS.helper[tab]}
        </Text>
        {tab === 'medications' ? <MedicationReminders /> : <AppointmentReminders />}
      </ScrollView>

      <View className="px-6 pt-2 pb-8">
        <Button
          size="lg"
          className="h-14"
          onPress={() =>
            router.push(
              tab === 'medications' ? reminderRoutes.newMedication : reminderRoutes.newAppointment,
            )
          }
        >
          <Text className="text-body text-primary-foreground">{REMINDERS_LABELS.addButton}</Text>
        </Button>
      </View>
    </View>
  );
}

function ListSkeleton() {
  return (
    <View className="gap-5">
      <Skeleton className="h-28 w-full rounded-3xl" />
      <Skeleton className="h-28 w-full rounded-3xl" />
      <Skeleton className="h-28 w-full rounded-3xl" />
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  return <Text className="text-body text-muted-foreground py-10 text-center">{message}</Text>;
}

function MedicationReminders() {
  const { data: reminders, isLoading: loadingReminders } = useMedicationReminders();
  const { data: medications, isLoading: loadingMedications } = useMedications();

  const items = useMemo(() => {
    if (!reminders || !medications) return [];
    return reminders
      .flatMap((reminder) => {
        const medication = medications.find((m) => m.id === reminder.medicationId);
        return medication ? [{ reminder, medication }] : [];
      })
      .sort((a, b) => timeLabelToMinutes(a.reminder.time) - timeLabelToMinutes(b.reminder.time));
  }, [reminders, medications]);

  if (loadingReminders || loadingMedications) return <ListSkeleton />;
  if (items.length === 0) return <EmptyState message={REMINDERS_LABELS.emptyMedications} />;

  return items.map(({ reminder, medication }) => (
    <ReminderCard
      key={reminder.id}
      title={`${medication.drugName} ${medication.dose}`}
      description={`${reminder.time} - ${describeDays(reminder.days)}`}
      active={reminder.enabled}
      onPress={() => router.push(reminderRoutes.editMedication(reminder.id))}
    />
  ));
}

function AppointmentReminders() {
  const { data: reminders, isLoading: loadingReminders } = useAppointmentReminders();
  const { data: appointments, isLoading: loadingAppointments } = useAppointments();

  const items = useMemo(() => {
    if (!reminders || !appointments) return [];
    return reminders
      .flatMap((reminder) => {
        const appointment = appointments.find((a) => a.id === reminder.appointmentId);
        return appointment ? [{ reminder, appointment }] : [];
      })
      .sort(
        (a, b) =>
          getAppointmentDateTime(a.appointment).getTime() -
          getAppointmentDateTime(b.appointment).getTime(),
      );
  }, [reminders, appointments]);

  if (loadingReminders || loadingAppointments) return <ListSkeleton />;
  if (items.length === 0) return <EmptyState message={REMINDERS_LABELS.emptyAppointments} />;

  return items.map(({ reminder, appointment }) => (
    <ReminderCard
      key={reminder.id}
      icon={Calendar}
      title={appointment.title}
      description={`${formatDayMonth(parseLocalDate(appointment.date))} · Avisar ${REMINDERS_LABELS.appointment.notifyBefore[reminder.notifyBefore].toLowerCase()}`}
      active={reminder.pushEnabled}
      onPress={() => router.push(reminderRoutes.editAppointment(reminder.id))}
    />
  ));
}

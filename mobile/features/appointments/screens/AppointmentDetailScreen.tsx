// features/appointments/screens/AppointmentDetailScreen.tsx
import { useLocalSearchParams } from 'expo-router';
import { Alert, Linking, ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { APPOINTMENTS_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { cn } from '@/lib/utils';
import { InfoTile } from '@/components/ui/info-tile';
import { usePatientMe } from '@/features/profile/hooks/usePatientMe';
import { useAppointmentReminderToggle } from '@/features/reminders/hooks/useReminders';
import { formatLongDate, parseLocalDate } from '../domain/appointment-date';
import type { AppointmentRecord } from '../domain/appointment-record';
import { getAppointmentStatus, isCancellable } from '../domain/appointment-status';
import { useAppointment, useCancelAppointment } from '../hooks/useAppointments';

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: appointment, isLoading } = useAppointment(id);

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.appointmentDetail} align="center" />

      <ScrollView contentContainerClassName="gap-6 px-6 pt-4 pb-10">
        {isLoading ? (
          <View className="gap-6">
            <Skeleton className="h-36 w-full rounded-3xl" />
            <Skeleton className="h-52 w-full rounded-3xl" />
          </View>
        ) : appointment ? (
          <AppointmentDetail appointment={appointment} />
        ) : (
          <Text className="text-body text-muted-foreground py-10 text-center">
            {APPOINTMENTS_LABELS.notFound}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

function AppointmentDetail({ appointment }: { appointment: AppointmentRecord }) {
  const cancelAppointment = useCancelAppointment();
  const reminder = useAppointmentReminderToggle(appointment.id);
  const { data: patient } = usePatientMe();

  const status = getAppointmentStatus(appointment.status);
  // la API no trae el lugar: las citas son en el centro de salud del paciente
  const location = appointment.location ?? patient?.healthCenterName;

  const openDirections = () => {
    if (!location) return;
    const query = encodeURIComponent(location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const confirmCancel = () => {
    Alert.alert(APPOINTMENTS_LABELS.cancelConfirmTitle, APPOINTMENTS_LABELS.cancelConfirmMessage, [
      { text: APPOINTMENTS_LABELS.cancelConfirmKeep, style: 'cancel' },
      {
        text: APPOINTMENTS_LABELS.cancelButton,
        style: 'destructive',
        onPress: () => cancelAppointment.mutate(appointment),
      },
    ]);
  };

  return (
    <>
      <View className="bg-primary/5 border-primary/20 gap-1 rounded-3xl border p-6">
        <Text
          className={cn('text-caption font-body-semibold tracking-widest uppercase', status.text)}
        >
          {status.label}
        </Text>
        <Text className="text-h3 font-heading text-foreground">{appointment.title}</Text>
        <Text className="text-small font-body text-muted-foreground">{appointment.doctorName}</Text>
      </View>

      <View className="gap-3">
        <Text className="text-body font-heading-semibold text-foreground">
          {APPOINTMENTS_LABELS.infoTitle}
        </Text>
        <View className="flex-row gap-3">
          <InfoTile
            className="flex-1"
            label={APPOINTMENTS_LABELS.dateLabel}
            value={formatLongDate(parseLocalDate(appointment.date))}
          />
          <InfoTile
            className="flex-1"
            label={APPOINTMENTS_LABELS.timeLabel}
            value={appointment.time}
          />
        </View>
        {location && <InfoTile label={APPOINTMENTS_LABELS.placeLabel} value={location} />}
        {appointment.reason && (
          <InfoTile label={APPOINTMENTS_LABELS.reasonLabel} value={appointment.reason} />
        )}
      </View>

      <View className="bg-card border-border flex-row items-center justify-between gap-4 rounded-3xl border p-5 shadow-lg shadow-black/5">
        <View className="flex-1 gap-1">
          <Text className="text-body font-heading-semibold text-foreground">
            {APPOINTMENTS_LABELS.reminderTitle}
          </Text>
          <Text className="text-small font-body text-muted-foreground">
            {APPOINTMENTS_LABELS.reminderSubtitle}
          </Text>
        </View>
        <Switch
          checked={reminder.enabled}
          onCheckedChange={reminder.setEnabled}
          aria-label={APPOINTMENTS_LABELS.reminderTitle}
        />
      </View>

      <View className="gap-3">
        {location && (
          <Button variant="outline" size="lg" className="border-primary" onPress={openDirections}>
            <Text className="text-body font-heading-semibold text-primary">
              {APPOINTMENTS_LABELS.directionsButton}
            </Text>
          </Button>
        )}

        {isCancellable(appointment.status) && (
          <Button
            variant="outline"
            size="lg"
            className="border-destructive/50"
            onPress={confirmCancel}
            disabled={cancelAppointment.isPending}
          >
            <Text className="text-body font-heading-semibold text-destructive">
              {APPOINTMENTS_LABELS.cancelButton}
            </Text>
          </Button>
        )}

        {cancelAppointment.isError && (
          <Text className="text-small text-destructive text-center">
            {APPOINTMENTS_LABELS.cancelError}
          </Text>
        )}
      </View>
    </>
  );
}

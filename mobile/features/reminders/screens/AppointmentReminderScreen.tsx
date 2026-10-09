// features/reminders/screens/AppointmentReminderScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, View } from 'react-native';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FIELD_CLASS_NAME, FormField } from '@/components/ui/form-field';
import { IntroCard } from '@/components/ui/intro-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { SwitchRowsCard } from '@/components/ui/switch-rows-card';
import { Text } from '@/components/ui/text';
import { COMMON_LABELS, REMINDERS_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { formatDayMonth } from '@/lib/date-format';
import type { AppointmentRecord } from '@/features/appointments/api/mock-appointments';
import { parseLocalDate } from '@/features/appointments/domain/appointment-date';
import { isCancellable } from '@/features/appointments/domain/appointment-status';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import type { AppointmentReminder } from '../api/mock-reminders';
import {
  NOTIFY_BEFORE_OPTIONS,
  appointmentReminderSchema,
  isAppointmentUpcoming,
  isReminderTimePassed,
  type AppointmentReminderFormValues,
} from '../domain/reminder-forms';
import {
  useAppointmentReminders,
  useDeleteAppointmentReminder,
  useSaveAppointmentReminder,
} from '../hooks/useReminders';

const { appointment: labels } = REMINDERS_LABELS;

/** "Medicina General · 15 mayo · 10:00 AM" */
const describeAppointment = (appointment: AppointmentRecord) =>
  `${appointment.specialty} · ${formatDayMonth(parseLocalDate(appointment.date))} · ${appointment.time}`;

export default function AppointmentReminderScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: reminders, isLoading: loadingReminders } = useAppointmentReminders();
  const { data: appointments, isLoading: loadingAppointments } = useAppointments();

  const reminder = id ? reminders?.find((r) => r.id === id) : undefined;
  const isLoading = loadingReminders || loadingAppointments;

  // Citas sobre las que tiene sentido avisar: siguen activas y aún no ocurrieron.
  // Al editar se conserva siempre la cita del recordatorio.
  const selectable = (appointments ?? []).filter(
    (appointment) =>
      appointment.id === reminder?.appointmentId ||
      (isCancellable(appointment.status) && isAppointmentUpcoming(appointment)),
  );

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.appointmentReminder} align="center" />

      {isLoading ? (
        <View className="gap-6 px-6 pt-2">
          <Skeleton className="h-24 w-full rounded-3xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </View>
      ) : id && !reminder ? (
        <Text className="text-body text-muted-foreground px-6 py-10 text-center">
          {REMINDERS_LABELS.notFound}
        </Text>
      ) : selectable.length === 0 ? (
        <View className="items-center gap-4 px-6 py-10">
          <Text className="text-body text-muted-foreground text-center">
            {labels.noAppointments}
          </Text>
          <Button onPress={() => router.replace('/(app)/appointments/new')}>
            <Text className="text-body text-primary-foreground">{labels.bookAppointment}</Text>
          </Button>
        </View>
      ) : (
        <AppointmentReminderForm
          reminder={reminder}
          appointments={selectable}
          usedAppointmentIds={reminders?.map((r) => r.appointmentId) ?? []}
        />
      )}
    </View>
  );
}

type AppointmentReminderFormProps = {
  /** undefined al crear uno nuevo */
  reminder?: AppointmentReminder;
  appointments: AppointmentRecord[];
  usedAppointmentIds: string[];
};

function AppointmentReminderForm({
  reminder,
  appointments,
  usedAppointmentIds,
}: AppointmentReminderFormProps) {
  const isEditing = !!reminder;
  const saveReminder = useSaveAppointmentReminder();
  const deleteReminder = useDeleteAppointmentReminder();

  const defaultAppointmentId =
    appointments.find((a) => !usedAppointmentIds.includes(a.id))?.id ?? appointments[0].id;

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AppointmentReminderFormValues>({
    resolver: zodResolver(appointmentReminderSchema),
    defaultValues: reminder ?? {
      appointmentId: defaultAppointmentId,
      notifyBefore: 'same-day',
      pushEnabled: true,
      secondNotice: false,
    },
  });

  const values = useWatch({ control });

  const onSubmit = (form: AppointmentReminderFormValues) => {
    const appointment = appointments.find((a) => a.id === form.appointmentId);

    // el aviso principal no puede quedar en el pasado respecto a la cita elegida
    if (appointment && form.pushEnabled && isReminderTimePassed(appointment, form.notifyBefore)) {
      setError('notifyBefore', { message: labels.errors.triggerPassed });
      return;
    }

    saveReminder.mutate(
      {
        id: reminder?.id,
        appointmentId: form.appointmentId,
        notifyBefore: form.notifyBefore,
        pushEnabled: form.pushEnabled,
        secondNotice: form.secondNotice,
      },
      { onSuccess: () => router.back() },
    );
  };

  const confirmDelete = () => {
    if (!reminder) return;
    Alert.alert(REMINDERS_LABELS.deleteConfirmTitle, REMINDERS_LABELS.deleteConfirmMessage, [
      { text: COMMON_LABELS.cancel, style: 'cancel' },
      {
        text: REMINDERS_LABELS.deleteButton,
        style: 'destructive',
        onPress: () => deleteReminder.mutate(reminder.id, { onSuccess: () => router.back() }),
      },
    ]);
  };

  const isBusy = saveReminder.isPending || deleteReminder.isPending;

  return (
    <>
      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <IntroCard title={labels.introTitle} description={labels.introDescription} />

        <FormField label={labels.appointmentLabel} error={errors.appointmentId?.message}>
          <Controller
            control={control}
            name="appointmentId"
            render={({ field: { onChange, value } }) => {
              const current = appointments.find((a) => a.id === value);
              return (
                <Select
                  value={current ? { value, label: describeAppointment(current) } : undefined}
                  onValueChange={(option) => option && onChange(option.value)}
                >
                  <SelectTrigger className={FIELD_CLASS_NAME} disabled={isEditing}>
                    <SelectValue
                      className="text-body"
                      placeholder={labels.appointmentPlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {appointments.map((appointment) => (
                      <SelectItem
                        key={appointment.id}
                        label={describeAppointment(appointment)}
                        value={appointment.id}
                      />
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
        </FormField>

        <FormField label={labels.whenLabel} error={errors.notifyBefore?.message}>
          <Controller
            control={control}
            name="notifyBefore"
            render={({ field: { onChange, value } }) => (
              <Select
                value={{ value, label: labels.notifyBefore[value] }}
                onValueChange={(option) => {
                  if (option) onChange(option.value);
                }}
              >
                <SelectTrigger className={FIELD_CLASS_NAME}>
                  <SelectValue className="text-body" placeholder={labels.notifyBefore[value]} />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFY_BEFORE_OPTIONS.map((option) => (
                    <SelectItem key={option} label={labels.notifyBefore[option]} value={option} />
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <SwitchRowsCard
          rows={[
            {
              id: 'push',
              title: labels.pushTitle,
              subtitle: labels.pushSubtitle,
              checked: !!values.pushEnabled,
              onCheckedChange: (checked) => setValue('pushEnabled', checked, { shouldDirty: true }),
            },
            {
              id: 'second',
              title: labels.secondTitle,
              subtitle: labels.secondSubtitle,
              checked: !!values.secondNotice,
              onCheckedChange: (checked) =>
                setValue('secondNotice', checked, { shouldDirty: true }),
            },
          ]}
        />

        {(saveReminder.isError || deleteReminder.isError) && (
          <Text className="text-small text-destructive">{REMINDERS_LABELS.saveError}</Text>
        )}

        {isEditing && (
          <Button
            variant="outline"
            size="lg"
            className="border-destructive/50"
            onPress={confirmDelete}
            disabled={isBusy}
          >
            <Text className="text-body font-heading-semibold text-destructive">
              {REMINDERS_LABELS.deleteButton}
            </Text>
          </Button>
        )}
      </ScrollView>

      <View className="px-6 pt-2 pb-8">
        <Button size="lg" className="h-14" onPress={handleSubmit(onSubmit)} disabled={isBusy}>
          {saveReminder.isPending ? (
            <Spinner size="sm" color="#FFFFFF" />
          ) : (
            <Text className="text-body text-primary-foreground">{REMINDERS_LABELS.save}</Text>
          )}
        </Button>
      </View>
    </>
  );
}

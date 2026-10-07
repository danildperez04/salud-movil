// features/reminders/screens/MedicationReminderScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, Pill } from 'lucide-react-native';
import { Alert, ScrollView, View } from 'react-native';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FIELD_CLASS_NAME, FormField, PickerField } from '@/components/ui/form-field';
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
import {
  COMMON_LABELS,
  MEDICATIONS_LABELS,
  REMINDERS_LABELS,
  SCREEN_TITLES,
} from '@/constants/labels';
import { useDateTimePicker } from '@/hooks/useDateTimePicker';
import { formatTime12h, timeLabelToDate } from '@/lib/date-format';
import { colors } from '@/lib/tokens';
import type { MedicationRecord } from '@/features/medications/api/mock-medications';
import { useMedications } from '@/features/medications/hooks/useMedications';
import { WeekdayPicker } from '../components/WeekdayPicker';
import type { MedicationReminder } from '../api/mock-reminders';
import {
  ALL_DAYS,
  FREQUENCY_PRESETS,
  PRESET_DAYS,
  getFrequencyPreset,
  toggleDay,
} from '../domain/reminder-days';
import {
  medicationReminderSchema,
  type MedicationReminderFormValues,
} from '../domain/reminder-forms';
import {
  useDeleteMedicationReminder,
  useMedicationReminders,
  useSaveMedicationReminder,
} from '../hooks/useReminders';

const { medication: labels } = REMINDERS_LABELS;

/** Hora con la que arranca un recordatorio nuevo. */
const DEFAULT_HOUR = 8;
/** Opciones del selector: "personalizado" no se elige, aparece solo al tocar los días. */
const PRESET_OPTIONS = FREQUENCY_PRESETS.filter((preset) => preset !== 'custom');

export default function MedicationReminderScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: reminders, isLoading: loadingReminders } = useMedicationReminders();
  const { data: medications, isLoading: loadingMedications } = useMedications();

  const reminder = id ? reminders?.find((r) => r.id === id) : undefined;
  const isLoading = loadingReminders || loadingMedications;

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.medicationReminder} align="center" />

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
      ) : !medications?.length ? (
        <View className="items-center gap-4 px-6 py-10">
          <Text className="text-body text-muted-foreground text-center">
            {labels.noMedications}
          </Text>
          <Button onPress={() => router.replace('/(app)/medications/new')}>
            <Text className="text-body text-primary-foreground">{labels.addMedication}</Text>
          </Button>
        </View>
      ) : (
        <MedicationReminderForm
          reminder={reminder}
          medications={medications}
          // medicamentos que ya tienen recordatorio: el nuevo arranca con uno que no
          usedMedicationIds={reminders?.map((r) => r.medicationId) ?? []}
        />
      )}
    </View>
  );
}

type MedicationReminderFormProps = {
  /** undefined al crear uno nuevo */
  reminder?: MedicationReminder;
  medications: MedicationRecord[];
  usedMedicationIds: string[];
};

function MedicationReminderForm({
  reminder,
  medications,
  usedMedicationIds,
}: MedicationReminderFormProps) {
  const isEditing = !!reminder;
  const saveReminder = useSaveMedicationReminder();
  const deleteReminder = useDeleteMedicationReminder();

  const defaultMedicationId =
    medications.find((m) => !usedMedicationIds.includes(m.id))?.id ?? medications[0].id;

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<MedicationReminderFormValues>({
    resolver: zodResolver(medicationReminderSchema),
    defaultValues: reminder
      ? {
          medicationId: reminder.medicationId,
          time: timeLabelToDate(reminder.time),
          days: reminder.days,
          enabled: reminder.enabled,
          repeatIfUnconfirmed: reminder.repeatIfUnconfirmed,
        }
      : {
          medicationId: defaultMedicationId,
          time: timeLabelToDate(`${DEFAULT_HOUR}:00 AM`),
          days: ALL_DAYS,
          enabled: true,
          repeatIfUnconfirmed: false,
        },
  });

  const values = useWatch({ control });
  const selectedMedication = medications.find((m) => m.id === values.medicationId);
  const days = values.days ?? [];
  const preset = getFrequencyPreset(days);

  const { open: openPicker, renderIosPicker } = useDateTimePicker({
    fields: { time: { mode: 'time' } },
    getValue: (field) => getValues(field),
    onChange: (field, selected) =>
      setValue(field, selected, { shouldValidate: isSubmitted, shouldDirty: true }),
  });

  const onSubmit = (form: MedicationReminderFormValues) => {
    saveReminder.mutate(
      {
        id: reminder?.id,
        medicationId: form.medicationId,
        time: formatTime12h(form.time),
        days: form.days,
        enabled: form.enabled,
        repeatIfUnconfirmed: form.repeatIfUnconfirmed,
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
        <FormField label={labels.medicationLabel} error={errors.medicationId?.message}>
          <Controller
            control={control}
            name="medicationId"
            render={({ field: { onChange, value } }) => (
              <Select
                value={
                  selectedMedication
                    ? {
                        value,
                        label: `${selectedMedication.drugName} ${selectedMedication.dose}`,
                      }
                    : undefined
                }
                onValueChange={(option) => option && onChange(option.value)}
              >
                {/* en vez del campo de texto habitual, el trigger es la tarjeta del medicamento */}
                <SelectTrigger
                  className="bg-card border-border h-auto rounded-3xl p-4 shadow-lg shadow-black/5"
                  disabled={isEditing}
                >
                  {selectedMedication ? (
                    <MedicationSummary medication={selectedMedication} />
                  ) : (
                    <SelectValue className="text-body" placeholder={labels.medicationPlaceholder} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {medications.map((medication) => (
                    <SelectItem
                      key={medication.id}
                      label={`${medication.drugName} ${medication.dose}`}
                      value={medication.id}
                    />
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label={labels.timeLabel} error={errors.time?.message}>
          <PickerField
            icon={Clock}
            value={values.time ? formatTime12h(values.time) : undefined}
            onPress={() => openPicker('time')}
          />
          {renderIosPicker('time')}
        </FormField>

        <FormField label={labels.frequencyLabel} error={errors.days?.message}>
          <Select
            value={{ value: preset, label: REMINDERS_LABELS.presets[preset] }}
            onValueChange={(option) => {
              const next = option?.value as keyof typeof PRESET_DAYS | undefined;
              if (next && next in PRESET_DAYS) {
                setValue('days', PRESET_DAYS[next], {
                  shouldValidate: isSubmitted,
                  shouldDirty: true,
                });
              }
            }}
          >
            <SelectTrigger className={FIELD_CLASS_NAME}>
              <SelectValue className="text-body" placeholder={REMINDERS_LABELS.presets[preset]} />
            </SelectTrigger>
            <SelectContent>
              {PRESET_OPTIONS.map((option) => (
                <SelectItem key={option} label={REMINDERS_LABELS.presets[option]} value={option} />
              ))}
            </SelectContent>
          </Select>
          <View className="pt-2">
            <WeekdayPicker
              selected={days}
              onToggle={(day) =>
                setValue('days', toggleDay(getValues('days'), day), {
                  shouldValidate: isSubmitted,
                  shouldDirty: true,
                })
              }
            />
          </View>
        </FormField>

        <SwitchRowsCard
          rows={[
            {
              id: 'enabled',
              title: labels.enableTitle,
              subtitle: labels.enableSubtitle,
              checked: !!values.enabled,
              onCheckedChange: (checked) => setValue('enabled', checked, { shouldDirty: true }),
            },
            {
              id: 'repeat',
              title: labels.repeatTitle,
              subtitle: labels.repeatSubtitle,
              checked: !!values.repeatIfUnconfirmed,
              onCheckedChange: (checked) =>
                setValue('repeatIfUnconfirmed', checked, { shouldDirty: true }),
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

function MedicationSummary({ medication }: { medication: MedicationRecord }) {
  return (
    <View className="flex-1 flex-row items-center gap-4">
      <View className="bg-primary/10 h-14 w-14 items-center justify-center rounded-full">
        <Pill size={24} color={colors.brandGreen} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-body font-heading-semibold text-foreground">
          {medication.drugName} {medication.dose}
        </Text>
        <Text className="text-small font-body text-muted-foreground">
          {medication.quantityLabel} ·{' '}
          {MEDICATIONS_LABELS.treatment[medication.active ? 'active' : 'inactive']}
        </Text>
      </View>
    </View>
  );
}

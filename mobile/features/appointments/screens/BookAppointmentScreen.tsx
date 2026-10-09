// features/appointments/screens/BookAppointmentScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Calendar, Clock } from '@/lib/icons';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { FIELD_CLASS_NAME, FormField, PickerField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { ScreenHeader } from '@/components/ui/screen-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Stepper } from '@/components/ui/tepper';
import { Text } from '@/components/ui/text';
import { APPOINTMENTS_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { useDateTimePicker } from '@/hooks/useDateTimePicker';
import { formatTime12h, startOfToday, toLocalIsoDate } from '@/lib/date-format';
import { formatLongDate } from '../domain/appointment-date';
import {
  bookAppointmentSchema,
  getBookingStep,
  type BookAppointmentValues,
} from '../domain/appointment-form';
import { useCreateAppointment, useProfessionals, useSpecialties } from '../hooks/useAppointments';

const STEPS = APPOINTMENTS_LABELS.stepperSteps.map((label) => ({ label }));

export default function BookAppointmentScreen() {
  const createAppointment = useCreateAppointment();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<BookAppointmentValues>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: { specialtyId: '', professionalId: '', reason: '' },
  });

  const values = useWatch({ control });
  const { data: specialties } = useSpecialties();
  const { data: professionals } = useProfessionals(values.specialtyId || undefined);

  const onSubmit = (form: BookAppointmentValues) => {
    const specialty = specialties?.find((s) => s.id === form.specialtyId);
    const professional = professionals?.find((p) => p.id === form.professionalId);
    if (!specialty || !professional) return;

    createAppointment.mutate(
      {
        title: specialty.name,
        doctorName: professional.name,
        location: professional.location,
        date: toLocalIsoDate(form.date),
        time: formatTime12h(form.time),
        reason: form.reason.trim(),
      },
      // la cita recién creada reemplaza al formulario: "atrás" vuelve a la lista
      { onSuccess: (appointment) => router.replace(`/(app)/appointments/${appointment.id}`) },
    );
  };

  const { open: openPicker, renderIosPicker } = useDateTimePicker({
    fields: {
      date: { mode: 'date', minimumDate: startOfToday() },
      time: { mode: 'time' },
    },
    getValue: (field) => getValues(field),
    onChange: (field, selected) =>
      setValue(field, selected, { shouldValidate: isSubmitted, shouldDirty: true }),
  });

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.appointmentForm} align="center" backButton="outlined" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <Stepper steps={STEPS} currentStep={getBookingStep(values)} className="pb-4" />

        <FormField label={APPOINTMENTS_LABELS.specialtyLabel} error={errors.specialtyId?.message}>
          <Controller
            control={control}
            name="specialtyId"
            render={({ field: { onChange, value } }) => {
              const current = specialties?.find((s) => s.id === value);
              return (
                <Select
                  value={current ? { value: current.id, label: current.name } : undefined}
                  onValueChange={(option) => {
                    onChange(option?.value ?? '');
                    // el profesional elegido ya no corresponde a la nueva especialidad
                    setValue('professionalId', '');
                  }}
                >
                  <SelectTrigger className={FIELD_CLASS_NAME}>
                    <SelectValue
                      className="text-body"
                      placeholder={APPOINTMENTS_LABELS.specialtyPlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties?.map((specialty) => (
                      <SelectItem key={specialty.id} label={specialty.name} value={specialty.id} />
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
        </FormField>

        <FormField
          label={APPOINTMENTS_LABELS.professionalLabel}
          error={errors.professionalId?.message}
        >
          <Controller
            control={control}
            name="professionalId"
            render={({ field: { onChange, value } }) => {
              const current = professionals?.find((p) => p.id === value);
              return (
                <Select
                  // `key` remonta el select al cambiar la especialidad y limpia su valor interno
                  key={values.specialtyId}
                  value={current ? { value: current.id, label: current.name } : undefined}
                  onValueChange={(option) => onChange(option?.value ?? '')}
                >
                  <SelectTrigger
                    className={FIELD_CLASS_NAME}
                    disabled={!values.specialtyId}
                    accessibilityState={{ disabled: !values.specialtyId }}
                  >
                    <SelectValue
                      className="text-body"
                      placeholder={APPOINTMENTS_LABELS.professionalPlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals?.map((professional) => (
                      <SelectItem
                        key={professional.id}
                        label={professional.name}
                        value={professional.id}
                      />
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
        </FormField>

        <FormField label={APPOINTMENTS_LABELS.dateLabel} error={errors.date?.message}>
          <PickerField
            icon={Calendar}
            value={values.date ? formatLongDate(values.date) : undefined}
            placeholder={APPOINTMENTS_LABELS.datePlaceholder}
            onPress={() => openPicker('date')}
          />
          {renderIosPicker('date')}
        </FormField>

        <FormField label={APPOINTMENTS_LABELS.timeLabel} error={errors.time?.message}>
          <PickerField
            icon={Clock}
            value={values.time ? formatTime12h(values.time) : undefined}
            placeholder={APPOINTMENTS_LABELS.timePlaceholder}
            onPress={() => openPicker('time')}
          />
          {renderIosPicker('time')}
        </FormField>

        <FormField label={APPOINTMENTS_LABELS.reasonLabel} error={errors.reason?.message}>
          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="bg-muted/10 h-36 rounded-2xl px-4 py-4"
                placeholder={APPOINTMENTS_LABELS.reasonPlaceholder}
                multiline
                textAlignVertical="top"
                maxLength={300}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </FormField>

        {createAppointment.isError && (
          <Text className="text-small text-destructive">{APPOINTMENTS_LABELS.createError}</Text>
        )}
      </ScrollView>

      <View className="px-6 pt-2 pb-8">
        <Button
          size="lg"
          className="h-14"
          onPress={handleSubmit(onSubmit)}
          disabled={createAppointment.isPending}
        >
          {createAppointment.isPending ? (
            <Spinner size="sm" color="#FFFFFF" />
          ) : (
            <Text className="text-body text-primary-foreground">{APPOINTMENTS_LABELS.submit}</Text>
          )}
        </Button>
      </View>
    </View>
  );
}

// features/medications/screens/AddMedicationScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, ScrollView, View } from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FIELD_CLASS_NAME, FormField, PickerField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { MEDICATIONS_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { formatMedicationTime } from '../domain/medication-time';
import { useCreateMedication } from '../hooks/useMedications';

const schema = z.object({
  drugName: z.string().trim().min(1, 'Ingresá el nombre del medicamento'),
  dose: z.string().trim().min(1, 'Ingresá la dosis'),
  quantityLabel: z.string().trim().min(1, 'Ingresá la cantidad por toma'),
});

type FormValues = z.infer<typeof schema>;

export default function AddMedicationScreen() {
  const createMedication = useCreateMedication();
  const [time, setTime] = useState(new Date());
  const [showIosPicker, setShowIosPicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { drugName: '', dose: '', quantityLabel: '' },
  });

  const onSubmit = (values: FormValues) => {
    createMedication.mutate(
      { ...values, time: formatMedicationTime(time) },
      { onSuccess: () => router.back() },
    );
  };

  const openTimePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: time,
        mode: 'time',
        onValueChange: (_event, selected) => setTime(selected),
      });
    } else {
      setShowIosPicker((visible) => !visible);
    }
  };

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.medicationForm} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <FormField label={MEDICATIONS_LABELS.nameLabel} error={errors.drugName?.message}>
          <Controller
            control={control}
            name="drugName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className={FIELD_CLASS_NAME}
                placeholder={MEDICATIONS_LABELS.namePlaceholder}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </FormField>

        <View className="flex-row gap-4">
          <FormField
            className="flex-1"
            label={MEDICATIONS_LABELS.doseLabel}
            error={errors.dose?.message}
          >
            <Controller
              control={control}
              name="dose"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className={FIELD_CLASS_NAME}
                  placeholder={MEDICATIONS_LABELS.dosePlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </FormField>

          <FormField
            className="flex-1"
            label={MEDICATIONS_LABELS.quantityLabel}
            error={errors.quantityLabel?.message}
          >
            <Controller
              control={control}
              name="quantityLabel"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className={FIELD_CLASS_NAME}
                  placeholder={MEDICATIONS_LABELS.quantityPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </FormField>
        </View>

        <FormField label={MEDICATIONS_LABELS.timeLabel}>
          <PickerField value={formatMedicationTime(time)} onPress={openTimePicker} />
        </FormField>

        {Platform.OS === 'ios' && showIosPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="spinner"
            onValueChange={(_event, selected) => setTime(selected)}
          />
        )}

        {createMedication.isError && (
          <Text className="text-small text-destructive">{MEDICATIONS_LABELS.createError}</Text>
        )}
      </ScrollView>

      <View className="px-6 pt-2 pb-8">
        <Button size="lg" onPress={handleSubmit(onSubmit)} disabled={createMedication.isPending}>
          {createMedication.isPending ? (
            <Spinner size="sm" color="#FFFFFF" />
          ) : (
            <Text className="text-body text-primary-foreground">{MEDICATIONS_LABELS.submit}</Text>
          )}
        </Button>
      </View>
    </View>
  );
}

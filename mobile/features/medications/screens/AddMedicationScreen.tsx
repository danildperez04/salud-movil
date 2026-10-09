// features/medications/screens/AddMedicationScreen.tsx
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
import { Text } from '@/components/ui/text';
import { FREQUENCY_LABELS, MEDICATIONS_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { useDateTimePicker } from '@/hooks/useDateTimePicker';
import { formatDateLong, formatTime12h, startOfToday, toLocalIsoDate } from '@/lib/date-format';
import { ScanBanner } from '../components/ScanBanner';
import {
  DOSE_UNITS,
  FREQUENCY_OPTIONS,
  formatDose,
  medicationSchema,
  type MedicationFormValues,
} from '../domain/medication-form';
import { useCreateMedication } from '../hooks/useMedications';

export default function AddMedicationScreen() {
  const createMedication = useCreateMedication();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      drugName: '',
      doseAmount: '',
      doseUnit: 'mg',
      activeIngredient: '',
      frequency: '',
      quantityLabel: '',
      time: new Date(),
      startDate: new Date(),
    },
  });

  const values = useWatch({ control });

  const { open: openPicker, renderIosPicker } = useDateTimePicker({
    fields: {
      time: { mode: 'time' },
      startDate: { mode: 'date' },
      endDate: { mode: 'date' },
      expiryDate: { mode: 'date', minimumDate: startOfToday() },
    },
    getValue: (field) => getValues(field),
    onChange: (field, selected) =>
      setValue(field, selected, { shouldValidate: isSubmitted, shouldDirty: true }),
  });

  const onSubmit = (form: MedicationFormValues) => {
    createMedication.mutate(
      {
        drugName: form.drugName,
        dose: formatDose(form.doseAmount, form.doseUnit),
        detail: form.quantityLabel,
        time: formatTime12h(form.time),
        frequency: form.frequency,
        activeIngredient: form.activeIngredient || undefined,
        startDate: toLocalIsoDate(form.startDate),
        endDate: form.endDate && toLocalIsoDate(form.endDate),
        expiryDate: form.expiryDate && toLocalIsoDate(form.expiryDate),
      },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.medicationForm} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <ScanBanner />

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
            error={errors.doseAmount?.message}
          >
            <Controller
              control={control}
              name="doseAmount"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className={FIELD_CLASS_NAME}
                  keyboardType="decimal-pad"
                  placeholder={MEDICATIONS_LABELS.dosePlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </FormField>

          <FormField className="flex-1" label={MEDICATIONS_LABELS.unitLabel}>
            <Controller
              control={control}
              name="doseUnit"
              render={({ field: { onChange, value } }) => (
                <Select
                  value={{ value, label: value }}
                  onValueChange={(option) => option && onChange(option.value)}
                >
                  <SelectTrigger className={FIELD_CLASS_NAME}>
                    <SelectValue className="text-body" placeholder={value} />
                  </SelectTrigger>
                  <SelectContent>
                    {DOSE_UNITS.map((unit) => (
                      <SelectItem key={unit} label={unit} value={unit} />
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </View>

        <FormField label={MEDICATIONS_LABELS.activeIngredientLabel}>
          <Controller
            control={control}
            name="activeIngredient"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className={FIELD_CLASS_NAME}
                placeholder={MEDICATIONS_LABELS.activeIngredientPlaceholder}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </FormField>

        <FormField label={MEDICATIONS_LABELS.frequencyLabel} error={errors.frequency?.message}>
          <Controller
            control={control}
            name="frequency"
            render={({ field: { onChange, value } }) => (
              <Select
                value={value ? { value, label: FREQUENCY_LABELS[value] ?? value } : undefined}
                onValueChange={(option) => onChange(option?.value ?? '')}
              >
                <SelectTrigger className={FIELD_CLASS_NAME}>
                  <SelectValue
                    className="text-body"
                    placeholder={MEDICATIONS_LABELS.frequencyPlaceholder}
                  />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map((frequency) => (
                    <SelectItem
                      key={frequency}
                      label={FREQUENCY_LABELS[frequency]}
                      value={frequency}
                    />
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <View className="flex-row gap-4">
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

          <FormField
            className="flex-1"
            label={MEDICATIONS_LABELS.timeLabel}
            error={errors.time?.message}
          >
            <PickerField
              icon={Clock}
              value={values.time ? formatTime12h(values.time) : undefined}
              onPress={() => openPicker('time')}
            />
          </FormField>
        </View>
        {renderIosPicker('time')}

        <View className="flex-row gap-4">
          <FormField
            className="flex-1"
            label={MEDICATIONS_LABELS.startLabel}
            error={errors.startDate?.message}
          >
            <PickerField
              icon={Calendar}
              value={values.startDate ? formatDateLong(values.startDate) : undefined}
              placeholder={MEDICATIONS_LABELS.datePlaceholder}
              onPress={() => openPicker('startDate')}
            />
          </FormField>

          <FormField
            className="flex-1"
            label={MEDICATIONS_LABELS.endLabel}
            error={errors.endDate?.message}
          >
            <PickerField
              icon={Calendar}
              value={values.endDate ? formatDateLong(values.endDate) : undefined}
              placeholder={MEDICATIONS_LABELS.datePlaceholder}
              onPress={() => openPicker('endDate')}
            />
          </FormField>
        </View>
        {renderIosPicker('startDate')}
        {renderIosPicker('endDate')}

        <FormField label={MEDICATIONS_LABELS.expiryLabel} error={errors.expiryDate?.message}>
          <PickerField
            icon={Calendar}
            value={values.expiryDate ? formatDateLong(values.expiryDate) : undefined}
            placeholder={MEDICATIONS_LABELS.datePlaceholder}
            onPress={() => openPicker('expiryDate')}
          />
          {renderIosPicker('expiryDate')}
        </FormField>

        {createMedication.isError && (
          <Text className="text-small text-destructive">{MEDICATIONS_LABELS.createError}</Text>
        )}
      </ScrollView>

      <View className="px-6 pt-2 pb-8">
        <Button
          size="lg"
          className="h-14"
          onPress={handleSubmit(onSubmit)}
          disabled={createMedication.isPending}
        >
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

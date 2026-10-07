// features/health-indicators/screens/RegisterHealthIndicatorScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Platform, ScrollView, View } from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IntroCard } from '@/components/ui/intro-card';
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
import { INDICATOR_TYPE_LABELS, REGISTER_INDICATOR_LABELS } from '@/constants/labels';
import { createMockHealthIndicator } from '../api/mock-health-indicators';
import { FIELD_CLASS_NAME, FormField, PickerField } from '@/components/ui/form-field';
import { typeNameFromSlug } from '../domain/indicator-type';
import { HEALTH_INDICATORS_QUERY_KEY } from '../hooks/useHealthIndicators';

// TODO: no existe GET /catalogues/type-indicators en el backend todavía.
// Hardcodeado a partir del seed real de cat_type_indicator.
const INDICATOR_TYPES = [
  { id: '1', name: 'Blood pressure', unit: 'mmHg' },
  { id: '2', name: 'Glucose', unit: 'mg/dL' },
  { id: '3', name: 'Weight', unit: 'kg' },
  { id: '4', name: 'Temperature', unit: '°C' },
];

const findType = (id: string) => INDICATOR_TYPES.find((t) => t.id === id);
const isBloodPressure = (id: string) => findType(id)?.name === 'Blood pressure';

const isPositiveNumber = (text: string) => {
  const normalized = text.trim().replace(',', '.');
  return /^\d+(\.\d+)?$/.test(normalized) && Number(normalized) > 0;
};

// Los campos de valor dependen del tipo: presión arterial pide sistólica y
// diastólica; el resto un único valor.
const schema = z
  .object({
    typeIndicatorId: z.string().min(1, 'Seleccioná un tipo de indicador'),
    value: z.string(),
    systolic: z.string(),
    diastolic: z.string(),
    notes: z.string(),
  })
  .superRefine((data, ctx) => {
    const fields = isBloodPressure(data.typeIndicatorId)
      ? (['systolic', 'diastolic'] as const)
      : (['value'] as const);

    for (const field of fields) {
      if (isPositiveNumber(data[field])) continue;
      ctx.addIssue({
        code: 'custom',
        path: [field],
        message: data[field].trim() ? 'Ingresá un valor válido' : 'Ingresá un valor',
      });
    }
  });

type FormValues = z.infer<typeof schema>;
type PickerMode = 'date' | 'time';

export default function RegisterHealthIndicatorScreen() {
  const queryClient = useQueryClient();
  // si se llega desde el historial/evolución de un indicador, viene preseleccionado
  const { type: typeSlug } = useLocalSearchParams<{ type?: string }>();
  const presetTypeId = INDICATOR_TYPES.find((t) => t.name === typeNameFromSlug(typeSlug))?.id;
  const [dateHour, setDateHour] = useState(new Date());
  const [iosPickerMode, setIosPickerMode] = useState<PickerMode | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      typeIndicatorId: presetTypeId ?? '',
      value: '',
      systolic: '',
      diastolic: '',
      notes: '',
    },
  });

  const selectedType = findType(useWatch({ control, name: 'typeIndicatorId' }));
  const showBloodPressureFields = selectedType?.name === 'Blood pressure';

  // TODO: reemplazar createMockHealthIndicator por
  // apiClient.post('/health-indicators', payload) cuando exista el endpoint.
  const registerIndicator = useMutation({
    mutationFn: (payload: { typeName: string; value: string; dateHour: Date; notes?: string }) =>
      createMockHealthIndicator(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HEALTH_INDICATORS_QUERY_KEY });
      router.back();
    },
  });

  const onSubmit = (values: FormValues) => {
    const type = findType(values.typeIndicatorId);
    if (!type) return;
    registerIndicator.mutate({
      typeName: type.name,
      value: isBloodPressure(type.id)
        ? `${values.systolic.trim()}/${values.diastolic.trim()}`
        : values.value.trim(),
      dateHour,
      notes: values.notes.trim() || undefined,
    });
  };

  const openPicker = (mode: PickerMode) => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: dateHour,
        mode,
        onValueChange: (_event, selected) => setDateHour(selected),
      });
    } else {
      setIosPickerMode((current) => (current === mode ? null : mode));
    }
  };

  const formattedDate = dateHour.toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = dateHour.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

  const valueLabel = (base: string) => (selectedType ? `${base} (${selectedType.unit})` : base);

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={REGISTER_INDICATOR_LABELS.title} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <IntroCard
          title={REGISTER_INDICATOR_LABELS.introTitle}
          description={REGISTER_INDICATOR_LABELS.introDescription}
        />

        <FormField
          label={REGISTER_INDICATOR_LABELS.typeLabel}
          error={errors.typeIndicatorId?.message}
        >
          <Controller
            control={control}
            name="typeIndicatorId"
            render={({ field: { onChange, value } }) => {
              const current = findType(value);
              return (
                <Select
                  value={
                    current
                      ? { value: current.id, label: INDICATOR_TYPE_LABELS[current.name] }
                      : undefined
                  }
                  onValueChange={(option) => onChange(option?.value ?? '')}
                >
                  <SelectTrigger className={FIELD_CLASS_NAME}>
                    <SelectValue
                      className="text-body"
                      placeholder={REGISTER_INDICATOR_LABELS.typePlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {INDICATOR_TYPES.map((type) => (
                      <SelectItem
                        key={type.id}
                        label={INDICATOR_TYPE_LABELS[type.name]}
                        value={type.id}
                      />
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
        </FormField>

        {showBloodPressureFields ? (
          <View className="flex-row gap-4">
            <FormField
              className="flex-1"
              label={valueLabel(REGISTER_INDICATOR_LABELS.systolicLabel)}
              error={errors.systolic?.message}
            >
              <Controller
                control={control}
                name="systolic"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    className={FIELD_CLASS_NAME}
                    keyboardType="decimal-pad"
                    placeholder="120"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </FormField>
            <FormField
              className="flex-1"
              label={valueLabel(REGISTER_INDICATOR_LABELS.diastolicLabel)}
              error={errors.diastolic?.message}
            >
              <Controller
                control={control}
                name="diastolic"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    className={FIELD_CLASS_NAME}
                    keyboardType="decimal-pad"
                    placeholder="80"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </FormField>
          </View>
        ) : (
          <FormField
            label={valueLabel(REGISTER_INDICATOR_LABELS.valueLabel)}
            error={errors.value?.message}
          >
            <Controller
              control={control}
              name="value"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className={FIELD_CLASS_NAME}
                  keyboardType="decimal-pad"
                  placeholder="110"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </FormField>
        )}

        <View className="flex-row gap-4">
          <FormField className="flex-1" label={REGISTER_INDICATOR_LABELS.dateLabel}>
            <PickerField value={formattedDate} onPress={() => openPicker('date')} />
          </FormField>
          <FormField className="flex-1" label={REGISTER_INDICATOR_LABELS.timeLabel}>
            <PickerField value={formattedTime} onPress={() => openPicker('time')} />
          </FormField>
        </View>

        {Platform.OS === 'ios' && iosPickerMode && (
          <DateTimePicker
            value={dateHour}
            mode={iosPickerMode}
            display={iosPickerMode === 'date' ? 'inline' : 'spinner'}
            onValueChange={(_event, selected) => setDateHour(selected)}
          />
        )}

        <FormField label={REGISTER_INDICATOR_LABELS.notesLabel}>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="bg-muted/10 h-36 rounded-2xl px-4 py-4"
                multiline
                textAlignVertical="top"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </FormField>

        {registerIndicator.isError && (
          <Text className="text-small text-destructive">
            No se pudo registrar el indicador. Intentá de nuevo.
          </Text>
        )}
      </ScrollView>

      <View className="px-6 pt-2 pb-8">
        <Button
          size="lg"
          className="h-14"
          onPress={handleSubmit(onSubmit)}
          disabled={registerIndicator.isPending}
        >
          {registerIndicator.isPending ? (
            <Spinner size="sm" color="#FFFFFF" />
          ) : (
            <Text className="text-body text-primary-foreground">
              {REGISTER_INDICATOR_LABELS.submitButton}
            </Text>
          )}
        </Button>
      </View>
    </View>
  );
}

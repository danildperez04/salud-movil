// features/health-indicators/screens/RegisterHealthIndicatorScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import { TriangleAlert } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Platform, ScrollView, View } from 'react-native';
import { z } from 'zod';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { FooterButton } from '@/components/ui/footer-button';
import { FIELD_CLASS_NAME, FormField, PickerField } from '@/components/ui/form-field';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import {
  COMMON_LABELS,
  INDICATOR_TYPE_LABELS,
  REGISTER_INDICATOR_LABELS,
} from '@/constants/labels';
import { BLOOD_PRESSURE, type IndicatorType } from '../domain/indicator-record';
import { typeNameFromSlug } from '../domain/indicator-type';
import { useCreateHealthIndicator, useIndicatorTypes } from '../hooks/useHealthIndicators';

const toNumber = (text: string) => Number(text.trim().replace(',', '.'));

const isPositiveNumber = (text: string) => {
  const normalized = text.trim().replace(',', '.');
  return /^\d+(\.\d+)?$/.test(normalized) && Number(normalized) > 0;
};

// Los campos de valor dependen del tipo: presión arterial pide sistólica y
// diastólica; el resto un único valor.
function buildSchema(types: IndicatorType[]) {
  const isBloodPressure = (id: string) =>
    types.find((t) => String(t.id) === id)?.name === BLOOD_PRESSURE;

  return z
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
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;
type PickerMode = 'date' | 'time';

export default function RegisterHealthIndicatorScreen() {
  const { data: types, isLoading, isError, refetch } = useIndicatorTypes();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={REGISTER_INDICATOR_LABELS.title} align="center" />

      {types ? (
        <RegisterForm types={types} />
      ) : isLoading ? (
        <View className="gap-6 px-6 pt-2">
          <Skeleton className="h-28 w-full rounded-3xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </View>
      ) : (
        <>
          <View className="flex-1 px-6 pt-2">
            <EmptyStateCard
              icon={TriangleAlert}
              tone="danger"
              title={REGISTER_INDICATOR_LABELS.typesError.title}
              description={REGISTER_INDICATOR_LABELS.typesError.description}
            />
          </View>
          {isError && <FooterButton label={COMMON_LABELS.retry} onPress={() => refetch()} />}
        </>
      )}
    </View>
  );
}

function RegisterForm({ types }: { types: IndicatorType[] }) {
  // si se llega desde el historial/evolución de un indicador, viene preseleccionado
  const { type: typeSlug } = useLocalSearchParams<{ type?: string }>();
  const presetType = types.find((t) => t.name === typeNameFromSlug(typeSlug));
  const [dateHour, setDateHour] = useState(new Date());
  const [iosPickerMode, setIosPickerMode] = useState<PickerMode | null>(null);
  const registerIndicator = useCreateHealthIndicator();

  const schema = useMemo(() => buildSchema(types), [types]);
  const findType = (id: string) => types.find((t) => String(t.id) === id);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      typeIndicatorId: presetType ? String(presetType.id) : '',
      value: '',
      systolic: '',
      diastolic: '',
      notes: '',
    },
  });

  const selectedType = findType(useWatch({ control, name: 'typeIndicatorId' }));
  const showBloodPressureFields = selectedType?.name === BLOOD_PRESSURE;

  const onSubmit = (values: FormValues) => {
    const type = findType(values.typeIndicatorId);
    if (!type) return;
    const isBloodPressure = type.name === BLOOD_PRESSURE;

    registerIndicator.mutate(
      {
        typeIndicatorId: type.id,
        value: toNumber(isBloodPressure ? values.systolic : values.value),
        valueSecondary: isBloodPressure ? toNumber(values.diastolic) : undefined,
        dateHour,
        notes: values.notes.trim() || undefined,
      },
      { onSuccess: () => router.back() },
    );
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

  const valueLabel = (base: string) =>
    selectedType ? `${base} (${selectedType.measurementUnit})` : base;

  return (
    <>
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
                      ? {
                          value: String(current.id),
                          label: INDICATOR_TYPE_LABELS[current.name] ?? current.name,
                        }
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
                    {types.map((type) => (
                      <SelectItem
                        key={type.id}
                        label={INDICATOR_TYPE_LABELS[type.name] ?? type.name}
                        value={String(type.id)}
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

      <FooterButton
        label={REGISTER_INDICATOR_LABELS.submitButton}
        onPress={handleSubmit(onSubmit)}
        isPending={registerIndicator.isPending}
      />
    </>
  );
}

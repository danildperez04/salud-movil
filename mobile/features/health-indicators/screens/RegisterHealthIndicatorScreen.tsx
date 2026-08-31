// features/health-indicators/screens/RegisterHealthIndicatorScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { createMockHealthIndicator } from '../api/mock-health-indicators';

// TODO: no existe GET /catalogues/type-indicators en el backend todavía.
// Hardcodeado a partir del seed real de cat_type_indicator.
const INDICATOR_TYPES = [
  { id: '1', name: 'Blood pressure', unit: 'mmHg' },
  { id: '2', name: 'Glucose', unit: 'mg/dL' },
  { id: '3', name: 'Weight', unit: 'kg' },
  { id: '4', name: 'Temperature', unit: '°C' },
];

const schema = z.object({
  typeIndicatorId: z.string().min(1, 'Seleccioná un tipo de indicador'),
  value: z.string().min(1, 'Ingresá un valor'),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterHealthIndicatorScreen() {
  const queryClient = useQueryClient();
  const [dateHour, setDateHour] = useState(new Date());
  const [showIosPicker, setShowIosPicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { typeIndicatorId: '', value: '' },
  });

  // TODO: reemplazar createMockHealthIndicator por
  // apiClient.post('/health-indicators', payload) cuando exista el endpoint.
  const registerIndicator = useMutation({
    mutationFn: (payload: { typeName: string; value: string; dateHour: Date }) =>
      createMockHealthIndicator(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-indicators'] });
      router.back();
    },
  });

  const onSubmit = (values: FormValues) => {
    const type = INDICATOR_TYPES.find((t) => t.id === values.typeIndicatorId);
    if (!type) return;
    registerIndicator.mutate({ typeName: type.name, value: values.value, dateHour });
  };

  // En Android, mode="datetime" NO existe en el picker nativo (solo admite
  // 'date' | 'time' | 'countdown' por separado) — usarlo crashea con
  // "Cannot read property 'dismiss' of undefined". Por eso acá se encadenan
  // dos diálogos nativos: primero fecha, después hora.
  const openAndroidPicker = () => {
    DateTimePickerAndroid.open({
      value: dateHour,
      mode: 'date',
      onChange: (_event, selectedDate) => {
        if (!selectedDate) return;
        DateTimePickerAndroid.open({
          value: selectedDate,
          mode: 'time',
          onChange: (_event2, selectedTime) => {
            if (selectedTime) setDateHour(selectedTime);
          },
        });
      },
    });
  };

  const handleOpenPicker = () => {
    if (Platform.OS === 'android') {
      openAndroidPicker();
    } else {
      setShowIosPicker(true);
    }
  };

  const formattedDate = dateHour.toLocaleString('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title="Registrar indicador" />

      <ScrollView contentContainerClassName="gap-4 p-6">
        <View className="gap-2">
          <Label>Tipo de indicador</Label>
          <Controller
            control={control}
            name="typeIndicatorId"
            render={({ field: { onChange, value } }) => {
              const selectedType = INDICATOR_TYPES.find((t) => t.id === value);
              return (
                <Select
                  value={
                    selectedType
                      ? {
                          value: selectedType.id,
                          label: `${selectedType.name} (${selectedType.unit})`,
                        }
                      : undefined
                  }
                  onValueChange={(option) => onChange(option?.value ?? '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo de indicador" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDICATOR_TYPES.map((type) => (
                      <SelectItem
                        key={type.id}
                        label={`${type.name} (${type.unit})`}
                        value={type.id}
                      />
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.typeIndicatorId && (
            <Text className="text-small text-destructive">{errors.typeIndicatorId.message}</Text>
          )}
        </View>

        <View className="gap-2">
          <Label>Valor</Label>
          <Controller
            control={control}
            name="value"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Ej: 120/80 o 110"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.value && (
            <Text className="text-small text-destructive">{errors.value.message}</Text>
          )}
        </View>

        <View className="gap-2">
          <Label>Fecha y hora</Label>
          <Pressable
            onPress={handleOpenPicker}
            className="border-input bg-background flex-row items-center justify-between rounded-lg border px-3 py-2.5"
          >
            <Text className="text-body text-foreground">{formattedDate}</Text>
            <Calendar size={16} color="#6B7280" />
          </Pressable>
          {Platform.OS === 'ios' && showIosPicker && (
            <DateTimePicker
              value={dateHour}
              mode="datetime"
              display="inline"
              onChange={(_event, selectedDate) => {
                if (selectedDate) setDateHour(selectedDate);
              }}
            />
          )}
        </View>

        {registerIndicator.isError && (
          <Text className="text-small text-destructive">
            No se pudo registrar el indicador. Intentá de nuevo.
          </Text>
        )}

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={registerIndicator.isPending}
          className="mt-2"
        >
          {registerIndicator.isPending ? (
            <Spinner size="sm" color="#0E2A3A" />
          ) : (
            <Text>Guardar indicador</Text>
          )}
        </Button>
      </ScrollView>
    </View>
  );
}

// features/medical-record/hooks/useDiagnosisForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm, useWatch } from 'react-hook-form';
import { useDateTimePicker } from '@/hooks/useDateTimePicker';
import { toLocalIsoDate } from '@/lib/date-format';
import { diagnosisSchema, type DiagnosisFormValues } from '../domain/record-schemas';
import { useCreateDiagnosis } from './useMedicalRecord';

/** Formulario "Agregar diagnóstico": estado, validación, selector de fecha y guardado. */
export function useDiagnosisForm() {
  const createDiagnosis = useCreateDiagnosis();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: { name: '', status: 'active', provider: '', notes: '' },
  });

  const diagnosedAt = useWatch({ control, name: 'diagnosedAt' });

  const datePicker = useDateTimePicker({
    // un diagnóstico no puede ser de una fecha futura
    fields: { diagnosedAt: { mode: 'date', maximumDate: new Date() } },
    getValue: (field) => getValues(field),
    onChange: (field, selected) =>
      setValue(field, selected, { shouldValidate: isSubmitted, shouldDirty: true }),
  });

  const submit = handleSubmit((form) =>
    createDiagnosis.mutate(
      {
        name: form.name,
        status: form.status,
        diagnosedAt: form.diagnosedAt && toLocalIsoDate(form.diagnosedAt),
        provider: form.provider || undefined,
        notes: form.notes || undefined,
      },
      { onSuccess: () => router.back() },
    ),
  );

  return {
    control,
    diagnosedAt,
    diagnosedAtError: errors.diagnosedAt?.message,
    openDatePicker: () => datePicker.open('diagnosedAt'),
    renderIosDatePicker: () => datePicker.renderIosPicker('diagnosedAt'),
    submit,
    isPending: createDiagnosis.isPending,
    isError: createDiagnosis.isError,
  };
}

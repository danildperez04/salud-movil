// features/medical-record/hooks/useHistoryForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { historySchema, type HistoryFormValues } from '../domain/record-schemas';
import { useCreateHistoryEntry } from './useMedicalRecord';

/** Formulario "Agregar antecedente": estado, validación y guardado. */
export function useHistoryForm() {
  const createEntry = useCreateHistoryEntry();

  const { control, handleSubmit } = useForm<HistoryFormValues>({
    resolver: zodResolver(historySchema),
    defaultValues: { kind: 'personal', category: 'disease', title: '', period: '', detail: '' },
  });

  const submit = handleSubmit((form) =>
    createEntry.mutate(
      {
        kind: form.kind,
        category: form.category,
        title: form.title,
        period: form.period || undefined,
        detail: form.detail || undefined,
      },
      { onSuccess: () => router.back() },
    ),
  );

  return { control, submit, isPending: createEntry.isPending, isError: createEntry.isError };
}

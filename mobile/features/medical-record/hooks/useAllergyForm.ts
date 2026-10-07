// features/medical-record/hooks/useAllergyForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { allergySchema, type AllergyFormValues } from '../domain/record-schemas';
import { useCreateAllergy } from './useMedicalRecord';

/** Formulario "Agregar alergia": estado, validación y guardado. */
export function useAllergyForm() {
  const createAllergy = useCreateAllergy();

  const { control, handleSubmit } = useForm<AllergyFormValues>({
    resolver: zodResolver(allergySchema),
    defaultValues: { type: 'medication', name: '', reaction: '', severity: 'mild', notes: '' },
  });

  const submit = handleSubmit((form) =>
    createAllergy.mutate(
      {
        type: form.type,
        name: form.name,
        reaction: form.reaction || undefined,
        severity: form.severity,
        notes: form.notes || undefined,
      },
      { onSuccess: () => router.back() },
    ),
  );

  return { control, submit, isPending: createAllergy.isPending, isError: createAllergy.isError };
}

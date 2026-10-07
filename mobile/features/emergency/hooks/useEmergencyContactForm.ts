// features/emergency/hooks/useEmergencyContactForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm, useWatch } from 'react-hook-form';
import {
  DEFAULT_PHONE_PREFIX,
  emergencyContactSchema,
  type EmergencyContactFormValues,
} from '../domain/emergency-contact-schema';
import { useCreateEmergencyContact } from './useEmergencyContacts';

/** Formulario "Agregar contacto": validación, interruptor de contacto principal y guardado. */
export function useEmergencyContactForm() {
  const createContact = useCreateEmergencyContact();

  const { control, handleSubmit, setValue } = useForm<EmergencyContactFormValues>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: { name: '', relation: 'mother', phone: DEFAULT_PHONE_PREFIX, isPrimary: false },
  });

  const isPrimary = useWatch({ control, name: 'isPrimary' });

  const submit = handleSubmit((form) =>
    createContact.mutate(form, { onSuccess: () => router.back() }),
  );

  return {
    control,
    isPrimary,
    setPrimary: (value: boolean) => setValue('isPrimary', value, { shouldDirty: true }),
    submit,
    isPending: createContact.isPending,
    isError: createContact.isError,
  };
}

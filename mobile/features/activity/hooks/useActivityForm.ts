// features/activity/hooks/useActivityForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toLocalIsoDate } from '@/lib/date-format';
import {
  ACTIVITY_FORM_DEFAULTS,
  activityFormSchema,
  type ActivityFormValues,
} from '../domain/activity-schema';
import { useSaveActivity } from './useActivity';

/** Formulario "¿Hiciste ejercicio hoy?": validación, guardado del día y reinicio. */
export function useActivityForm() {
  const saveActivity = useSaveActivity();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: ACTIVITY_FORM_DEFAULTS,
  });

  // RHF lo tipa como obligatorio, pero hasta que el usuario elige Sí o No no tiene valor
  const done = useWatch({ control, name: 'done' }) as boolean | undefined;

  const submit = handleSubmit((form) =>
    saveActivity.mutate(
      {
        date: toLocalIsoDate(new Date()),
        done: form.done,
        type: form.done ? form.type : undefined,
        minutes: form.done ? Number(form.minutes.replace(',', '.')) : undefined,
        intensity: form.done ? form.intensity : undefined,
        note: form.note || undefined,
      },
      // el registro aparece en "Últimos días": el formulario queda listo para otro día
      { onSuccess: () => reset(ACTIVITY_FORM_DEFAULTS) },
    ),
  );

  return {
    control,
    done,
    setDone: (value: boolean) => setValue('done', value, { shouldValidate: true }),
    doneError: errors.done?.message,
    submit,
    isPending: saveActivity.isPending,
    isError: saveActivity.isError,
  };
}

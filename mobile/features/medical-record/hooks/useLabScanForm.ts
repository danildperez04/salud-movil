// features/medical-record/hooks/useLabScanForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm, useWatch } from 'react-hook-form';
import { useDateTimePicker } from '@/hooks/useDateTimePicker';
import type { PickedMedia } from '@/hooks/useMediaPicker';
import { toLocalIsoDate } from '@/lib/date-format';
import { labScanSchema, type LabScanFormValues } from '../domain/record-schemas';
import { useAttachmentActions } from './useAttachmentActions';
import { useCreateLab } from './useMedicalRecord';

/** Formulario "Escanear laboratorio": foto del examen, datos del resultado y guardado. */
export function useLabScanForm() {
  const createLab = useCreateLab();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<LabScanFormValues>({
    resolver: zodResolver(labScanSchema),
    defaultValues: {
      name: '',
      issuedAt: new Date(),
      status: 'normal',
      resultValue: '',
      notes: '',
    },
  });

  const issuedAt = useWatch({ control, name: 'issuedAt' });
  // RHF lo tipa como obligatorio, pero hasta que el usuario elige una foto no existe
  const attachment = useWatch({ control, name: 'attachment' }) as PickedMedia | undefined;

  const datePicker = useDateTimePicker({
    fields: { issuedAt: { mode: 'date', maximumDate: new Date() } },
    getValue: (field) => getValues(field),
    onChange: (field, selected) =>
      setValue(field, selected, { shouldValidate: isSubmitted, shouldDirty: true }),
  });

  const { takePhoto, chooseImage } = useAttachmentActions((media) =>
    setValue('attachment', media, { shouldValidate: isSubmitted, shouldDirty: true }),
  );

  const submit = handleSubmit((form) =>
    createLab.mutate(
      {
        name: form.name,
        issuedAt: toLocalIsoDate(form.issuedAt),
        status: form.status,
        resultValue: form.resultValue || undefined,
        notes: form.notes || undefined,
        imageUri: form.attachment.uri,
      },
      { onSuccess: () => router.back() },
    ),
  );

  return {
    control,
    issuedAt,
    issuedAtError: errors.issuedAt?.message,
    openDatePicker: () => datePicker.open('issuedAt'),
    renderIosDatePicker: () => datePicker.renderIosPicker('issuedAt'),
    attachment,
    attachmentError: errors.attachment?.message,
    takePhoto,
    chooseImage,
    submit,
    isPending: createLab.isPending,
    isError: createLab.isError,
  };
}

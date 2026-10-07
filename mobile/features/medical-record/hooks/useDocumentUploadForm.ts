// features/medical-record/hooks/useDocumentUploadForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm, useWatch } from 'react-hook-form';
import { useDateTimePicker } from '@/hooks/useDateTimePicker';
import type { PickedMedia } from '@/hooks/useMediaPicker';
import { toLocalIsoDate } from '@/lib/date-format';
import type { DocumentCategory } from '../domain/record-catalogs';
import { documentSchema, type DocumentFormValues } from '../domain/record-schemas';
import { useAttachmentActions } from './useAttachmentActions';
import { useCreateDocument } from './useMedicalRecord';

/** Formulario "Subir documento": campos, adjunto (foto o archivo), fecha y guardado. */
export function useDocumentUploadForm(defaultCategory: DocumentCategory = 'prescriptions') {
  const createDocument = useCreateDocument();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      category: defaultCategory,
      title: '',
      provider: '',
      issuedAt: new Date(),
      notes: '',
    },
  });

  const issuedAt = useWatch({ control, name: 'issuedAt' });
  // RHF lo tipa como obligatorio, pero hasta que el usuario elige un archivo no existe
  const attachment = useWatch({ control, name: 'attachment' }) as PickedMedia | undefined;

  const datePicker = useDateTimePicker({
    fields: { issuedAt: { mode: 'date', maximumDate: new Date() } },
    getValue: (field) => getValues(field),
    onChange: (field, selected) =>
      setValue(field, selected, { shouldValidate: isSubmitted, shouldDirty: true }),
  });

  const attachmentActions = useAttachmentActions((media) =>
    setValue('attachment', media, { shouldValidate: isSubmitted, shouldDirty: true }),
  );

  const submit = handleSubmit((form) =>
    createDocument.mutate(
      {
        category: form.category,
        title: form.title,
        provider: form.provider || undefined,
        issuedAt: toLocalIsoDate(form.issuedAt),
        notes: form.notes || undefined,
        format: form.attachment.kind === 'image' ? 'image' : 'pdf',
        fileUri: form.attachment.uri,
        fileName: form.attachment.name,
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
    ...attachmentActions,
    submit,
    isPending: createDocument.isPending,
    isError: createDocument.isError,
  };
}

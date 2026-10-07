// features/help/hooks/useReportProblemForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useForm, useWatch } from 'react-hook-form';
import { Alert } from 'react-native';
import { HELP_LABELS } from '@/constants/labels';
import { useMediaPicker, type PickedMedia } from '@/hooks/useMediaPicker';
import { useAppStore } from '@/store';
import { submitMockProblemReport } from '../api/mock-help';
import { reportProblemSchema, type ReportProblemValues } from '../domain/report-schema';

const { report: labels } = HELP_LABELS;

/** Formulario "Reportar problema": campos, captura opcional y envío. */
export function useReportProblemForm() {
  const email = useAppStore((state) => state.user?.email ?? '');
  const { chooseImage } = useMediaPicker();
  const sendReport = useMutation({ mutationFn: submitMockProblemReport });

  const { control, handleSubmit, setValue } = useForm<ReportProblemValues>({
    resolver: zodResolver(reportProblemSchema),
    defaultValues: { category: 'navigation', description: '', email },
  });

  const screenshot = useWatch({ control, name: 'screenshot' }) as PickedMedia | undefined;

  const attachScreenshot = async () => {
    const picked = await chooseImage();
    if (picked) setValue('screenshot', picked, { shouldDirty: true });
  };

  const submit = handleSubmit((form) =>
    sendReport.mutate(
      {
        category: labels.categories[form.category],
        description: form.description,
        email: form.email,
        screenshotUri: form.screenshot?.uri,
      },
      {
        onSuccess: () =>
          Alert.alert(labels.successTitle, labels.successMessage, [
            { text: labels.ok, onPress: () => router.back() },
          ]),
      },
    ),
  );

  return {
    control,
    screenshot,
    attachScreenshot,
    submit,
    isPending: sendReport.isPending,
    isError: sendReport.isError,
  };
}

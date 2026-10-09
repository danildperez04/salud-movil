// features/security/hooks/useChangePasswordForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { SECURITY_LABELS } from '@/constants/labels';
import { changePasswordSchema, type ChangePasswordValues } from '../domain/password-schema';
import { useChangePassword } from './useSecurity';

const { password: labels } = SECURITY_LABELS;

/** Formulario "Cambiar contraseña": validación, guardado y aviso de éxito. */
export function useChangePasswordForm() {
  const changePassword = useChangePassword();

  const { control, handleSubmit } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const submit = handleSubmit(({ currentPassword, newPassword }) =>
    changePassword.mutate(
      { currentPassword, newPassword },
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
    submit,
    isPending: changePassword.isPending,
    isError: changePassword.isError,
  };
}

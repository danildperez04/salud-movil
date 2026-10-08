// features/security/hooks/useTwoFactorFlows.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { SECURITY_LABELS } from '@/constants/labels';
import { otpCodeSchema, type OtpCodeValues } from '@/features/auth/domain/otp-code';
import { RESEND_COOLDOWN_SECONDS } from '@/features/auth/domain/otp-timing';
import { useSecondsLeft } from '@/features/auth/hooks/useSecondsLeft';
import {
  disableErrorMessage,
  disableTwoFactorSchema,
  enableErrorMessage,
  requestCodeErrorMessage,
  type DisableTwoFactorValues,
} from '../domain/two-factor-settings';
import {
  useConfirmTwoFactor,
  useDisableTwoFactor,
  useRequestTwoFactorCode,
} from './useTwoFactorSettings';

const { twoFactor: labels } = SECURITY_LABELS;

/** Activar: pedir código (enable) → ingresarlo (confirm). El `challengeId` solo vive en este estado. */
export function useEnableTwoFactorFlow() {
  const requestCode = useRequestTwoFactorCode();
  const confirm = useConfirmTwoFactor();
  const [ticket, setTicket] = useState<{ challengeId: string; resendAvailableAtMs: number } | null>(
    null,
  );

  const { control, handleSubmit, reset } = useForm<OtpCodeValues>({
    resolver: zodResolver(otpCodeSchema),
    defaultValues: { code: '' },
  });

  const resendIn = useSecondsLeft(ticket?.resendAvailableAtMs);

  const sendCode = () => {
    confirm.reset();
    requestCode.mutate(undefined, {
      onSuccess: ({ challengeId }) => {
        reset({ code: '' });
        setTicket({
          challengeId,
          resendAvailableAtMs: Date.now() + RESEND_COOLDOWN_SECONDS * 1000,
        });
      },
    });
  };

  const cancel = () => {
    setTicket(null);
    reset({ code: '' });
    requestCode.reset();
    confirm.reset();
  };

  const submit = handleSubmit(({ code }) => {
    if (!ticket) return;
    confirm.mutate(
      { challengeId: ticket.challengeId, code },
      {
        onSuccess: () => {
          setTicket(null);
          Alert.alert(labels.enabledTitle, labels.enabledMessage, [{ text: labels.ok }]);
        },
      },
    );
  });

  return {
    control,
    isCodeStep: ticket !== null,
    sendCode,
    cancel,
    submit,
    resendIn,
    isSending: requestCode.isPending,
    isConfirming: confirm.isPending,
    errorMessage: confirm.error
      ? enableErrorMessage(confirm.error)
      : requestCode.error
        ? requestCodeErrorMessage(requestCode.error)
        : null,
  };
}

/** Desactivar: pide la contraseña (el endpoint la valida y responde 400 si no coincide). */
export function useDisableTwoFactorForm() {
  const disable = useDisableTwoFactor();

  const { control, handleSubmit, reset } = useForm<DisableTwoFactorValues>({
    resolver: zodResolver(disableTwoFactorSchema),
    defaultValues: { password: '' },
  });

  const submit = handleSubmit(({ password }) =>
    disable.mutate(
      { password },
      {
        onSuccess: () => {
          reset({ password: '' });
          Alert.alert(labels.disabledTitle, labels.disabledMessage, [{ text: labels.ok }]);
        },
      },
    ),
  );

  return {
    control,
    submit,
    isPending: disable.isPending,
    errorMessage: disable.error ? disableErrorMessage(disable.error) : null,
  };
}

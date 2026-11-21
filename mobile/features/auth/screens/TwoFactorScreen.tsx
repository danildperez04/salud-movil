// features/auth/screens/TwoFactorScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { ApiError } from '@/lib/api-client';
import { userMessage } from '@/lib/error-messages';
import { useAppStore } from '@/store';
import { OtpCodeField } from '../components/OtpCodeField';
import { otpCodeSchema, type OtpCodeValues } from '../domain/otp-code';
import { formatCountdown } from '../domain/otp-timing';
import { classifyResendError, verifyErrorMessage } from '../domain/two-factor-errors';
import { useResendTwoFactor } from '../hooks/useResendTwoFactor';
import { useSecondsLeft } from '../hooks/useSecondsLeft';
import { useVerifyTwoFactor } from '../hooks/useVerifyTwoFactor';
import { useTwoFactorStore } from '../store/two-factor-store';

export default function TwoFactorScreen() {
  const { t } = useTranslation('login');
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const challenge = useTwoFactorStore((state) => state.challenge);
  const clearChallenge = useTwoFactorStore((state) => state.clearChallenge);
  const verify = useVerifyTwoFactor();
  const resend = useResendTwoFactor();
  const [notice, setNotice] = useState<string | null>(null);
  const [resendError, setResendError] = useState<{ gone: boolean; message: string } | null>(null);

  const expiresIn = useSecondsLeft(challenge?.expiresAtMs);
  const resendIn = useSecondsLeft(challenge?.resendAvailableAtMs);
  const isExpired = expiresIn === 0;

  const { control, handleSubmit, reset } = useForm<OtpCodeValues>({
    resolver: zodResolver(otpCodeSchema),
    defaultValues: { code: '' },
  });

  // Sin desafío en memoria (ej. la app se reinició) no hay nada que verificar.
  if (!challenge && !isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (!challenge) return null;

  const backToLogin = () => {
    clearChallenge();
    router.replace('/(auth)/login');
  };

  const onSubmit = ({ code }: OtpCodeValues) => {
    setNotice(null);
    setResendError(null);
    verify.mutate(code, { onSuccess: () => router.replace('/(app)') });
  };

  const onResend = () => {
    setNotice(null);
    setResendError(null);
    resend.mutate(undefined, {
      onSuccess: () => {
        verify.reset();
        reset({ code: '' });
        setNotice(t('twoFactor.resent'));
      },
      onError: (error) => {
        const { kind, message } = classifyResendError(error);
        setResendError({ gone: kind === 'gone', message });
      },
    });
  };

  const verifyError = verify.error
    ? verify.error instanceof ApiError
      ? verifyErrorMessage(verify.error)
      : userMessage(verify.error)
    : null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="bg-background flex-1"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="grow px-6"
        contentContainerStyle={{
          paddingTop: Math.max(72, insets.top + 10),
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View className="w-full max-w-md items-center self-center">
          <BrandLogo />

          <View
            className="bg-card dark:border-border rounded-brand mt-8 w-full border border-[#E5E7EB] px-5 pt-4 pb-5"
            style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <Text
              role="heading"
              aria-level={1}
              className="font-heading text-brand-blue dark:text-neutral-white text-[24px] leading-9"
            >
              {t('twoFactor.title')}
            </Text>
            <Text className="font-heading-regular text-secondary-steel mt-1 text-[14px] leading-5.25">
              {t('twoFactor.subtitle')}
            </Text>

            <View className="mt-4 gap-4">
              <OtpCodeField
                control={control}
                name="code"
                label={t('twoFactor.codeLabel')}
                placeholder={t('twoFactor.codePlaceholder')}
                testID="otp-input"
                autoFocus
                editable={!verify.isPending}
                onSubmitEditing={handleSubmit(onSubmit)}
              />

              <Text
                className={
                  isExpired
                    ? 'text-small text-destructive'
                    : 'text-small font-body text-muted-foreground'
                }
              >
                {isExpired
                  ? t('twoFactor.expired')
                  : t('twoFactor.expiresIn', { time: formatCountdown(expiresIn) })}
              </Text>

              {verifyError && <Text className="text-small text-destructive">{verifyError}</Text>}
              {resendError && (
                <Text className="text-small text-destructive">{resendError.message}</Text>
              )}
              {notice && <Text className="text-small text-primary">{notice}</Text>}

              <Button
                size="lg"
                onPress={handleSubmit(onSubmit)}
                disabled={verify.isPending || isExpired}
                className="h-14 rounded-2xl shadow-none"
                style={{ boxShadow: '0px 8px 24px rgba(45, 183, 154, 0.3)' }}
              >
                {verify.isPending ? (
                  <Spinner size="sm" color="#FFFFFF" />
                ) : (
                  <Text className="text-[16px] leading-6 text-white">{t('twoFactor.submit')}</Text>
                )}
              </Button>

              {resendError?.gone ? null : (
                <Button
                  variant="outline"
                  size="lg"
                  onPress={onResend}
                  disabled={resendIn > 0 || resend.isPending || verify.isPending}
                  className="h-14 rounded-2xl"
                >
                  {resend.isPending ? (
                    <Spinner size="sm" />
                  ) : (
                    <Text className="text-body text-foreground">
                      {resendIn > 0
                        ? t('twoFactor.resendIn', { seconds: resendIn })
                        : t('twoFactor.resend')}
                    </Text>
                  )}
                </Button>
              )}

              <Button variant="ghost" onPress={backToLogin} disabled={verify.isPending}>
                <Text className="text-small text-secondary-steel underline">
                  {t('twoFactor.backToLogin')}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

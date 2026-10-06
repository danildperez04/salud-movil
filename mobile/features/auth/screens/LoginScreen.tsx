// features/auth/screens/LoginScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { LOGIN_LABELS } from '@/constants/labels';
import { colors, fonts } from '@/lib/tokens';
import { ApiError } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { useLogin } from '../hooks/useLogin';

const loginSchema = z.object({
  email: z.string().min(1, LOGIN_LABELS.emailRequired).email(LOGIN_LABELS.emailInvalid),
  password: z.string().min(1, LOGIN_LABELS.passwordRequired),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LABEL_CLASS =
  'font-heading-semibold text-brand-blue/75 text-[13px] leading-[19.5px] dark:text-neutral-white/75';
const INPUT_CLASS =
  'font-heading-regular text-brand-blue focus:border-primary h-13 rounded-2xl border-[#E5E7EB] px-4 text-[14px] dark:border-input dark:text-neutral-white';

export default function LoginScreen() {
  const login = useLogin();
  const insets = useSafeAreaInsets();
  const authNotice = useAppStore((state) => state.authNotice);
  const clearAuthNotice = useAppStore((state) => state.clearAuthNotice);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    return () => clearAuthNotice();
  }, [clearAuthNotice]);

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => {
        router.replace('/(app)');
      },
    });
  };

  const errorMessage = (() => {
    if (!login.error) return null;
    if (login.error instanceof ApiError) {
      return login.error.status === 401 ? LOGIN_LABELS.invalidCredentials : login.error.message;
    }
    return login.error.message;
  })();

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
          <Text className="font-heading-medium text-secondary-steel mt-3.5 text-[14px] leading-[21px]">
            {LOGIN_LABELS.tagline}
          </Text>

          <View className="mt-8 w-full flex-row items-center gap-3">
            <View className="bg-secondary-green-light/35 h-px flex-1" />
            <View className="bg-secondary-green-light size-2.5 rounded-full" />
            <View className="bg-secondary-green-light/35 h-px flex-1" />
          </View>

          {authNotice && (
            <View className="bg-destructive/10 mt-6 w-full rounded-2xl p-4">
              <Text className="text-small text-destructive">{authNotice}</Text>
            </View>
          )}

          <View
            className="bg-card dark:border-border mt-8 w-full rounded-[20px] border border-[#E5E7EB] px-5 pt-4 pb-5"
            style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <Text
              role="heading"
              aria-level={1}
              className="font-heading text-brand-blue dark:text-neutral-white text-[24px] leading-[36px]"
            >
              {LOGIN_LABELS.title}
            </Text>
            <Text className="font-heading-regular text-secondary-steel mt-1 text-[14px] leading-[21px]">
              {LOGIN_LABELS.subtitle}
            </Text>

            <View className="mt-4 gap-4">
              <View className="gap-1.5">
                <Label nativeID="email" className={LABEL_CLASS}>
                  {LOGIN_LABELS.emailLabel}
                </Label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      aria-labelledby="email"
                      testID="email-input"
                      placeholder={LOGIN_LABELS.emailPlaceholder}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!login.isPending}
                      className={INPUT_CLASS}
                      placeholderTextColor={colors.neutralMedium}
                    />
                  )}
                />
                {errors.email && (
                  <Text className="text-small text-destructive">{errors.email.message}</Text>
                )}
              </View>

              <View className="gap-1.5">
                <Label nativeID="password" className={LABEL_CLASS}>
                  {LOGIN_LABELS.passwordLabel}
                </Label>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      aria-labelledby="password"
                      testID="password-input"
                      placeholder="••••••••"
                      secureTextEntry
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!login.isPending}
                      className={INPUT_CLASS}
                      placeholderTextColor={colors.neutralMedium}
                    />
                  )}
                />
                {errors.password && (
                  <Text className="text-small text-destructive">{errors.password.message}</Text>
                )}
              </View>

              {/* TODO: conectar a /auth/forgot-password cuando armemos esa pantalla */}
              <Pressable className="self-end" hitSlop={8}>
                <Text className="font-heading-semibold text-secondary-steel text-[13px] leading-[19.5px] underline">
                  {LOGIN_LABELS.forgotPassword}
                </Text>
              </Pressable>

              {errorMessage && <Text className="text-small text-destructive">{errorMessage}</Text>}

              <Button
                size="lg"
                onPress={handleSubmit(onSubmit)}
                disabled={login.isPending}
                className="h-14 rounded-2xl shadow-none"
                style={{ boxShadow: '0px 8px 24px rgba(45, 183, 154, 0.3)' }}
              >
                {login.isPending ? (
                  <Spinner size="sm" color="#FFFFFF" />
                ) : (
                  <Text
                    className="text-[16px] leading-6 text-white"
                    style={{ fontFamily: fonts.heading, fontWeight: '400' }}
                  >
                    {LOGIN_LABELS.submit}
                  </Text>
                )}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// features/auth/screens/LoginScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { LOGIN_LABELS } from '@/constants/labels';
import { ApiError } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { useLogin } from '../hooks/useLogin';

const loginSchema = z.object({
  email: z.string().min(1, LOGIN_LABELS.emailRequired).email(LOGIN_LABELS.emailInvalid),
  password: z.string().min(1, LOGIN_LABELS.passwordRequired),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const login = useLogin();
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
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm items-center gap-3">
          <Image
            source={require('@/assets/logo-mark.png')}
            className="h-44 w-52"
            resizeMode="contain"
            accessibilityLabel="Salud Móvil"
          />
          <Text className="font-body-semibold text-secondary-steel">{LOGIN_LABELS.tagline}</Text>

          <View className="mt-2 w-full flex-row items-center gap-3">
            <Separator className="flex-1" />
            <View className="bg-primary h-2 w-2 rounded-full" />
            <Separator className="flex-1" />
          </View>
        </View>

        {authNotice && (
          <View className="bg-destructive/10 w-full max-w-sm rounded-xl p-4">
            <Text className="text-small text-destructive">{authNotice}</Text>
          </View>
        )}

        <Card className="w-full max-w-sm rounded-3xl border-0 shadow-lg shadow-black/5">
          <CardHeader className="gap-1 px-6 pt-6 pb-2">
            <CardTitle className="text-h3 font-heading text-foreground">
              {LOGIN_LABELS.title}
            </CardTitle>
            <CardDescription className="text-body font-body text-primary">
              {LOGIN_LABELS.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="gap-5 px-6 pb-6">
            <View className="gap-2">
              <Label nativeID="email" className="text-body font-heading-medium text-foreground">
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
                  />
                )}
              />
              {errors.email && (
                <Text className="text-small text-destructive">{errors.email.message}</Text>
              )}
            </View>

            <View className="gap-2">
              <Label nativeID="password" className="text-body font-heading-medium text-foreground">
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
                  />
                )}
              />
              {errors.password && (
                <Text className="text-small text-destructive">{errors.password.message}</Text>
              )}
            </View>

            {/* TODO: conectar a /auth/forgot-password cuando armemos esa pantalla */}
            <Pressable className="self-end">
              <Text className="text-small font-body-medium text-primary underline">
                {LOGIN_LABELS.forgotPassword}
              </Text>
            </Pressable>

            {errorMessage && <Text className="text-small text-destructive">{errorMessage}</Text>}

            {/* Sin overrides de color/forma acá — el Button ya trae el
                estilo correcto (blanco, negrita, píldora, glow) por default */}
            <Button
              size="lg"
              onPress={handleSubmit(onSubmit)}
              disabled={login.isPending}
              className="mt-2 h-14"
            >
              {login.isPending ? (
                <Spinner size="sm" color="#FFFFFF" />
              ) : (
                <Text className="text-primary-foreground">{LOGIN_LABELS.submit}</Text>
              )}
            </Button>
          </CardContent>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

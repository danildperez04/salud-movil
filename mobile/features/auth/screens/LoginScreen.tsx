// features/auth/screens/LoginScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Activity } from 'lucide-react-native';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  // El aviso ("tu sesión expiró", "esta cuenta no tiene acceso") se muestra
  // una sola vez, al llegar a esta pantalla — no queremos que persista
  // después de que el usuario ya lo vio e intenta loguearse de nuevo.
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
      return login.error.status === 401
        ? LOGIN_LABELS.invalidCredentials
        : 'No se pudo conectar. Revisá tu conexión e intentá de nuevo';
    }
    return login.error.message; // RoleNotAllowedError
  })();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="bg-background flex-1"
    >
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <View className="items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Activity size={24} color="#2DB79A" />
            <Text className="text-h2 font-heading text-foreground">
              Salud <Text className="text-h2 font-heading text-primary">Móvil</Text>
            </Text>
          </View>
          <Text className="text-small font-body text-primary">{LOGIN_LABELS.tagline}</Text>
        </View>

        {authNotice && (
          <View className="bg-destructive/10 w-full max-w-sm rounded-lg p-3">
            <Text className="text-small text-destructive">{authNotice}</Text>
          </View>
        )}

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-h2 font-heading text-foreground">
              {LOGIN_LABELS.title}
            </CardTitle>
            <CardDescription className="text-body font-body text-muted-foreground">
              {LOGIN_LABELS.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="gap-4">
            <View className="gap-2">
              <Label nativeID="email">{LOGIN_LABELS.emailLabel}</Label>
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
              <Label nativeID="password">{LOGIN_LABELS.passwordLabel}</Label>
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

            <Button onPress={handleSubmit(onSubmit)} disabled={login.isPending} className="mt-2">
              {login.isPending ? (
                <Spinner size="sm" color="#0E2A3A" />
              ) : (
                <Text>{LOGIN_LABELS.submit}</Text>
              )}
            </Button>
          </CardContent>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

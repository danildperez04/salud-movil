// features/auth/screens/LoginScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useLogin } from '../hooks/useLogin';

const loginSchema = z.object({
  email: z.string().min(1, 'Ingresá tu correo').email('Correo inválido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const login = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => {
        router.replace('/(app)');
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="bg-background flex-1"
    >
      <View className="flex-1 items-center justify-center px-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-h2 font-heading text-foreground">Salud Móvil</CardTitle>
            <CardDescription className="text-body font-body text-muted-foreground">
              Ingresá con tu usuario o correo para continuar
            </CardDescription>
          </CardHeader>

          <CardContent className="gap-4">
            <View className="gap-2">
              <Label nativeID="email">Correo</Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    aria-labelledby="email"
                    placeholder="tucorreo@ejemplo.com"
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
              <Label nativeID="password">Contraseña</Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    aria-labelledby="password"
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

            {login.isError && (
              <Text className="text-small text-destructive">
                {login.error.status === 401
                  ? 'Correo o contraseña incorrectos'
                  : 'No se pudo conectar. Revisá tu conexión e intentá de nuevo'}
              </Text>
            )}

            <Button onPress={handleSubmit(onSubmit)} disabled={login.isPending} className="mt-2">
              {login.isPending ? (
                <Spinner size="sm" color="#0E2A3A" />
              ) : (
                <Text>Iniciar sesión</Text>
              )}
            </Button>
          </CardContent>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

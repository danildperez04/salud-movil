// features/home/screens/HomeScreen.tsx
// Placeholder — reemplazar layout visual con el diseño real de Figma.
// La conexión a datos ya está lista: trae el perfil real del backend.
import { useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import type { PublicUser } from '@/types/auth';

export default function HomeScreen() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const { data: me, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.get<PublicUser>('/auth/me'),
  });

  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-4 p-6">
      <Text className="text-h1 font-heading text-foreground">Hola, {user?.name}</Text>

      <Card>
        <CardHeader>
          <CardTitle>Tu perfil</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          {isLoading ? (
            <View className="gap-2">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </View>
          ) : (
            <>
              <Text className="text-body text-foreground">Correo: {me?.email}</Text>
              <Text className="text-body text-foreground">Rol: {me?.role}</Text>
            </>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" onPress={logout}>
        <Text>Cerrar sesión</Text>
      </Button>
    </ScrollView>
  );
}

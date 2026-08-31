// app/+not-found.tsx
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'No encontrado', headerShown: false }} />
      <View className="bg-background flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-h1 font-heading text-foreground">404</Text>
        <Text className="text-body text-muted-foreground text-center">
          Esta pantalla no existe todavía.
        </Text>
        <Link href="/" asChild>
          <Button className="mt-2">
            <Text>Volver al inicio</Text>
          </Button>
        </Link>
      </View>
    </>
  );
}

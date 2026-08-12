// app/index.tsx
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background gap-3 p-4">
      <Button>
        <Text>Default</Text>
      </Button>

      <Button variant="secondary">
        <Text>Secondary</Text>
      </Button>

      <Button variant="outline">
        <Text>Outline</Text>
      </Button>

      <Button variant="destructive">
        <Text>Destructive</Text>
      </Button>

      <Button variant="ghost">
        <Text>Ghost</Text>
      </Button>

      <Button size="sm">
        <Text>Pequeño</Text>
      </Button>
    </View>
  );
}

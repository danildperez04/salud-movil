// components/ui/screen-header.tsx
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
};

export function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center gap-3 px-6 pt-4 pb-2">
      <Pressable
        onPress={onBack ?? (() => router.back())}
        className="border-border h-9 w-9 items-center justify-center rounded-full border active:opacity-70"
      >
        <ChevronLeft size={18} color="#0E2A3A" />
      </Pressable>
      <Text className="text-h3 font-heading text-foreground">{title}</Text>
    </View>
  );
}

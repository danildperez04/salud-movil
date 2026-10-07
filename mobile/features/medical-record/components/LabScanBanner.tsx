// features/medical-record/components/LabScanBanner.tsx
import { Camera } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { MEDICAL_RECORD_LABELS } from '@/constants/labels';
import { colors } from '@/lib/tokens';

/** Acceso a "Escanear examen" con la cámara. */
export function LabScanBanner({ onPress }: { onPress: () => void }) {
  const { scanTitle, scanDescription, openCamera } = MEDICAL_RECORD_LABELS.labs;

  return (
    <View className="bg-primary/5 border-primary/20 flex-row items-center gap-4 rounded-3xl border p-5">
      <View className="bg-primary/10 h-14 w-14 items-center justify-center rounded-2xl">
        <Camera size={24} color={colors.brandGreen} />
      </View>

      <View className="flex-1 gap-1">
        <Text className="text-body font-heading-semibold text-foreground">{scanTitle}</Text>
        <Text className="text-caption font-body text-muted-foreground">{scanDescription}</Text>
      </View>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        className="border-primary/30 bg-primary/10 rounded-full border px-4 py-2 active:opacity-70"
      >
        <Text className="text-small font-body-semibold text-primary">{openCamera}</Text>
      </Pressable>
    </View>
  );
}

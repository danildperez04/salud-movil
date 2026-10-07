// features/emergency/components/LocationShareCard.tsx
import { MapPin } from 'lucide-react-native';
import { View } from 'react-native';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { EMERGENCY_LABELS } from '@/constants/labels';
import { colors } from '@/lib/tokens';

type LocationShareCardProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function LocationShareCard({ enabled, onChange }: LocationShareCardProps) {
  return (
    <View className="bg-muted/10 border-border flex-row items-center gap-4 rounded-3xl border p-4">
      <View className="bg-primary/10 h-12 w-12 items-center justify-center rounded-2xl">
        <MapPin size={22} color={colors.brandGreen} />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-body font-heading-semibold text-foreground">
          {EMERGENCY_LABELS.shareLocation}
        </Text>
        <Text className="text-caption font-body text-muted-foreground">
          {enabled ? EMERGENCY_LABELS.locationOn : EMERGENCY_LABELS.locationOff}
        </Text>
      </View>

      <Switch
        checked={enabled}
        onCheckedChange={onChange}
        aria-label={EMERGENCY_LABELS.shareLocation}
      />
    </View>
  );
}

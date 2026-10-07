// features/activity/components/StatTile.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

type StatTileProps = {
  value: string;
  label: string;
};

/** Cifra destacada con su etiqueta debajo (3 días activos). */
export function StatTile({ value, label }: StatTileProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${value} ${label}`}
      className="bg-card border-border flex-1 items-center gap-0.5 rounded-2xl border py-4"
    >
      <Text className="text-h3 font-heading text-foreground">{value}</Text>
      <Text className="text-caption font-body text-muted-foreground">{label}</Text>
    </View>
  );
}

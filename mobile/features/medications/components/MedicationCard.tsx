// features/medications/components/MedicationCard.tsx
import { Pill } from 'lucide-react-native';
import { View } from 'react-native';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';

type MedicationCardProps = {
  drugName: string;
  dose: string;
  /** cantidad por toma, ej "1 tableta" — viene de medication_schedule, no de medication */
  quantityLabel: string;
  time: string;
  active: boolean;
  onToggleActive: (value: boolean) => void;
};

export function MedicationCard({
  drugName,
  dose,
  quantityLabel,
  time,
  active,
  onToggleActive,
}: MedicationCardProps) {
  return (
    <View className="bg-muted/40 flex-row items-center gap-4 rounded-2xl p-4">
      <View className="bg-background h-11 w-11 items-center justify-center rounded-full">
        <Pill size={20} color={active ? '#2DB79A' : '#6B7280'} />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-body font-heading-medium text-foreground">
          {drugName} {dose}
        </Text>
        <Text className="text-small font-body text-muted-foreground">{quantityLabel}</Text>
        <Text className="text-small font-heading-medium text-foreground">{time}</Text>
      </View>

      <Switch checked={active} onCheckedChange={onToggleActive} />
    </View>
  );
}

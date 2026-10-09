// features/medications/components/MedicationCard.tsx
import { Pill } from 'lucide-react-native';
import { View } from 'react-native';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { FREQUENCY_LABELS } from '@/constants/labels';
import { cn } from '@/lib/utils';

const ICON_SIZE = 56;
const ICON_BG_ACTIVE = 'rgba(45, 183, 154, 0.12)';
const ICON_BG_INACTIVE = 'rgba(217, 217, 217, 0.6)';

type MedicationCardProps = {
  drugName: string;
  dose: string;
  /** cantidad por toma, ej "1 tableta" — viene de medication_schedule, no de medication */
  quantityLabel: string;
  /** valor de cat_frequency.name (ej "Every 12 hours") */
  frequency?: string;
  time: string;
  active: boolean;
  onToggleActive: (value: boolean) => void;
};

export function MedicationCard({
  drugName,
  dose,
  quantityLabel,
  frequency,
  time,
  active,
  onToggleActive,
}: MedicationCardProps) {
  // "1 tableta · Cada 12 horas"
  const details = [quantityLabel, frequency && (FREQUENCY_LABELS[frequency] ?? frequency)]
    .filter(Boolean)
    .join(' · ');

  return (
    <View className="bg-card border-border flex-row items-start gap-4 rounded-3xl border p-5 shadow-lg shadow-black/5">
      {/* estilo explícito: el círculo cambia de fondo con `active` y debe verse siempre redondo */}
      <View
        className="items-center justify-center"
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: ICON_SIZE / 2,
          backgroundColor: active ? ICON_BG_ACTIVE : ICON_BG_INACTIVE,
        }}
      >
        <Pill size={24} color={active ? '#2DB79A' : '#6B7280'} />
      </View>

      <View className="flex-1 gap-1">
        <Text
          className={cn(
            'text-body font-heading-semibold',
            active ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {drugName} {dose}
        </Text>
        <Text className="text-small font-body text-muted-foreground">{details}</Text>
        <Text
          className={cn(
            'text-body font-heading-semibold mt-2',
            active ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {time}
        </Text>
      </View>

      <Switch
        checked={active}
        onCheckedChange={onToggleActive}
        aria-label={`${drugName} ${dose}`}
      />
    </View>
  );
}

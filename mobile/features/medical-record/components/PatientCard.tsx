// features/medical-record/components/PatientCard.tsx
import { UserRound } from 'lucide-react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { MEDICAL_RECORD_LABELS } from '@/constants/labels';
import { colors } from '@/lib/tokens';

type PatientCardProps = {
  name: string;
  /** fecha ya formateada de la última modificación del expediente */
  updatedAt?: string;
};

const { summary } = MEDICAL_RECORD_LABELS;

export function PatientCard({ name, updatedAt }: PatientCardProps) {
  return (
    <View className="bg-primary/5 border-primary/20 flex-row items-center justify-between gap-4 rounded-3xl border p-5 shadow-lg shadow-black/5">
      <View className="flex-1 gap-1">
        <Text className="text-caption font-body-semibold text-muted-foreground tracking-widest uppercase">
          {summary.patient}
        </Text>
        <Text
          className="text-h3 font-heading text-foreground"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {name}
        </Text>
        {updatedAt && (
          <Text className="text-small font-body text-muted-foreground">
            {summary.updated}: {updatedAt}
          </Text>
        )}
      </View>

      <View className="bg-primary/10 border-primary/30 h-14 w-14 items-center justify-center rounded-full border">
        <UserRound size={24} color={colors.brandGreen} />
      </View>
    </View>
  );
}

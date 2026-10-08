// features/ipcp/components/QuestionCard.tsx
import { TriangleAlert } from 'lucide-react-native';
import { View } from 'react-native';
import { OptionButtons, type OptionButton } from '@/components/ui/option-buttons';
import { Text } from '@/components/ui/text';
import { IPCP_LABELS } from '@/constants/labels';
import { statusColors } from '@/lib/tokens';
import { cn } from '@/lib/utils';
import { IPCP_SCALE, type IpcpAnswer } from '../domain/ipcp-questions';

type ScaleValue = `${IpcpAnswer}`;

const labels = IPCP_LABELS.assessment;
const FIRST = IPCP_SCALE[0];
const LAST = IPCP_SCALE[IPCP_SCALE.length - 1];

type QuestionCardProps = {
  position: number;
  total: number;
  title: string;
  /** significado del 1 y del 5 (extremos de la escala) */
  low: string;
  high: string;
  redFlag: boolean;
  value?: IpcpAnswer;
  onChange: (value: IpcpAnswer) => void;
};

/** Una pregunta de la evaluación con su escala del 1 al 5. */
export function QuestionCard({
  position,
  total,
  title,
  low,
  high,
  redFlag,
  value,
  onChange,
}: QuestionCardProps) {
  const options: OptionButton<ScaleValue>[] = IPCP_SCALE.map((step) => ({
    value: `${step}`,
    label: `${step}`,
    accessibilityLabel: labels.optionA11y(
      step,
      step === FIRST ? low : step === LAST ? high : undefined,
    ),
  }));

  return (
    <View
      className={cn(
        'bg-card gap-4 rounded-3xl border p-5 shadow-lg shadow-black/5',
        redFlag ? 'border-destructive/30' : 'border-border',
      )}
    >
      <View className="flex-row items-start gap-3">
        <View
          className={cn(
            'h-8 w-8 items-center justify-center rounded-full',
            redFlag ? 'bg-destructive/10' : 'bg-primary/10',
          )}
        >
          <Text
            className={cn(
              'text-small font-heading-semibold',
              redFlag ? 'text-destructive' : 'text-primary',
            )}
          >
            {position}
          </Text>
        </View>

        <View className="flex-1 gap-1.5">
          {redFlag && (
            <View className="flex-row items-center gap-1">
              <TriangleAlert size={12} color={statusColors.danger} />
              <Text className="text-caption font-body-semibold text-destructive">
                {labels.redFlag}
              </Text>
            </View>
          )}
          <Text
            accessibilityLabel={labels.questionA11y(position, total, title)}
            className="text-body font-heading-semibold text-foreground"
          >
            {title}
          </Text>
        </View>
      </View>

      <View className="gap-2">
        <OptionButtons
          options={options}
          value={value === undefined ? undefined : (`${value}` as ScaleValue)}
          onValueChange={(next) => onChange(Number(next) as IpcpAnswer)}
        />
        <View className="flex-row justify-between gap-4 px-1">
          <Text className="text-caption font-body text-muted-foreground flex-1">
            {`${FIRST} = ${low}`}
          </Text>
          <Text className="text-caption font-body text-muted-foreground flex-1 text-right">
            {`${LAST} = ${high}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

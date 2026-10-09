// features/reminders/components/TodayDosesCard.tsx
import { Check, Pill, X } from 'lucide-react-native';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { MEDICATIONS_LABELS } from '@/constants/labels';
import { formatTime12h } from '@/lib/date-format';
import { colors, statusColors } from '@/lib/tokens';
import { isUnconfirmed, type DoseResponse } from '../domain/dose-schedule';
import { useRecordDose, useTodayDoses, type TodayDose } from '../hooks/useDoses';

const labels = MEDICATIONS_LABELS.doses;

type DoseState = keyof typeof labels.status;

const STATE_COLORS: Record<DoseState, string> = {
  taken: statusColors.success,
  skipped: colors.neutralMedium,
  pending: colors.neutralMedium,
  unconfirmed: statusColors.warning,
};

type DoseRowProps = {
  dose: TodayDose;
  onRespond: (status: DoseResponse) => void;
};

function DoseRow({ dose, onRespond }: DoseRowProps) {
  const state: DoseState =
    dose.status === 'pending' && isUnconfirmed(dose, new Date()) ? 'unconfirmed' : dose.status;
  const time = formatTime12h(dose.scheduledAt);
  const respondedWith = (status: DoseResponse) => dose.status === status;

  return (
    <View className="bg-card border-border gap-4 rounded-3xl border p-4 shadow-lg shadow-black/5">
      <View className="flex-row items-center gap-3">
        <View className="bg-primary/10 h-11 w-11 items-center justify-center rounded-full">
          <Pill size={20} color={colors.brandGreen} />
        </View>

        <View className="flex-1 gap-0.5">
          <Text className="text-body font-heading-semibold text-foreground">
            {dose.drugName} {dose.doseLabel}
          </Text>
          <Text className="text-small font-body text-muted-foreground">{time}</Text>
        </View>

        <Text className="text-caption font-body-semibold" style={{ color: STATE_COLORS[state] }}>
          {labels.status[state]}
        </Text>
      </View>

      <View className="flex-row gap-3">
        <Button
          size="sm"
          className="flex-1"
          variant={respondedWith('taken') ? 'default' : 'outline'}
          onPress={() => onRespond('taken')}
          accessibilityLabel={labels.a11y(labels.taken, dose.drugName, dose.doseLabel, time)}
          accessibilityState={{ selected: respondedWith('taken') }}
        >
          <Check size={16} color={respondedWith('taken') ? '#FFFFFF' : colors.brandGreen} />
          <Text className="text-small">{labels.taken}</Text>
        </Button>

        <Button
          size="sm"
          className="flex-1"
          variant={respondedWith('skipped') ? 'secondary' : 'outline'}
          onPress={() => onRespond('skipped')}
          accessibilityLabel={labels.a11y(labels.skipped, dose.drugName, dose.doseLabel, time)}
          accessibilityState={{ selected: respondedWith('skipped') }}
        >
          <X size={16} color={respondedWith('skipped') ? '#FFFFFF' : colors.neutralMedium} />
          <Text className="text-small">{labels.skipped}</Text>
        </Button>
      </View>
    </View>
  );
}

/** Tomas que tocan hoy, con "Tomé" / "Omití". Sus respuestas alimentan la adherencia del IPCP. */
export function TodayDosesCard() {
  const { doses, isLoading } = useTodayDoses();
  const recordDose = useRecordDose();

  if (isLoading) return <Skeleton className="h-36 w-full rounded-3xl" />;
  if (doses.length === 0) return null;

  const confirmed = doses.filter((dose) => dose.status === 'taken').length;

  return (
    <View className="gap-3">
      <SectionHeader title={labels.title} subtitle={labels.progress(confirmed, doses.length)} />

      {doses.map((dose) => (
        <DoseRow
          key={`${dose.reminderId}:${dose.date}`}
          dose={dose}
          onRespond={(status) =>
            recordDose.mutate({ reminderId: dose.reminderId, date: dose.date, status })
          }
        />
      ))}

      <Text className="text-caption font-body text-muted-foreground px-1">{labels.hint}</Text>
    </View>
  );
}

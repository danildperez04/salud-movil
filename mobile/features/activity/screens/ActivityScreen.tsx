// features/activity/screens/ActivityScreen.tsx
import { ScrollView, View } from 'react-native';
import { SelectFormField, TextFormField } from '@/components/ui/controlled-fields';
import { FooterButton } from '@/components/ui/footer-button';
import { IntroCard } from '@/components/ui/intro-card';
import { OptionButtons, type OptionButton } from '@/components/ui/option-buttons';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { optionsFromLabels } from '@/components/ui/select-field';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import {
  ACTIVITY_INTENSITY_LABELS,
  ACTIVITY_LABELS,
  ACTIVITY_TYPE_LABELS,
  SCREEN_TITLES,
} from '@/constants/labels';
import { ActivityEntryCard } from '../components/ActivityEntryCard';
import { StatTile } from '../components/StatTile';
import { WEEKLY_GOAL_DAYS } from '../domain/activity-stats';
import { useActivityLog } from '../hooks/useActivity';
import { useActivityForm } from '../hooks/useActivityForm';

const labels = ACTIVITY_LABELS;

/** Cuántos días se muestran en "Últimos días". */
const HISTORY_LIMIT = 7;

type Answer = 'yes' | 'no';
const ANSWER_OPTIONS: OptionButton<Answer>[] = [
  { value: 'yes', label: labels.yes, tone: 'success' },
  { value: 'no', label: labels.no, tone: 'danger' },
];
const TYPE_OPTIONS = optionsFromLabels(ACTIVITY_TYPE_LABELS);
const INTENSITY_OPTIONS = optionsFromLabels(ACTIVITY_INTENSITY_LABELS);

export default function ActivityScreen() {
  const { entries, isLoading, weekly } = useActivityLog();
  const form = useActivityForm();
  const answer: Answer | undefined = form.done === undefined ? undefined : form.done ? 'yes' : 'no';

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.activity} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <IntroCard title={labels.introTitle} description={labels.introDescription} />

        <View className="flex-row gap-3">
          <StatTile value={String(weekly.activeDays)} label={labels.stats.activeDays} />
          <StatTile value={String(weekly.minutes)} label={labels.stats.minutes} />
          <StatTile value={`${WEEKLY_GOAL_DAYS}/7`} label={labels.stats.goal} />
        </View>

        <View className="bg-card border-border gap-5 rounded-3xl border p-5 shadow-lg shadow-black/5">
          <View className="gap-3">
            <Text className="text-body font-heading-semibold text-foreground">
              {labels.questionTitle}
            </Text>
            <OptionButtons
              options={ANSWER_OPTIONS}
              value={answer}
              onValueChange={(value) => form.setDone(value === 'yes')}
            />
            {form.doneError && (
              <Text className="text-small text-destructive">{form.doneError}</Text>
            )}
          </View>

          {form.done && (
            <>
              <TextFormField
                control={form.control}
                name="minutes"
                label={labels.minutesLabel}
                placeholder={labels.minutesPlaceholder}
                keyboardType="number-pad"
                maxLength={3}
              />
              <SelectFormField
                control={form.control}
                name="type"
                label={labels.typeLabel}
                options={TYPE_OPTIONS}
              />
              <SelectFormField
                control={form.control}
                name="intensity"
                label={labels.intensityLabel}
                options={INTENSITY_OPTIONS}
              />
            </>
          )}

          <TextFormField
            control={form.control}
            name="note"
            label={labels.noteLabel}
            placeholder={labels.notePlaceholder}
            multiline
          />

          {form.isError && <Text className="text-small text-destructive">{labels.saveError}</Text>}
        </View>

        <View className="gap-4">
          <SectionHeader title={labels.historyTitle} />
          {isLoading ? (
            <View className="gap-4">
              <Skeleton className="h-24 w-full rounded-3xl" />
              <Skeleton className="h-24 w-full rounded-3xl" />
            </View>
          ) : entries.length > 0 ? (
            entries
              .slice(0, HISTORY_LIMIT)
              .map((entry) => <ActivityEntryCard key={entry.id} entry={entry} />)
          ) : (
            <Text className="text-small font-body text-muted-foreground px-1">
              {labels.emptyHistory}
            </Text>
          )}
        </View>
      </ScrollView>

      <FooterButton label={labels.save} onPress={form.submit} isPending={form.isPending} />
    </View>
  );
}

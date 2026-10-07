// features/medical-record/screens/HistoryFormScreen.tsx
import { ScrollView, View } from 'react-native';
import { SelectFormField, TextFormField } from '@/components/ui/controlled-fields';
import { FooterButton } from '@/components/ui/footer-button';
import { IntroCard } from '@/components/ui/intro-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { optionsFromLabels } from '@/components/ui/select-field';
import { Text } from '@/components/ui/text';
import {
  HISTORY_CATEGORY_LABELS,
  HISTORY_KIND_LABELS,
  MEDICAL_RECORD_LABELS,
  SCREEN_TITLES,
} from '@/constants/labels';
import { MAX_PERIOD_LENGTH } from '../domain/record-schemas';
import { useHistoryForm } from '../hooks/useHistoryForm';

const labels = MEDICAL_RECORD_LABELS.history;
const KIND_OPTIONS = optionsFromLabels(HISTORY_KIND_LABELS);
const CATEGORY_OPTIONS = optionsFromLabels(HISTORY_CATEGORY_LABELS);

export default function HistoryFormScreen() {
  const form = useHistoryForm();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.historyForm} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <IntroCard title={labels.introTitle} description={labels.introDescription} />

        <SelectFormField
          control={form.control}
          name="kind"
          label={labels.kindLabel}
          options={KIND_OPTIONS}
        />
        <SelectFormField
          control={form.control}
          name="category"
          label={labels.categoryLabel}
          options={CATEGORY_OPTIONS}
        />
        <TextFormField
          control={form.control}
          name="title"
          label={labels.titleLabel}
          placeholder={labels.titlePlaceholder}
        />
        <TextFormField
          control={form.control}
          name="period"
          label={labels.dateLabel}
          placeholder={labels.datePlaceholder}
          maxLength={MAX_PERIOD_LENGTH}
        />
        <TextFormField
          control={form.control}
          name="detail"
          label={labels.detailLabel}
          placeholder={labels.detailPlaceholder}
          multiline
        />

        {form.isError && <Text className="text-small text-destructive">{labels.saveError}</Text>}
      </ScrollView>

      <FooterButton label={labels.save} onPress={form.submit} isPending={form.isPending} />
    </View>
  );
}

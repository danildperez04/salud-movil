// features/medical-record/screens/DiagnosisFormScreen.tsx
import { Calendar } from '@/lib/icons';
import { ScrollView, View } from 'react-native';
import { SelectFormField, TextFormField } from '@/components/ui/controlled-fields';
import { FooterButton } from '@/components/ui/footer-button';
import { FormField, PickerField } from '@/components/ui/form-field';
import { IntroCard } from '@/components/ui/intro-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { optionsFromLabels } from '@/components/ui/select-field';
import { Text } from '@/components/ui/text';
import { DIAGNOSIS_STATUS_LABELS, MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { formatDateLong } from '@/lib/date-format';
import { useDiagnosisForm } from '../hooks/useDiagnosisForm';

const labels = MEDICAL_RECORD_LABELS.diagnosis;
const STATUS_OPTIONS = optionsFromLabels(DIAGNOSIS_STATUS_LABELS);

export default function DiagnosisFormScreen() {
  const form = useDiagnosisForm();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.diagnosisForm} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <IntroCard title={labels.introTitle} description={labels.introDescription} />

        <TextFormField
          control={form.control}
          name="name"
          label={labels.nameLabel}
          placeholder={labels.namePlaceholder}
        />
        <SelectFormField
          control={form.control}
          name="status"
          label={labels.statusLabel}
          options={STATUS_OPTIONS}
        />

        <FormField label={labels.dateLabel} error={form.diagnosedAtError}>
          <PickerField
            icon={Calendar}
            value={form.diagnosedAt ? formatDateLong(form.diagnosedAt) : undefined}
            placeholder={labels.datePlaceholder}
            onPress={form.openDatePicker}
          />
          {form.renderIosDatePicker()}
        </FormField>

        <TextFormField
          control={form.control}
          name="provider"
          label={labels.providerLabel}
          placeholder={labels.providerPlaceholder}
        />
        <TextFormField
          control={form.control}
          name="notes"
          label={labels.notesLabel}
          placeholder={labels.notesPlaceholder}
          multiline
        />

        {form.isError && <Text className="text-small text-destructive">{labels.saveError}</Text>}
      </ScrollView>

      <FooterButton label={labels.save} onPress={form.submit} isPending={form.isPending} />
    </View>
  );
}

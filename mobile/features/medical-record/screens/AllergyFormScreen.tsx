// features/medical-record/screens/AllergyFormScreen.tsx
import { ScrollView, View } from 'react-native';
import { SelectFormField, TextFormField } from '@/components/ui/controlled-fields';
import { FooterButton } from '@/components/ui/footer-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { optionsFromLabels } from '@/components/ui/select-field';
import { Text } from '@/components/ui/text';
import {
  ALLERGY_SEVERITY_LABELS,
  ALLERGY_TYPE_LABELS,
  MEDICAL_RECORD_LABELS,
  SCREEN_TITLES,
} from '@/constants/labels';
import { useAllergyForm } from '../hooks/useAllergyForm';

const labels = MEDICAL_RECORD_LABELS.allergies;
const TYPE_OPTIONS = optionsFromLabels(ALLERGY_TYPE_LABELS);
const SEVERITY_OPTIONS = optionsFromLabels(ALLERGY_SEVERITY_LABELS);

export default function AllergyFormScreen() {
  const form = useAllergyForm();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.allergyForm} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <SelectFormField
          control={form.control}
          name="type"
          label={labels.typeLabel}
          options={TYPE_OPTIONS}
        />
        <TextFormField
          control={form.control}
          name="name"
          label={labels.nameLabel}
          placeholder={labels.namePlaceholder}
        />
        <TextFormField
          control={form.control}
          name="reaction"
          label={labels.reactionLabel}
          placeholder={labels.reactionPlaceholder}
        />
        <SelectFormField
          control={form.control}
          name="severity"
          label={labels.severityLabel}
          options={SEVERITY_OPTIONS}
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

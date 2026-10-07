// features/emergency/screens/EmergencyContactFormScreen.tsx
import { ScrollView, View } from 'react-native';
import { SelectFormField, TextFormField } from '@/components/ui/controlled-fields';
import { FooterButton } from '@/components/ui/footer-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { optionsFromLabels } from '@/components/ui/select-field';
import { SwitchRowsCard } from '@/components/ui/switch-rows-card';
import { Text } from '@/components/ui/text';
import { EMERGENCY_LABELS, EMERGENCY_RELATION_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { useEmergencyContactForm } from '../hooks/useEmergencyContactForm';

const labels = EMERGENCY_LABELS.form;
const RELATION_OPTIONS = optionsFromLabels(EMERGENCY_RELATION_LABELS);

export default function EmergencyContactFormScreen() {
  const form = useEmergencyContactForm();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.emergencyContactForm} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <TextFormField
          control={form.control}
          name="name"
          label={labels.nameLabel}
          placeholder={labels.namePlaceholder}
        />
        <SelectFormField
          control={form.control}
          name="relation"
          label={labels.relationLabel}
          options={RELATION_OPTIONS}
        />
        <TextFormField
          control={form.control}
          name="phone"
          label={labels.phoneLabel}
          keyboardType="phone-pad"
        />

        <SwitchRowsCard
          rows={[
            {
              id: 'primary',
              title: labels.primaryTitle,
              subtitle: labels.primarySubtitle,
              checked: form.isPrimary,
              onCheckedChange: form.setPrimary,
            },
          ]}
        />

        {form.isError && <Text className="text-small text-destructive">{labels.saveError}</Text>}
      </ScrollView>

      <FooterButton label={labels.save} onPress={form.submit} isPending={form.isPending} />
    </View>
  );
}

// features/medical-record/screens/LabScanScreen.tsx
import { Calendar, Camera, ImagePlus } from '@/lib/icons';
import { ScrollView, View } from 'react-native';
import { SelectFormField, TextFormField } from '@/components/ui/controlled-fields';
import { FooterButton } from '@/components/ui/footer-button';
import { FormField, PickerField } from '@/components/ui/form-field';
import { IntroCard } from '@/components/ui/intro-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { optionsFromLabels } from '@/components/ui/select-field';
import { Text } from '@/components/ui/text';
import { LAB_STATUS_LABELS, MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { formatDateLong } from '@/lib/date-format';
import { AttachmentPicker } from '../components/AttachmentPicker';
import { useLabScanForm } from '../hooks/useLabScanForm';

const labels = MEDICAL_RECORD_LABELS.labs.scan;
const STATUS_OPTIONS = optionsFromLabels(LAB_STATUS_LABELS);

export default function LabScanScreen() {
  const form = useLabScanForm();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.labScan} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <IntroCard title={labels.introTitle} description={labels.introDescription} />

        <AttachmentPicker
          attachment={form.attachment}
          emptyTitle={labels.emptyTitle}
          emptyDescription={labels.emptyDescription}
          error={form.attachmentError}
          actions={[
            { label: labels.takePhoto, icon: Camera, onPress: form.takePhoto },
            {
              label: labels.chooseImage,
              icon: ImagePlus,
              onPress: form.chooseImage,
              variant: 'outline',
            },
          ]}
        />

        {/* los datos del examen se piden una vez que ya hay una imagen */}
        {form.attachment && (
          <>
            <TextFormField
              control={form.control}
              name="name"
              label={labels.nameLabel}
              placeholder={labels.namePlaceholder}
            />

            <FormField label={labels.dateLabel} error={form.issuedAtError}>
              <PickerField
                icon={Calendar}
                value={form.issuedAt ? formatDateLong(form.issuedAt) : undefined}
                placeholder={labels.datePlaceholder}
                onPress={form.openDatePicker}
              />
              {form.renderIosDatePicker()}
            </FormField>

            <SelectFormField
              control={form.control}
              name="status"
              label={labels.statusLabel}
              options={STATUS_OPTIONS}
            />
            <TextFormField
              control={form.control}
              name="resultValue"
              label={labels.valueLabel}
              placeholder={labels.valuePlaceholder}
            />
            <TextFormField
              control={form.control}
              name="notes"
              label={labels.notesLabel}
              placeholder={labels.notesPlaceholder}
              multiline
            />

            {form.isError && (
              <Text className="text-small text-destructive">{labels.saveError}</Text>
            )}
          </>
        )}
      </ScrollView>

      {form.attachment && (
        <FooterButton label={labels.save} onPress={form.submit} isPending={form.isPending} />
      )}
    </View>
  );
}

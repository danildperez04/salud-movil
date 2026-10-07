// features/medical-record/screens/DocumentUploadScreen.tsx
import { useLocalSearchParams } from 'expo-router';
import { Calendar, Camera, FileText, ImagePlus } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { SelectFormField, TextFormField } from '@/components/ui/controlled-fields';
import { FooterButton } from '@/components/ui/footer-button';
import { FormField, PickerField } from '@/components/ui/form-field';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { formatDateLong } from '@/lib/date-format';
import { AttachmentPicker } from '../components/AttachmentPicker';
import { DOCUMENT_TYPE_OPTIONS, isDocumentCategory } from '../domain/record-catalogs';
import { useDocumentUploadForm } from '../hooks/useDocumentUploadForm';

const labels = MEDICAL_RECORD_LABELS.documents;

export default function DocumentUploadScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const form = useDocumentUploadForm(isDocumentCategory(category) ? category : undefined);

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.documentUpload} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <AttachmentPicker
          attachment={form.attachment}
          emptyTitle={labels.fileEmptyTitle}
          emptyDescription={labels.fileEmptyDescription}
          error={form.attachmentError}
          actions={[
            { label: labels.takePhoto, icon: Camera, onPress: form.takePhoto },
            {
              label: labels.chooseImage,
              icon: ImagePlus,
              onPress: form.chooseImage,
              variant: 'outline',
            },
            {
              label: labels.chooseFile,
              icon: FileText,
              onPress: form.chooseDocument,
              variant: 'outline',
            },
          ]}
        />

        <SelectFormField
          control={form.control}
          name="category"
          label={labels.typeLabel}
          options={DOCUMENT_TYPE_OPTIONS}
        />
        <TextFormField
          control={form.control}
          name="title"
          label={labels.nameLabel}
          placeholder={labels.namePlaceholder}
        />
        <TextFormField
          control={form.control}
          name="provider"
          label={labels.providerLabel}
          placeholder={labels.providerPlaceholder}
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

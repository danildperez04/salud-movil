// features/help/screens/ReportProblemScreen.tsx
import { Paperclip } from '@/lib/icons';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { SelectFormField, TextFormField } from '@/components/ui/controlled-fields';
import { FooterButton } from '@/components/ui/footer-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { optionsFromLabels } from '@/components/ui/select-field';
import { Text } from '@/components/ui/text';
import { HELP_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { colors } from '@/lib/tokens';
import { useReportProblemForm } from '../hooks/useReportProblemForm';

const labels = HELP_LABELS.report;
const CATEGORY_OPTIONS = optionsFromLabels(labels.categories);

export default function ReportProblemScreen() {
  const form = useReportProblemForm();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.reportProblem} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <SelectFormField
          control={form.control}
          name="category"
          label={labels.categoryLabel}
          options={CATEGORY_OPTIONS}
        />
        <TextFormField
          control={form.control}
          name="description"
          label={labels.descriptionLabel}
          placeholder={labels.descriptionPlaceholder}
          multiline
        />
        <TextFormField
          control={form.control}
          name="email"
          label={labels.emailLabel}
          placeholder={labels.emailPlaceholder}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View className="gap-2">
          <Button
            variant="outline"
            size="lg"
            className="border-primary"
            onPress={form.attachScreenshot}
          >
            <Paperclip size={20} color={colors.brandGreen} />
            <Text className="text-body font-heading-semibold text-primary">
              {form.screenshot ? labels.changeAttachment : labels.attach}
            </Text>
          </Button>
          {form.screenshot && (
            <Text className="text-caption font-body text-muted-foreground px-1" numberOfLines={1}>
              {labels.attached(form.screenshot.name)}
            </Text>
          )}
        </View>

        {form.isError && <Text className="text-small text-destructive">{labels.sendError}</Text>}
      </ScrollView>

      <FooterButton label={labels.send} onPress={form.submit} isPending={form.isPending} />
    </View>
  );
}

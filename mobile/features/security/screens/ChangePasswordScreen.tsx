// features/security/screens/ChangePasswordScreen.tsx
import { ScrollView, View } from 'react-native';
import { TextFormField } from '@/components/ui/controlled-fields';
import { FooterButton } from '@/components/ui/footer-button';
import { IntroCard } from '@/components/ui/intro-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { SCREEN_TITLES, SECURITY_LABELS } from '@/constants/labels';
import { useChangePasswordForm } from '../hooks/useChangePasswordForm';

const labels = SECURITY_LABELS.password;

export default function ChangePasswordScreen() {
  const form = useChangePasswordForm();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.changePassword} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <IntroCard title={labels.introTitle} description={labels.introDescription} />

        <TextFormField
          control={form.control}
          name="currentPassword"
          label={labels.currentLabel}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextFormField
          control={form.control}
          name="newPassword"
          label={labels.newLabel}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextFormField
          control={form.control}
          name="confirmPassword"
          label={labels.confirmLabel}
          secureTextEntry
          autoCapitalize="none"
        />

        {form.isError && <Text className="text-small text-destructive">{labels.saveError}</Text>}
      </ScrollView>

      <FooterButton label={labels.save} onPress={form.submit} isPending={form.isPending} />
    </View>
  );
}

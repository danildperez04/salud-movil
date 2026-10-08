// features/security/screens/TwoFactorSettingsScreen.tsx
import { ScrollView, View } from 'react-native';
import { TextFormField } from '@/components/ui/controlled-fields';
import { Button } from '@/components/ui/button';
import { FooterButton } from '@/components/ui/footer-button';
import { IntroCard } from '@/components/ui/intro-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { SCREEN_TITLES, SECURITY_LABELS } from '@/constants/labels';
import { OtpCodeField } from '@/features/auth/components/OtpCodeField';
import { useAppStore } from '@/store';
import { useEnableTwoFactorFlow, useDisableTwoFactorForm } from '../hooks/useTwoFactorFlows';
import { useTwoFactorStatus } from '../hooks/useTwoFactorSettings';

const labels = SECURITY_LABELS.twoFactor;

export default function TwoFactorSettingsScreen() {
  const status = useTwoFactorStatus();
  const sessionValue = useAppStore((state) => state.user?.twoFactorEnabled);
  // El usuario de la sesión se mantiene al día tras activar/desactivar y al consultar /auth/me;
  // si la sesión guardada es anterior al 2FA (sin el campo), vale lo que responda la API.
  const enabled = sessionValue ?? status.data?.twoFactorEnabled;

  if (enabled === undefined) {
    return (
      <View className="bg-background flex-1">
        <ScreenHeader title={SCREEN_TITLES.twoFactor} align="center" />
        <View className="items-center gap-4 px-6 pt-10">
          {status.isError ? (
            <>
              <Text className="text-small text-destructive text-center">
                {labels.statusLoadError}
              </Text>
              <Button variant="outline" onPress={() => status.refetch()}>
                <Text>{labels.retry}</Text>
              </Button>
            </>
          ) : (
            <Spinner />
          )}
        </View>
      </View>
    );
  }

  return enabled ? <DisableView /> : <EnableView />;
}

function StatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <View className="border-border bg-card flex-row items-center justify-between rounded-2xl border px-5 py-4">
      <Text className="text-body font-heading-semibold text-foreground">{labels.statusLabel}</Text>
      <Text
        className={
          enabled
            ? 'text-body font-heading-semibold text-primary'
            : 'text-body font-heading-semibold text-muted-foreground'
        }
      >
        {enabled ? labels.statusOn : labels.statusOff}
      </Text>
    </View>
  );
}

function EnableView() {
  const flow = useEnableTwoFactorFlow();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.twoFactor} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <IntroCard title={labels.introTitle} description={labels.introDescription} />
        <StatusBadge enabled={false} />

        {flow.isCodeStep && (
          <>
            <IntroCard title={labels.codeSentTitle} description={labels.codeSentDescription} />
            <OtpCodeField
              control={flow.control}
              name="code"
              label={labels.codeLabel}
              placeholder="000000"
              testID="enable-otp-input"
              autoFocus
              editable={!flow.isConfirming}
              onSubmitEditing={flow.submit}
            />
          </>
        )}

        {flow.errorMessage && (
          <Text className="text-small text-destructive">{flow.errorMessage}</Text>
        )}

        {flow.isCodeStep && (
          <View className="gap-2">
            <Button
              variant="outline"
              size="lg"
              className="h-14 rounded-2xl"
              onPress={flow.sendCode}
              disabled={flow.resendIn > 0 || flow.isSending || flow.isConfirming}
            >
              {flow.isSending ? (
                <Spinner size="sm" />
              ) : (
                <Text className="text-body text-foreground">
                  {flow.resendIn > 0 ? labels.resendIn(flow.resendIn) : labels.resend}
                </Text>
              )}
            </Button>
            <Button variant="ghost" onPress={flow.cancel} disabled={flow.isConfirming}>
              <Text className="text-small text-secondary-steel">{labels.cancel}</Text>
            </Button>
          </View>
        )}
      </ScrollView>

      {flow.isCodeStep ? (
        <FooterButton label={labels.confirm} onPress={flow.submit} isPending={flow.isConfirming} />
      ) : (
        <FooterButton label={labels.enable} onPress={flow.sendCode} isPending={flow.isSending} />
      )}
    </View>
  );
}

function DisableView() {
  const form = useDisableTwoFactorForm();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.twoFactor} align="center" />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <IntroCard title={labels.introTitle} description={labels.introDescription} />
        <StatusBadge enabled />

        <View className="gap-2">
          <Text className="text-body font-heading-semibold text-foreground">
            {labels.disableTitle}
          </Text>
          <Text className="text-small font-body text-muted-foreground">
            {labels.disableDescription}
          </Text>
        </View>

        <TextFormField
          control={form.control}
          name="password"
          label={labels.passwordLabel}
          secureTextEntry
          autoCapitalize="none"
        />

        {form.errorMessage && (
          <Text className="text-small text-destructive">{form.errorMessage}</Text>
        )}
      </ScrollView>

      <FooterButton label={labels.disable} onPress={form.submit} isPending={form.isPending} />
    </View>
  );
}

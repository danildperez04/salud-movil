// features/health-resources/screens/HospitalGuideScreen.tsx
import { useLocalSearchParams } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { FooterButton } from '@/components/ui/footer-button';
import { FormField } from '@/components/ui/form-field';
import { IntroCard } from '@/components/ui/intro-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SelectField } from '@/components/ui/select-field';
import { ToneBadge } from '@/components/ui/tone-badge';
import { Text } from '@/components/ui/text';
import { HOSPITAL_GUIDE_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { statusColors } from '@/lib/tokens';
import { cn } from '@/lib/utils';
import { HospitalMiniMap } from '../components/HospitalMiniMap';
import { HEALTH_SERVICE_OPTIONS } from '../domain/resource-catalog';
import { useHospitalGuide } from '../hooks/useHospitalGuide';

const labels = HOSPITAL_GUIDE_LABELS;

export default function HospitalGuideScreen() {
  const { resourceId, service: initialService } = useLocalSearchParams<{
    resourceId?: string;
    service?: string;
  }>();
  const { hospitalName, service, setService, route, steps, activeZones, start } = useHospitalGuide(
    resourceId,
    initialService,
  );

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.hospitalGuide} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-6">
        <IntroCard title={labels.introTitle} description={labels.introDescription} />

        <FormField label={labels.serviceLabel}>
          <SelectField
            value={service}
            options={HEALTH_SERVICE_OPTIONS}
            onValueChange={setService}
            placeholder={labels.serviceLabel}
          />
        </FormField>

        <HospitalMiniMap
          title={labels.mapTitle(hospitalName)}
          floor={route.floor}
          activeZones={activeZones}
        />

        <View className="bg-card border-border gap-3 rounded-3xl border p-5">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-body font-heading-semibold text-foreground flex-1">
              {labels.destination(service)}
            </Text>
            <ToneBadge label={route.area} color={statusColors.success} />
          </View>

          {steps.map((step, index) => (
            <View
              key={step.id}
              className={cn('flex-row gap-3', index > 0 && 'border-border border-t pt-3')}
              accessible
            >
              <View className="bg-primary/10 h-8 w-8 items-center justify-center rounded-full">
                <Text className="text-caption font-body-semibold text-primary">{index + 1}</Text>
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-small font-heading-semibold text-foreground">
                  {step.title}
                </Text>
                <Text className="text-caption font-body text-muted-foreground">{step.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <FooterButton label={labels.start} onPress={start} />
    </View>
  );
}

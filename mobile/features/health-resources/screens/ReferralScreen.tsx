// features/health-resources/screens/ReferralScreen.tsx
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { IntroCard } from '@/components/ui/intro-card';
import { NoticeCard } from '@/components/ui/notice-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { optionsFromLabels, SelectField } from '@/components/ui/select-field';
import { Text } from '@/components/ui/text';
import { REFERRAL_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { ResourceCard } from '../components/ResourceCard';
import { HEALTH_SERVICE_OPTIONS } from '../domain/resource-catalog';
import { useReferralSearch } from '../hooks/useReferralSearch';
import { healthResourceRoutes } from '../routes';

const labels = REFERRAL_LABELS;
const PRIORITY_OPTIONS = optionsFromLabels(labels.priorities);

export default function ReferralScreen() {
  const {
    service,
    setService,
    priority,
    setPriority,
    search,
    results,
    searchedService,
    isUrgentSearch,
  } = useReferralSearch();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.referral} align="center" />

      <ScrollView contentContainerClassName="gap-6 px-6 pt-2 pb-10">
        <IntroCard title={labels.introTitle} description={labels.introDescription} />

        <FormField label={labels.serviceLabel}>
          <SelectField
            value={service}
            options={HEALTH_SERVICE_OPTIONS}
            onValueChange={setService}
            placeholder={labels.servicePlaceholder}
          />
        </FormField>

        <FormField label={labels.priorityLabel}>
          <SelectField
            value={priority}
            options={PRIORITY_OPTIONS}
            onValueChange={setPriority}
            placeholder={labels.priorityLabel}
          />
        </FormField>

        <Button size="lg" className="h-14" onPress={search}>
          <Text className="text-body text-primary-foreground">{labels.search}</Text>
        </Button>

        {results && (
          <View className="gap-4">
            <SectionHeader
              title={labels.resultsTitle}
              subtitle={labels.resultsCount(results.length)}
            />

            {isUrgentSearch && (
              <NoticeCard title={labels.urgentTitle} message={labels.urgentMessage} />
            )}

            {results.length > 0 ? (
              results.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onPress={() => router.push(healthResourceRoutes.resource(resource.id))}
                />
              ))
            ) : (
              <Text className="text-small font-body text-muted-foreground px-1">
                {labels.noResults}
              </Text>
            )}

            {searchedService && results.length > 0 && (
              <Button
                variant="outline"
                size="lg"
                className="border-primary"
                onPress={() => router.push(healthResourceRoutes.waitTimes)}
              >
                <Text className="text-body font-heading-semibold text-primary">
                  {labels.compareWaitTimes}
                </Text>
              </Button>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// features/emergency/screens/EmergencyScreen.tsx
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { InfoTileGrid } from '@/components/ui/info-tile';
import { IntroCard } from '@/components/ui/intro-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { EMERGENCY_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { EmergencyContactCard } from '../components/EmergencyContactCard';
import { LocationShareCard } from '../components/LocationShareCard';
import { useEmergencyMode } from '../hooks/useEmergencyMode';
import { emergencyRoutes } from '../routes';

const labels = EMERGENCY_LABELS;

export default function EmergencyScreen() {
  const {
    tiles,
    contacts,
    isLoadingContacts,
    shareLocation,
    setShareLocation,
    callContact,
    requestHelp,
  } = useEmergencyMode();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.emergency} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-10">
        <IntroCard tone="danger" title={labels.introTitle} description={labels.introDescription} />

        <InfoTileGrid tiles={tiles} />

        <View className="gap-3">
          <SectionHeader
            title={labels.contactsTitle}
            action={{
              label: labels.addContact,
              onPress: () => router.push(emergencyRoutes.newContact),
            }}
          />

          {isLoadingContacts ? (
            <Skeleton className="h-24 w-full rounded-3xl" />
          ) : contacts.length > 0 ? (
            contacts.map((contact) => (
              <EmergencyContactCard
                key={contact.id}
                contact={contact}
                onCall={() => callContact(contact.phone)}
              />
            ))
          ) : (
            <Text className="text-small font-body text-muted-foreground px-1">
              {labels.noContacts}
            </Text>
          )}
        </View>

        <LocationShareCard enabled={shareLocation} onChange={setShareLocation} />

        <View className="gap-3">
          <Button variant="destructive" size="lg" onPress={requestHelp}>
            <Text className="text-body text-white">{labels.sos}</Text>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-primary"
            onPress={() => router.push('/(app)/health-map')}
          >
            <Text className="text-body font-heading-semibold text-primary">
              {labels.nearbyResources}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

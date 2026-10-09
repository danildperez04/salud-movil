// features/security/screens/DevicesScreen.tsx
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { SCREEN_TITLES, SECURITY_LABELS } from '@/constants/labels';
import { DeviceCard } from '../components/DeviceCard';
import { useDeviceManagement } from '../hooks/useDeviceManagement';

const { devices } = SECURITY_LABELS;

export default function DevicesScreen() {
  const { sessions, isLoading, hasOtherSessions, close, confirmCloseOthers, isBusy, isError } =
    useDeviceManagement();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.devices} align="center" />

      <ScrollView contentContainerClassName="gap-4 px-6 pt-2 pb-10">
        {isLoading ? (
          <View className="gap-4">
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-28 w-full rounded-3xl" />
          </View>
        ) : (
          sessions.map((session) => (
            <DeviceCard
              key={session.id}
              session={session}
              disabled={isBusy}
              onClose={() => close(session.id)}
            />
          ))
        )}

        {isError && <Text className="text-small text-destructive">{devices.error}</Text>}

        {hasOtherSessions && (
          <Button
            variant="outline"
            size="lg"
            className="border-destructive/50"
            onPress={confirmCloseOthers}
            disabled={isBusy}
          >
            <Text className="text-body font-heading-semibold text-destructive">
              {devices.closeOthers}
            </Text>
          </Button>
        )}
      </ScrollView>
    </View>
  );
}

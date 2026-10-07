// features/medical-record/screens/LabsScreen.tsx
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { LabResultCard } from '../components/LabResultCard';
import { LabScanBanner } from '../components/LabScanBanner';
import { useLabs } from '../hooks/useMedicalRecord';
import { recordRoutes } from '../routes';

const labels = MEDICAL_RECORD_LABELS.labs;

export default function LabsScreen() {
  const { data: labs, isLoading } = useLabs();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.labs} align="center" />

      <ScrollView contentContainerClassName="gap-6 px-6 pt-2 pb-10">
        <LabScanBanner onPress={() => router.push(recordRoutes.scanLab)} />

        <View className="gap-4">
          <SectionHeader title={labels.listTitle} subtitle={labels.listSubtitle} />

          {isLoading ? (
            <View className="gap-4">
              <Skeleton className="h-32 w-full rounded-3xl" />
              <Skeleton className="h-32 w-full rounded-3xl" />
            </View>
          ) : labs && labs.length > 0 ? (
            labs.map((lab) => (
              <LabResultCard
                key={lab.id}
                lab={lab}
                onPress={() => router.push(recordRoutes.lab(lab.id))}
              />
            ))
          ) : (
            <Text className="text-small font-body text-muted-foreground px-1">{labels.empty}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

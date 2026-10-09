// features/medical-record/screens/AllergiesScreen.tsx
import { router } from 'expo-router';
import { TriangleAlert } from '@/lib/icons';
import { ScrollView, View } from 'react-native';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { FooterButton } from '@/components/ui/footer-button';
import { NoticeCard } from '@/components/ui/notice-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { AllergyCard } from '../components/AllergyCard';
import { useAllergies } from '../hooks/useMedicalRecord';
import { recordRoutes } from '../routes';

const labels = MEDICAL_RECORD_LABELS.allergies;

export default function AllergiesScreen() {
  const { data: allergies, isLoading } = useAllergies();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.allergies} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-6">
        {isLoading ? (
          <Skeleton className="h-44 w-full rounded-3xl" />
        ) : allergies && allergies.length > 0 ? (
          allergies.map((allergy) => <AllergyCard key={allergy.id} allergy={allergy} />)
        ) : (
          <EmptyStateCard
            icon={TriangleAlert}
            tone="danger"
            title={labels.emptyTitle}
            description={labels.emptyDescription}
          />
        )}

        <NoticeCard title={labels.noticeTitle} message={labels.noticeMessage} />
      </ScrollView>

      <FooterButton label={labels.add} onPress={() => router.push(recordRoutes.newAllergy)} />
    </View>
  );
}

// features/medical-record/screens/HistoryScreen.tsx
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { FooterButton } from '@/components/ui/footer-button';
import { InfoRowsCard } from '@/components/ui/info-rows-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import type { HistoryEntry } from '../api/mock-medical-record';
import { describeHistoryEntry } from '../domain/record-format';
import { useHistoryEntries } from '../hooks/useMedicalRecord';
import { recordRoutes } from '../routes';

const labels = MEDICAL_RECORD_LABELS.history;

export default function HistoryScreen() {
  const { data: entries, isLoading } = useHistoryEntries();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.history} align="center" />

      <ScrollView contentContainerClassName="gap-6 px-6 pt-2 pb-6">
        {isLoading ? (
          <View className="gap-6">
            <Skeleton className="h-52 w-full rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-3xl" />
          </View>
        ) : (
          <>
            <HistorySection
              title={labels.personal}
              emptyMessage={labels.emptyPersonal}
              entries={(entries ?? []).filter((entry) => entry.kind === 'personal')}
            />
            <HistorySection
              title={labels.family}
              emptyMessage={labels.emptyFamily}
              entries={(entries ?? []).filter((entry) => entry.kind === 'family')}
            />
          </>
        )}
      </ScrollView>

      <FooterButton label={labels.add} onPress={() => router.push(recordRoutes.newHistoryEntry)} />
    </View>
  );
}

type HistorySectionProps = {
  title: string;
  emptyMessage: string;
  entries: HistoryEntry[];
};

function HistorySection({ title, emptyMessage, entries }: HistorySectionProps) {
  return (
    <View className="gap-3">
      <SectionHeader title={title} />
      {entries.length > 0 ? (
        <InfoRowsCard
          rows={entries.map((entry) => ({
            id: entry.id,
            title: entry.title,
            subtitle: describeHistoryEntry(entry),
          }))}
        />
      ) : (
        <Text className="text-small font-body text-muted-foreground px-1">{emptyMessage}</Text>
      )}
    </View>
  );
}

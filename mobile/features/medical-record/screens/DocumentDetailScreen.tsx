// features/medical-record/screens/DocumentDetailScreen.tsx
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { DocumentSheet } from '../components/DocumentSheet';
import { documentShareContent } from '../domain/share-content';
import { useDocument } from '../hooks/useMedicalRecord';
import { useShareRecord } from '../hooks/useShareRecord';

const labels = MEDICAL_RECORD_LABELS.documents;

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: document, isLoading } = useDocument(id);
  const shareRecord = useShareRecord();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.documentDetail} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-10">
        {isLoading ? (
          <Skeleton className="h-72 w-full rounded-3xl" />
        ) : document ? (
          <>
            <DocumentSheet document={document} />
            <Button
              variant="outline"
              size="lg"
              className="border-primary"
              onPress={() => shareRecord(documentShareContent(document))}
            >
              <Text className="text-body font-heading-semibold text-primary">{labels.share}</Text>
            </Button>
          </>
        ) : (
          <Text className="text-body text-muted-foreground py-10 text-center">
            {labels.notFound}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

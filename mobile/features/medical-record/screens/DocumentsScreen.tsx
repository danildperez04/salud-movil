// features/medical-record/screens/DocumentsScreen.tsx
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { FooterButton } from '@/components/ui/footer-button';
import { IntroCard } from '@/components/ui/intro-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { DocumentCard } from '../components/DocumentCard';
import { DocumentCategoryTile } from '../components/DocumentCategoryTile';
import { DOCUMENT_CATEGORY_KEYS } from '../domain/record-catalogs';
import { useDocuments } from '../hooks/useMedicalRecord';
import { recordRoutes } from '../routes';

const labels = MEDICAL_RECORD_LABELS.documents;

/** Cuántos documentos se muestran en "Recientes". */
const RECENT_LIMIT = 3;

/** Las categorías se muestran de dos en dos. */
const CATEGORY_ROWS = [DOCUMENT_CATEGORY_KEYS.slice(0, 2), DOCUMENT_CATEGORY_KEYS.slice(2)];

export default function DocumentsScreen() {
  const { data: documents, isLoading } = useDocuments();
  const recent = (documents ?? []).slice(0, RECENT_LIMIT);

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.documents} align="center" />

      <ScrollView contentContainerClassName="gap-6 px-6 pt-2 pb-6">
        <IntroCard title={labels.introTitle} description={labels.introDescription} />

        <View className="gap-3">
          {CATEGORY_ROWS.map((row) => (
            <View key={row.join('-')} className="flex-row gap-3">
              {row.map((category) => (
                <DocumentCategoryTile
                  key={category}
                  category={category}
                  onPress={() => router.push(recordRoutes.documentCategory(category))}
                />
              ))}
            </View>
          ))}
        </View>

        <View className="gap-4">
          <SectionHeader title={labels.recent} />
          {isLoading ? (
            <Skeleton className="h-28 w-full rounded-3xl" />
          ) : recent.length > 0 ? (
            recent.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                variant="recent"
                onPress={() => router.push(recordRoutes.document(document.id))}
              />
            ))
          ) : (
            <Text className="text-small font-body text-muted-foreground px-1">
              {labels.emptyRecent}
            </Text>
          )}
        </View>
      </ScrollView>

      <FooterButton
        label={labels.upload}
        onPress={() => router.push(recordRoutes.uploadDocument())}
      />
    </View>
  );
}

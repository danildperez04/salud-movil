// features/medical-record/screens/DocumentCategoryScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { FooterButton } from '@/components/ui/footer-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { DOCUMENT_CATEGORIES, MEDICAL_RECORD_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { DocumentCard } from '../components/DocumentCard';
import { isDocumentCategory } from '../domain/record-catalogs';
import { useDocuments } from '../hooks/useMedicalRecord';
import { recordRoutes } from '../routes';

const labels = MEDICAL_RECORD_LABELS.documents;

export default function DocumentCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const validCategory = isDocumentCategory(category) ? category : undefined;
  const { data: documents, isLoading } = useDocuments(validCategory);

  return (
    <View className="bg-background flex-1">
      <ScreenHeader
        title={validCategory ? DOCUMENT_CATEGORIES[validCategory].title : SCREEN_TITLES.documents}
        align="center"
      />

      {!validCategory ? (
        <Text className="text-body text-muted-foreground px-6 py-10 text-center">
          {labels.notFoundCategory}
        </Text>
      ) : (
        <>
          <ScrollView contentContainerClassName="gap-4 px-6 pt-2 pb-6">
            {isLoading ? (
              <View className="gap-4">
                <Skeleton className="h-28 w-full rounded-3xl" />
                <Skeleton className="h-28 w-full rounded-3xl" />
              </View>
            ) : documents && documents.length > 0 ? (
              documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  variant="category"
                  onPress={() => router.push(recordRoutes.document(document.id))}
                />
              ))
            ) : (
              <Text className="text-body text-muted-foreground py-10 text-center">
                {labels.emptyCategory}
              </Text>
            )}
          </ScrollView>

          <FooterButton
            label={labels.upload}
            onPress={() => router.push(recordRoutes.uploadDocument(validCategory))}
          />
        </>
      )}
    </View>
  );
}

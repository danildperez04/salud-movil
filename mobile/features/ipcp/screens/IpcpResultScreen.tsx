// features/ipcp/screens/IpcpResultScreen.tsx
import { router } from 'expo-router';
import { ClipboardList } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { FooterButton } from '@/components/ui/footer-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { IPCP_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { RecommendationsCard } from '../components/RecommendationsCard';
import { RiskBanner } from '../components/RiskBanner';
import { RiskSummaryCard } from '../components/RiskSummaryCard';
import { useIpcpResult } from '../hooks/useIpcpResult';
import { ipcpRoutes } from '../routes';

const labels = IPCP_LABELS.result;

export default function IpcpResultScreen() {
  const { result, isLoading } = useIpcpResult();
  const content = result ? labels.levels[result.level] : undefined;

  // replace: repetir la evaluación no apila otra pantalla encima del resultado
  const repeatAssessment = () => router.replace(ipcpRoutes.assessment);

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.ipcp} align="center" />

      {isLoading ? (
        <View className="gap-5 px-6 pt-2">
          <Skeleton className="h-52 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-28 w-full rounded-3xl" />
        </View>
      ) : result && content ? (
        <>
          <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-6">
            <RiskSummaryCard result={result} />
            <RiskBanner result={result} />

            <View className="bg-card border-border gap-2 rounded-3xl border p-5 shadow-lg shadow-black/5">
              <Text role="heading" className="text-body font-heading-semibold text-foreground">
                {labels.meaningTitle}
              </Text>
              <Text className="text-small font-body text-muted-foreground">{content.meaning}</Text>
            </View>

            <RecommendationsCard recommendations={content.recommendations} />

            <Text className="text-caption font-body text-muted-foreground px-2 text-center">
              {labels.disclaimer}
            </Text>
          </ScrollView>

          <FooterButton label={labels.repeat} onPress={repeatAssessment} />
        </>
      ) : (
        <>
          <View className="flex-1 px-6 pt-2">
            <EmptyStateCard
              icon={ClipboardList}
              title={labels.empty.title}
              description={labels.empty.description}
            />
          </View>
          <FooterButton label={labels.empty.action} onPress={repeatAssessment} />
        </>
      )}
    </View>
  );
}

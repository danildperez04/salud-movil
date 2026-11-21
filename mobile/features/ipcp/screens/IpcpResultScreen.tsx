// features/ipcp/screens/IpcpResultScreen.tsx
import { router } from 'expo-router';
import { Activity, TriangleAlert } from '@/lib/icons';
import { ScrollView, View } from 'react-native';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { FooterButton } from '@/components/ui/footer-button';
import { NoticeCard } from '@/components/ui/notice-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { COMMON_LABELS, IPCP_LABELS, SCREEN_TITLES } from '@/constants/labels';
import type { IpcpReport } from '../domain/ipcp-model';
import { DriversCard } from '../components/DriversCard';
import { RecommendationsCard } from '../components/RecommendationsCard';
import { RiskBanner } from '../components/RiskBanner';
import { RiskSummaryCard } from '../components/RiskSummaryCard';
import { useIpcpResult } from '../hooks/useIpcpResult';

const labels = IPCP_LABELS.result;

type ReadyReport = Extract<IpcpReport, { status: 'ready' }>;
type InsufficientReport = Extract<IpcpReport, { status: 'insufficient' }>;

function ReadyContent({ result }: { result: ReadyReport }) {
  const content = labels.levels[result.level];

  return (
    <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-10">
      <RiskSummaryCard result={result} />
      <RiskBanner result={result} />
      <DriversCard drivers={result.drivers} trend={result.trend} coverage={result.coverage} />

      <View className="bg-card border-border gap-2 rounded-3xl border p-5 shadow-lg shadow-black/5">
        <Text role="heading" className="text-body font-heading-semibold text-foreground">
          {labels.meaningTitle}
        </Text>
        <Text className="text-small font-body text-muted-foreground">{content.meaning}</Text>
      </View>

      <RecommendationsCard recommendations={content.recommendations} />

      <NoticeCard
        icon={TriangleAlert}
        title={labels.emergencyNotice.title}
        message={labels.emergencyNotice.message}
      />

      <Text className="text-caption font-body text-muted-foreground px-2 text-center">
        {labels.disclaimer}
      </Text>
    </ScrollView>
  );
}

/** Todavía no hay datos para calcularlo: dice qué hace falta registrar. */
function InsufficientContent({ result }: { result: InsufficientReport }) {
  const missing = (['clinical', 'adherence'] as const).filter(
    (id) => result.components.find((component) => component.id === id)?.points === null,
  );

  return (
    <>
      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-6">
        <EmptyStateCard
          icon={Activity}
          title={labels.insufficient.title}
          description={labels.insufficient.description}
        />

        {missing.length > 0 && (
          <View className="bg-card border-border gap-3 rounded-3xl border p-5 shadow-lg shadow-black/5">
            <Text role="heading" className="text-body font-heading-semibold text-foreground">
              {labels.insufficient.missingTitle}
            </Text>
            {missing.map((id) => (
              <Text key={id} className="text-small font-body text-muted-foreground">
                • {labels.insufficient.missing[id]}
              </Text>
            ))}
          </View>
        )}

        <Text className="text-caption font-body text-muted-foreground px-2 text-center">
          {labels.disclaimer}
        </Text>
      </ScrollView>

      <FooterButton
        label={labels.insufficient.action}
        onPress={() => router.push('/(app)/health-indicators/new')}
      />
    </>
  );
}

export default function IpcpResultScreen() {
  const { result, isLoading, isError, refetch } = useIpcpResult();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.ipcp} align="center" />

      {isLoading ? (
        <View className="gap-5 px-6 pt-2">
          <Skeleton className="h-52 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-28 w-full rounded-3xl" />
        </View>
      ) : isError || !result ? (
        <>
          <View className="flex-1 px-6 pt-2">
            <EmptyStateCard
              icon={TriangleAlert}
              tone="danger"
              title={labels.error.title}
              description={labels.error.description}
            />
          </View>
          <FooterButton label={COMMON_LABELS.retry} onPress={() => refetch()} />
        </>
      ) : result.status === 'ready' ? (
        <ReadyContent result={result} />
      ) : (
        <InsufficientContent result={result} />
      )}
    </View>
  );
}

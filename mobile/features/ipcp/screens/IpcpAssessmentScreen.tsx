// features/ipcp/screens/IpcpAssessmentScreen.tsx
import { TriangleAlert } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { FooterButton } from '@/components/ui/footer-button';
import { IntroCard } from '@/components/ui/intro-card';
import { NoticeCard } from '@/components/ui/notice-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { IPCP_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { QuestionCard } from '../components/QuestionCard';
import { IPCP_QUESTION_IDS, isRedFlag } from '../domain/ipcp-questions';
import { useIpcpAssessment } from '../hooks/useIpcpAssessment';

const labels = IPCP_LABELS.assessment;

export default function IpcpAssessmentScreen() {
  const { answers, setAnswer, answeredCount, total, isComplete, submit, isPending, isError } =
    useIpcpAssessment();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.ipcp} align="center" />

      <ScrollView contentContainerClassName="gap-5 px-6 pt-2 pb-6">
        <IntroCard title={labels.introTitle} description={labels.introDescription} />

        <View className="gap-2 px-1">
          <View className="bg-muted/40 h-2 overflow-hidden rounded-full">
            <View
              className="bg-primary h-full rounded-full"
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </View>
          <Text
            accessibilityLiveRegion="polite"
            className="text-caption font-body-semibold text-muted-foreground"
          >
            {isComplete ? labels.progressDone : labels.progress(answeredCount, total)}
          </Text>
        </View>

        {IPCP_QUESTION_IDS.map((id, index) => (
          <QuestionCard
            key={id}
            position={index + 1}
            total={total}
            title={labels.questions[id].title}
            low={labels.questions[id].low}
            high={labels.questions[id].high}
            redFlag={isRedFlag(id)}
            value={answers[id]}
            onChange={(value) => setAnswer(id, value)}
          />
        ))}

        <NoticeCard
          icon={TriangleAlert}
          title={labels.noticeTitle}
          message={labels.noticeMessage}
        />

        {isError && <Text className="text-small text-destructive">{labels.submitError}</Text>}
      </ScrollView>

      <FooterButton
        label={labels.submit}
        onPress={submit}
        isPending={isPending}
        disabled={!isComplete}
      />
    </View>
  );
}

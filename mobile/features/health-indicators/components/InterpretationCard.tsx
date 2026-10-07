// features/health-indicators/components/InterpretationCard.tsx
import { NoticeCard } from '@/components/ui/notice-card';
import { INDICATOR_EVOLUTION_LABELS } from '@/constants/labels';

export function InterpretationCard({ message }: { message: string }) {
  return <NoticeCard title={INDICATOR_EVOLUTION_LABELS.interpretationTitle} message={message} />;
}

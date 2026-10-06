// components/ui/summary-tabs-list.tsx
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { SUMMARY_TABS_LABELS } from '@/constants/labels';
import { cn } from '@/lib/utils';

export type SummaryTab = 'summary' | 'history';

const TABS: { value: SummaryTab; label: string }[] = [
  { value: 'summary', label: SUMMARY_TABS_LABELS.summary },
  { value: 'history', label: SUMMARY_TABS_LABELS.history },
];

type SummaryTabsListProps = {
  /** pestaña activa, para colorear el texto */
  value: SummaryTab;
};

/** Pestañas Resumen/Historial a mitad de ancho cada una. Va dentro de <Tabs>. */
export function SummaryTabsList({ value }: SummaryTabsListProps) {
  return (
    <TabsList className="gap-0 px-6">
      {TABS.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
          <Text
            className={cn(
              'text-body font-heading-semibold',
              value === tab.value ? 'text-primary' : 'text-secondary-steel',
            )}
          >
            {tab.label}
          </Text>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

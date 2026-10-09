// components/ui/empty-state-card.tsx
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors, statusColors } from '@/lib/tokens';
import { cn } from '@/lib/utils';

type EmptyStateCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: 'primary' | 'danger';
};

/** Tarjeta punteada para listas sin elementos. */
export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  tone = 'primary',
}: EmptyStateCardProps) {
  return (
    <View className="border-border bg-card items-center gap-3 rounded-3xl border border-dashed px-6 py-8">
      <View
        className={cn(
          'h-16 w-16 items-center justify-center rounded-full',
          tone === 'danger' ? 'bg-destructive/10' : 'bg-primary/10',
        )}
      >
        <Icon size={28} color={tone === 'danger' ? statusColors.danger : colors.brandGreen} />
      </View>
      <Text className="text-body font-heading-semibold text-foreground text-center">{title}</Text>
      <Text className="text-small font-body text-muted-foreground text-center">{description}</Text>
    </View>
  );
}

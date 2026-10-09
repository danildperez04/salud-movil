// features/help/components/FaqItemCard.tsx
import { Minus, Plus } from '@/lib/icons';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/lib/tokens';
import type { FaqItem } from '../api/mock-help';

type FaqItemCardProps = {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
};

/** Pregunta que se expande para mostrar su respuesta. */
export function FaqItemCard({ item, open, onToggle }: FaqItemCardProps) {
  const Icon = open ? Minus : Plus;

  return (
    <View className="bg-card border-border overflow-hidden rounded-2xl border">
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="flex-row items-center justify-between gap-3 px-5 py-4 active:opacity-80"
      >
        <Text className="text-small font-heading-semibold text-foreground flex-1">
          {item.question}
        </Text>
        <Icon size={18} color={colors.brandGreen} />
      </Pressable>

      {open && (
        <Text className="text-small font-body text-muted-foreground px-5 pb-4">{item.answer}</Text>
      )}
    </View>
  );
}

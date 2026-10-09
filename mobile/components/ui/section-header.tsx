// components/ui/section-header.tsx
import { ChevronRight } from '@/lib/icons';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/lib/tokens';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  /** Enlace a la derecha del título (ej. "Ver historial"). */
  action?: { label: string; onPress: () => void; chevron?: boolean };
};

/** Título de sección con subtítulo y acción opcionales. */
export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between gap-4 px-1">
      <View className="flex-1 gap-0.5">
        <Text role="heading" className="text-body font-heading-semibold text-foreground">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-caption font-body text-muted-foreground">{subtitle}</Text>
        )}
      </View>

      {action && (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          hitSlop={8}
          className="flex-row items-center gap-0.5 active:opacity-70"
        >
          <Text className="text-small font-body-semibold text-primary">{action.label}</Text>
          {action.chevron && <ChevronRight size={16} color={colors.brandGreen} />}
        </Pressable>
      )}
    </View>
  );
}

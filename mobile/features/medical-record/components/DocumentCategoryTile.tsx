// features/medical-record/components/DocumentCategoryTile.tsx
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { DOCUMENT_CATEGORIES } from '@/constants/labels';
import { colors } from '@/lib/tokens';
import type { DocumentCategory } from '../domain/record-catalogs';
import { DOCUMENT_CATEGORY_ICONS } from './record-visuals';

type DocumentCategoryTileProps = {
  category: DocumentCategory;
  onPress: () => void;
};

/** Atajo a una categoría de documentos (se muestran de dos en dos). */
export function DocumentCategoryTile({ category, onPress }: DocumentCategoryTileProps) {
  const { title, subtitle } = DOCUMENT_CATEGORIES[category];
  const Icon = DOCUMENT_CATEGORY_ICONS[category];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="bg-card border-border flex-1 gap-3 rounded-3xl border p-4 shadow-lg shadow-black/5 active:opacity-80"
    >
      <View className="flex-row items-start justify-between">
        <View className="bg-primary/10 h-12 w-12 items-center justify-center rounded-2xl">
          <Icon size={22} color={colors.brandGreen} />
        </View>
        <ChevronRight size={18} color={colors.secondarySteel} />
      </View>

      <View className="gap-0.5">
        <Text className="text-body font-heading-semibold text-foreground">{title}</Text>
        <Text className="text-caption font-body text-muted-foreground">{subtitle}</Text>
      </View>
    </Pressable>
  );
}

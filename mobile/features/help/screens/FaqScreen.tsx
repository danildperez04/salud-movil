// features/help/screens/FaqScreen.tsx
import { ScrollView, View } from 'react-native';
import { FIELD_CLASS_NAME } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { HELP_LABELS, SCREEN_TITLES } from '@/constants/labels';
import { FaqItemCard } from '../components/FaqItemCard';
import { useFaq } from '../hooks/useFaq';

const labels = HELP_LABELS.faq;

export default function FaqScreen() {
  const { items, isLoading, query, setQuery, openId, toggle } = useFaq();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.faq} align="center" />

      <ScrollView
        contentContainerClassName="gap-3 px-6 pt-2 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        <Input
          className={FIELD_CLASS_NAME}
          placeholder={labels.searchPlaceholder}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        {isLoading ? (
          <View className="gap-3">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </View>
        ) : items.length > 0 ? (
          items.map((item) => (
            <FaqItemCard
              key={item.id}
              item={item}
              open={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))
        ) : (
          <Text className="text-small font-body text-muted-foreground px-1 py-4 text-center">
            {labels.empty}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

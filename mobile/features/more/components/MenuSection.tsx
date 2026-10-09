// features/more/components/MenuSection.tsx
import { router } from 'expo-router';
import { ChevronRight } from '@/lib/icons';
import { Fragment } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { MORE_LABELS } from '@/constants/labels';
import { cn } from '@/lib/utils';
import type { MenuItem, MenuSection as MenuSectionData } from '../domain/menu-sections';

const ICON_COLOR = { default: '#2DB79A', danger: '#DC2626' } as const;

function MenuRow({ item }: { item: MenuItem }) {
  const { icon: Icon, title, subtitle, href, tone = 'default' } = item;
  const isDanger = tone === 'danger';

  return (
    <Pressable
      disabled={!href}
      onPress={() => href && router.push(href)}
      accessibilityRole="button"
      accessibilityState={{ disabled: !href }}
      className="active:bg-muted/20 flex-row items-center gap-4 px-4 py-4"
    >
      <View
        className={cn(
          'h-11 w-11 items-center justify-center rounded-2xl',
          isDanger ? 'bg-destructive/10' : 'bg-primary/10',
        )}
      >
        <Icon size={20} color={ICON_COLOR[tone]} />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-small font-heading-semibold text-foreground">{title}</Text>
        <Text className="text-caption font-body text-muted-foreground" numberOfLines={2}>
          {subtitle}
        </Text>
      </View>

      {href ? (
        <ChevronRight size={18} color="#2D7F8E" />
      ) : (
        <View className="bg-muted/40 rounded-full px-2.5 py-1">
          <Text className="text-caption font-body-semibold text-muted-foreground">
            {MORE_LABELS.comingSoon}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export function MenuSection({ section }: { section: MenuSectionData }) {
  return (
    <View className="gap-3">
      <Text className="text-caption font-body-semibold text-muted-foreground px-1 tracking-widest uppercase">
        {section.title}
      </Text>

      <View className="bg-card border-border overflow-hidden rounded-3xl border shadow-lg shadow-black/5">
        {section.items.map((item, index) => (
          <Fragment key={item.id}>
            {index > 0 && <View className="bg-border/60 ml-[76px] h-px" />}
            <MenuRow item={item} />
          </Fragment>
        ))}
      </View>
    </View>
  );
}

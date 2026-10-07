// components/ui/switch-rows-card.tsx
import { Fragment } from 'react';
import { View } from 'react-native';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';

export type SwitchRow = {
  id: string;
  title: string;
  subtitle: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

/** Tarjeta con varias filas "título + descripción + switch", separadas por una línea. */
export function SwitchRowsCard({ rows }: { rows: SwitchRow[] }) {
  return (
    <View className="bg-card border-border rounded-3xl border px-5 shadow-lg shadow-black/5">
      {rows.map((row, index) => (
        <Fragment key={row.id}>
          {index > 0 && <View className="bg-border/60 h-px" />}
          <View className="flex-row items-center justify-between gap-4 py-5">
            <View className="flex-1 gap-1">
              <Text className="text-body font-heading-semibold text-foreground">{row.title}</Text>
              <Text className="text-small font-body text-muted-foreground">{row.subtitle}</Text>
            </View>
            <Switch
              checked={row.checked}
              onCheckedChange={row.onCheckedChange}
              aria-label={row.title}
            />
          </View>
        </Fragment>
      ))}
    </View>
  );
}

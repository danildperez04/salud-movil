// components/ui/info-rows-card.tsx
import { Fragment } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export type InfoRow = {
  id: string;
  title: string;
  subtitle?: string;
};

/** Tarjeta con filas "título + detalle" separadas por una línea (datos de solo lectura). */
export function InfoRowsCard({ rows }: { rows: InfoRow[] }) {
  return (
    <View className="bg-card border-border rounded-3xl border px-5 shadow-lg shadow-black/5">
      {rows.map((row, index) => (
        <Fragment key={row.id}>
          {index > 0 && <View className="bg-border/60 h-px" />}
          <View className="gap-1 py-4" accessible>
            <Text className="text-body font-heading-semibold text-foreground">{row.title}</Text>
            {row.subtitle ? (
              <Text className="text-small font-body text-muted-foreground">{row.subtitle}</Text>
            ) : null}
          </View>
        </Fragment>
      ))}
    </View>
  );
}

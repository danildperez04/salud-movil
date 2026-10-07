// components/ui/info-tile.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type InfoTileProps = {
  label: string;
  value: string;
  className?: string;
};

/** Dato corto con su etiqueta en mayúsculas (FECHA / 15 de mayo). */
export function InfoTile({ label, value, className }: InfoTileProps) {
  return (
    <View
      className={cn('bg-card border-border gap-1 rounded-2xl border px-4 py-3', className)}
      accessible
    >
      <Text className="text-caption font-body-semibold text-muted-foreground tracking-widest uppercase">
        {label}
      </Text>
      <Text className="text-body font-heading-semibold text-foreground">{value}</Text>
    </View>
  );
}

export type InfoTileData = { id: string; label: string; value: string };

/** Cuadrícula de dos columnas de InfoTile. */
export function InfoTileGrid({ tiles }: { tiles: InfoTileData[] }) {
  const rows: InfoTileData[][] = [];
  for (let index = 0; index < tiles.length; index += 2) rows.push(tiles.slice(index, index + 2));

  return (
    <View className="gap-3">
      {rows.map((row) => (
        <View key={row.map((tile) => tile.id).join('-')} className="flex-row gap-3">
          {row.map((tile) => (
            <InfoTile key={tile.id} className="flex-1" label={tile.label} value={tile.value} />
          ))}
          {/* con un número impar, la última fila conserva el ancho de media columna */}
          {row.length === 1 && <View className="flex-1" />}
        </View>
      ))}
    </View>
  );
}

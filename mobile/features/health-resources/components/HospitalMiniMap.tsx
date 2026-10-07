// features/health-resources/components/HospitalMiniMap.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { HOSPITAL_GUIDE_LABELS } from '@/constants/labels';
import { cn } from '@/lib/utils';
import { HOSPITAL_ZONES, type HospitalZone } from '../domain/hospital-guide';

const ZONES_PER_ROW = 3;

// filas fijas de tres zonas: con porcentajes de ancho, en pantallas angostas una fila se partiría
const ZONE_ROWS: HospitalZone[][] = [];
for (let index = 0; index < HOSPITAL_ZONES.length; index += ZONES_PER_ROW) {
  ZONE_ROWS.push(HOSPITAL_ZONES.slice(index, index + ZONES_PER_ROW));
}

type HospitalMiniMapProps = {
  /** zonas resaltadas (recepción y el destino) */
  activeZones: HospitalZone[];
  title: string;
  floor: string;
};

/** Plano esquemático del hospital: seis zonas, con la ruta y el destino resaltados. */
export function HospitalMiniMap({ activeZones, title, floor }: HospitalMiniMapProps) {
  return (
    <View className="bg-primary/5 border-primary/20 gap-3 rounded-3xl border p-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-body font-heading-semibold text-foreground flex-1" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-caption font-body-semibold text-primary">{floor}</Text>
      </View>

      <View className="bg-card border-border gap-2 rounded-2xl border p-3">
        {ZONE_ROWS.map((row) => (
          <View key={row.join('-')} className="flex-row gap-2">
            {row.map((zone) => {
              const isActive = activeZones.includes(zone);
              return (
                <View
                  key={zone}
                  className={cn(
                    'h-16 flex-1 items-center justify-center rounded-xl border px-1',
                    isActive ? 'bg-primary/10 border-primary' : 'bg-muted/20 border-border',
                  )}
                >
                  <Text
                    className={cn(
                      'text-caption font-body-semibold text-center',
                      isActive ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {HOSPITAL_GUIDE_LABELS.zones[zone]}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View className="bg-primary/60 mx-2 h-1 rounded-full" />
    </View>
  );
}

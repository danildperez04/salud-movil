// features/health-resources/components/MapPreview.tsx
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { HEALTH_MAP_LABELS } from '@/constants/labels';
import type { HealthResource } from '../api/mock-health-resources';
import { RESOURCE_COLORS, RESOURCE_ICONS } from './resource-visuals';

const PIN_SIZE = 36;
/** Centra el pin sobre su posición y lo sube una altura, para que la punta caiga en ella. */
const PIN_OFFSET = { marginLeft: -PIN_SIZE / 2, marginTop: -PIN_SIZE };

type MapPreviewProps = {
  resources: HealthResource[];
  /** texto de la leyenda ("Mostrando: Farmacias") */
  legend: string;
  onSelect: (id: string) => void;
};

/**
 * Vista ilustrativa del mapa con los recursos como marcadores. No usa un mapa real:
 * la lista que la acompaña es la que da la información completa.
 * TODO: reemplazar por un mapa nativo (expo-maps / react-native-maps) con ubicación real.
 */
export function MapPreview({ resources, legend, onSelect }: MapPreviewProps) {
  return (
    <View className="bg-primary/5 border-primary/20 h-64 overflow-hidden rounded-3xl border">
      {/* calles decorativas */}
      <View
        className="bg-card border-border/60 absolute h-16 w-[140%] border"
        style={{ left: '-20%', top: '20%', transform: [{ rotate: '-28deg' }] }}
      />
      <View
        className="bg-card border-border/60 absolute h-16 w-[130%] border"
        style={{ left: '15%', top: '30%', transform: [{ rotate: '65deg' }] }}
      />

      {resources.map((resource) => {
        const Icon = RESOURCE_ICONS[resource.type];
        return (
          <Pressable
            key={resource.id}
            onPress={() => onSelect(resource.id)}
            accessibilityRole="button"
            accessibilityLabel={HEALTH_MAP_LABELS.pinA11y(resource.name)}
            hitSlop={6}
            className="absolute"
            style={{
              left: `${resource.mapPosition.x}%`,
              top: `${resource.mapPosition.y}%`,
              ...PIN_OFFSET,
            }}
          >
            <View
              className="items-center justify-center shadow-md shadow-black/20"
              style={{
                width: PIN_SIZE,
                height: PIN_SIZE,
                backgroundColor: RESOURCE_COLORS[resource.type],
                borderTopLeftRadius: PIN_SIZE / 2,
                borderTopRightRadius: PIN_SIZE / 2,
                borderBottomRightRadius: PIN_SIZE / 2,
                borderBottomLeftRadius: 4,
                transform: [{ rotate: '-45deg' }],
              }}
            >
              {/* el ícono se endereza para que no quede inclinado con el marcador */}
              <View style={{ transform: [{ rotate: '45deg' }] }}>
                <Icon size={18} color="#FFFFFF" />
              </View>
            </View>
          </Pressable>
        );
      })}

      <View className="bg-card/95 border-border absolute right-3 bottom-3 left-3 rounded-2xl border px-4 py-2.5">
        <Text className="text-caption font-body text-muted-foreground">{legend}</Text>
      </View>
    </View>
  );
}

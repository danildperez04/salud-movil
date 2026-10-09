// features/medications/components/ScanBanner.tsx
import { Camera } from '@/lib/icons';
import { View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { MEDICATIONS_LABELS } from '@/constants/labels';
import { colors } from '@/lib/tokens';

/**
 * Aviso de identificación por cámara. El escáner todavía no existe (en el menú
 * "Más" también figura como "Pronto"), así que en vez de un botón que no hace
 * nada se muestra la etiqueta de próximamente.
 * TODO: reemplazar el Badge por un botón "Escanear" cuando exista el escáner.
 */
export function ScanBanner() {
  const { title, description, comingSoon } = MEDICATIONS_LABELS.scan;

  return (
    <View className="bg-primary/5 border-primary/20 flex-row items-start gap-4 rounded-3xl border p-5">
      <View className="bg-primary/10 h-14 w-14 items-center justify-center rounded-2xl">
        <Camera size={24} color={colors.brandGreen} />
      </View>

      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-body font-heading-semibold text-foreground shrink">{title}</Text>
          <Badge variant="outline">
            <Text className="text-caption font-body-semibold text-muted-foreground">
              {comingSoon}
            </Text>
          </Badge>
        </View>
        <Text className="text-small font-body text-muted-foreground">{description}</Text>
      </View>
    </View>
  );
}

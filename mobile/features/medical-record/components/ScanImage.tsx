// features/medical-record/components/ScanImage.tsx
import { Image, View } from 'react-native';

type ScanImageProps = {
  uri: string;
  /** texto para lectores de pantalla */
  label: string;
};

/** Vista de una imagen escaneada o fotografiada (examen, documento), completa y sin recortar. */
export function ScanImage({ uri, label }: ScanImageProps) {
  return (
    <View className="border-border bg-muted/20 overflow-hidden rounded-3xl border">
      <Image
        source={{ uri }}
        style={{ width: '100%', aspectRatio: 3 / 4 }}
        resizeMode="contain"
        accessibilityLabel={label}
      />
    </View>
  );
}

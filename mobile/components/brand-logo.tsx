import { Text as RNText, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/tokens';

// Logo horizontal de marca (pulso + "Salud Móvil"), medido 1:1 del export de Figma.
// Tamaño base 250x48; se escala con `scale` sin perder proporciones.
const BASE_WIDTH = 250;
const BASE_HEIGHT = 143 / 3;
const PULSE_WIDTH = 107;

type BrandLogoProps = {
  scale?: number;
  className?: string;
};

export function BrandLogo({ scale = 1, className }: BrandLogoProps) {
  const fontSize = 22 * scale;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Salud Móvil"
      className={cn('flex-row items-start', className)}
      style={{ width: BASE_WIDTH * scale, height: BASE_HEIGHT * scale }}
    >
      <Svg width={PULSE_WIDTH * scale} height={BASE_HEIGHT * scale} viewBox="0 0 321 143">
        <Path
          d="M7 93H59.7L85.3 56.2L111.7 135.8L152.5 8.5L180.2 93H243.5"
          stroke={colors.brandGreen}
          strokeWidth={13}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Circle cx={274} cy={93} r={6.5} fill={colors.brandGreen} />
        <Circle cx={294} cy={93} r={6.5} fill={colors.brandGreen} />
        <Circle cx={314} cy={93} r={6.5} fill={colors.brandGreen} />
      </Svg>
      {/* line-height 1.5em deja el baseline a 1.1em: lo alineamos con la línea del pulso */}
      <Text
        numberOfLines={1}
        className="font-heading text-brand-blue dark:text-neutral-white"
        style={{
          fontSize,
          lineHeight: fontSize * 1.5,
          marginLeft: 13 * scale,
          marginTop: 7.5 * scale,
        }}
      >
        Salud <RNText className="text-brand-green">Móvil</RNText>
      </Text>
    </View>
  );
}

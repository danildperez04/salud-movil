// features/ipcp/components/RiskGauge.tsx
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Text } from '@/components/ui/text';
import { IPCP_LABELS } from '@/constants/labels';
import { MAX_SCORE } from '../domain/ipcp-score';

const SIZE = 136;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;

// Arco abierto por abajo: arranca a 140° y recorre 260° en sentido horario
// (0° = derecha). El degradado va de verde (izquierda) a rojo (derecha).
const START_ANGLE = 140;
const SWEEP_ANGLE = 260;
const ANIMATION_MS = 900;

const GRADIENT_STOPS = [
  { offset: 0, color: '#22C55E' },
  { offset: 0.5, color: '#FACC15' },
  { offset: 0.78, color: '#F97316' },
  { offset: 1, color: '#EF4444' },
] as const;
const TRACK_COLOR = 'rgba(128, 140, 150, 0.2)';

const pointAt = (angle: number) => {
  const radians = (angle * Math.PI) / 180;
  return { x: CENTER + RADIUS * Math.cos(radians), y: CENTER + RADIUS * Math.sin(radians) };
};

const arcStart = pointAt(START_ANGLE);
const arcEnd = pointAt(START_ANGLE + SWEEP_ANGLE);
const ARC_PATH = `M ${arcStart.x} ${arcStart.y} A ${RADIUS} ${RADIUS} 0 1 1 ${arcEnd.x} ${arcEnd.y}`;
const ARC_LENGTH = (RADIUS * SWEEP_ANGLE * Math.PI) / 180;

const AnimatedPath = Animated.createAnimatedComponent(Path);

type RiskGaugeProps = {
  /** 0 a 100 */
  score: number;
  /** color del número (el del nivel de riesgo) */
  color: string;
  accessibilityLabel: string;
};

/**
 * Medidor semicircular del IPCP. El arco se llena hasta el puntaje; el degradado
 * es fijo, así que un puntaje bajo solo muestra la parte verde. Con "Reducir
 * movimiento" activo Reanimated omite la animación (ver AccessibilityEffects).
 */
export function RiskGauge({ score, color, accessibilityLabel }: RiskGaugeProps) {
  const progress = useSharedValue(0);
  const fraction = Math.min(1, Math.max(0, score / MAX_SCORE));

  useEffect(() => {
    progress.set(
      withTiming(fraction, { duration: ANIMATION_MS, easing: Easing.out(Easing.cubic) }),
    );
  }, [fraction, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: ARC_LENGTH * (1 - progress.get()),
  }));

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={{ width: SIZE, height: SIZE }}
    >
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <LinearGradient
            id="ipcpGauge"
            gradientUnits="userSpaceOnUse"
            x1={CENTER - RADIUS}
            y1={0}
            x2={CENTER + RADIUS}
            y2={0}
          >
            {GRADIENT_STOPS.map(({ offset, color: stopColor }) => (
              <Stop key={offset} offset={offset} stopColor={stopColor} />
            ))}
          </LinearGradient>
        </Defs>

        <Path
          d={ARC_PATH}
          stroke={TRACK_COLOR}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
        />
        <AnimatedPath
          d={ARC_PATH}
          stroke="url(#ipcpGauge)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={ARC_LENGTH}
          animatedProps={animatedProps}
        />
      </Svg>

      <View
        className="absolute inset-0 items-center justify-center pt-2"
        importantForAccessibility="no-hide-descendants"
      >
        <Text className="text-h2 font-heading leading-10" style={{ color }}>
          {score}
        </Text>
        <Text className="text-caption font-body text-muted-foreground">
          {IPCP_LABELS.result.outOf}
        </Text>
      </View>
    </View>
  );
}

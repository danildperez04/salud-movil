import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@rn-primitives/switch';
import { Platform, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const TRACK_WIDTH = 56;
const TRACK_HEIGHT = 32;
const THUMB_SIZE = 26;
const PADDING = (TRACK_HEIGHT - THUMB_SIZE) / 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - PADDING * 2;

// Las animaciones no pueden leer clases de Tailwind, por eso los hex van acá
// (mismos valores que --color-primary y --color-neutral-medium en global.css).
const TRACK_COLOR_OFF = '#6B7280';
const TRACK_COLOR_ON = '#2DB79A';

// Resorte rápido y casi sin rebote: la perilla "asienta" en vez de deslizar lineal.
const SPRING = {
  damping: 20,
  stiffness: 260,
  mass: 0.9,
  reduceMotion: ReduceMotion.System,
} as const;

type SwitchProps = Omit<React.ComponentProps<typeof SwitchPrimitives.Root>, 'children'>;

function Switch({ className, checked, disabled, onPressIn, onPressOut, ...props }: SwitchProps) {
  // 0 = apagado, 1 = encendido. Se anima solo cuando cambia `checked`, así que
  // el switch responde igual si el cambio viene del usuario o del estado externo.
  const progress = useDerivedValue(() => withSpring(checked ? 1 : 0, SPRING));
  const pressed = useSharedValue(0);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [TRACK_COLOR_OFF, TRACK_COLOR_ON]),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [0, THUMB_TRAVEL], Extrapolation.EXTEND) },
      // ligero "crecimiento" mientras se presiona, como feedback táctil
      { scale: interpolate(pressed.value, [0, 1], [1, 1.1]) },
    ],
  }));

  return (
    <SwitchPrimitives.Root
      checked={checked}
      disabled={disabled}
      onPressIn={(event) => {
        pressed.set(withTiming(1, { duration: 120 }));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.set(withTiming(0, { duration: 160 }));
        onPressOut?.(event);
      }}
      className={cn(
        Platform.select({
          web: 'focus-visible:ring-ring/50 cursor-pointer outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed',
        }),
        className,
      )}
      style={[styles.root, disabled && styles.disabled]}
      {...props}
    >
      <Animated.View pointerEvents="none" style={[styles.track, trackStyle]} />
      <Animated.View pointerEvents="none" style={[styles.thumb, thumbStyle]} />
    </SwitchPrimitives.Root>
  );
}

// Estilos explícitos (no clases de Tailwind): las vistas animadas necesitan
// tamaño y color deterministas para que la pista y la perilla siempre se dibujen.
const styles = StyleSheet.create({
  root: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
    flexShrink: 0,
  },
  disabled: { opacity: 0.5 },
  track: {
    ...StyleSheet.absoluteFill,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginLeft: PADDING,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
});

export { Switch };

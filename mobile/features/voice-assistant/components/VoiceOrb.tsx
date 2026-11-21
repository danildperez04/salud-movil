// features/voice-assistant/components/VoiceOrb.tsx
import { Mic } from '@/lib/icons';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { VOICE_ASSISTANT_LABELS } from '@/constants/labels';

const PULSE_SCALE = 1.07;
const PULSE_MS = 700;

type VoiceOrbProps = {
  listening: boolean;
  onPress: () => void;
};

/**
 * Botón grande del micrófono. Mientras escucha late suavemente; con "Reducir
 * movimiento" activo Reanimated omite la animación (ver AccessibilityEffects).
 */
export function VoiceOrb({ listening, onPress }: VoiceOrbProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.set(
      listening
        ? withRepeat(withTiming(PULSE_SCALE, { duration: PULSE_MS }), -1, true)
        : withTiming(1),
    );
  }, [listening, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        listening ? VOICE_ASSISTANT_LABELS.micStop : VOICE_ASSISTANT_LABELS.micStart
      }
      accessibilityState={{ busy: listening }}
    >
      <Animated.View
        style={animatedStyle}
        className="bg-primary shadow-primary/40 h-32 w-32 items-center justify-center rounded-[40px] shadow-xl"
      >
        <Mic size={48} color="#FFFFFF" />
      </Animated.View>
    </Pressable>
  );
}

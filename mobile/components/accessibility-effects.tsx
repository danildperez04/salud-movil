// components/accessibility-effects.tsx
import { useEffect } from 'react';
import { ReduceMotion, ReducedMotionConfig } from 'react-native-reanimated';
import { applyAccessibilityTheme } from '@/lib/accessibility-theme';
import { useAppStore } from '@/store';

/**
 * Aplica las preferencias de accesibilidad guardadas: tamaño de texto, alto
 * contraste y reducción de movimiento. Se monta una sola vez en el layout raíz.
 */
export function AccessibilityEffects() {
  const textSize = useAppStore((state) => state.accessibility.textSize);
  const highContrast = useAppStore((state) => state.accessibility.highContrast);
  const reduceMotion = useAppStore((state) => state.accessibility.reduceMotion);

  useEffect(() => {
    applyAccessibilityTheme(textSize, highContrast);
  }, [textSize, highContrast]);

  // "System" respeta el ajuste del teléfono cuando el usuario no pidió reducirlo aquí
  return <ReducedMotionConfig mode={reduceMotion ? ReduceMotion.Always : ReduceMotion.System} />;
}

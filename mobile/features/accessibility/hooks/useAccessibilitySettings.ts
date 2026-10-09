// features/accessibility/hooks/useAccessibilitySettings.ts
import type { SwitchRow } from '@/components/ui/switch-rows-card';
import { ACCESSIBILITY_LABELS } from '@/constants/labels';
import { useSpeech } from '@/hooks/useSpeech';
import { useAppStore } from '@/store';
import type { AccessibilityPreferences, TextSize } from '@/types/preferences';

const labels = ACCESSIBILITY_LABELS;

/**
 * Ajustes de accesibilidad. Cada cambio se guarda y se aplica al instante en toda
 * la app (ver components/accessibility-effects.tsx).
 */
export function useAccessibilitySettings() {
  const settings = useAppStore((state) => state.accessibility);
  const setAccessibility = useAppStore((state) => state.setAccessibility);
  const resetAccessibility = useAppStore((state) => state.resetAccessibility);
  const { speak } = useSpeech();

  const toggle = (
    key: Exclude<keyof AccessibilityPreferences, 'textSize'>,
    title: string,
    subtitle: string,
  ): SwitchRow => ({
    id: key,
    title,
    subtitle,
    checked: settings[key],
    onCheckedChange: (checked) => setAccessibility({ [key]: checked }),
  });

  const rows: SwitchRow[] = [
    toggle('highContrast', labels.highContrast.title, labels.highContrast.subtitle),
    toggle('reduceMotion', labels.reduceMotion.title, labels.reduceMotion.subtitle),
    toggle('simpleMode', labels.simpleMode.title, labels.simpleMode.subtitle),
    toggle('readAloud', labels.readAloud.title, labels.readAloud.subtitle),
  ];

  return {
    textSize: settings.textSize,
    setTextSize: (textSize: TextSize) => setAccessibility({ textSize }),
    rows,
    testReading: () => speak(labels.testReadingText),
    reset: resetAccessibility,
  };
}

// features/accessibility/hooks/useAccessibilitySettings.ts
import { useTranslation } from 'react-i18next';
import type { SwitchRow } from '@/components/ui/switch-rows-card';
import { useSpeech } from '@/hooks/useSpeech';
import { useAppStore } from '@/store';
import type { AccessibilityPreferences, TextSize } from '@/types/preferences';

/**
 * Ajustes de accesibilidad. Cada cambio se guarda y se aplica al instante en toda
 * la app (ver components/accessibility-effects.tsx).
 */
export function useAccessibilitySettings() {
  const { t } = useTranslation('accessibility');
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
    toggle('highContrast', t('highContrast.title'), t('highContrast.subtitle')),
    toggle('reduceMotion', t('reduceMotion.title'), t('reduceMotion.subtitle')),
    toggle('simpleMode', t('simpleMode.title'), t('simpleMode.subtitle')),
    toggle('readAloud', t('readAloud.title'), t('readAloud.subtitle')),
  ];

  return {
    textSize: settings.textSize,
    setTextSize: (textSize: TextSize) => setAccessibility({ textSize }),
    rows,
    testReading: () => speak(t('testReadingText')),
    reset: resetAccessibility,
  };
}

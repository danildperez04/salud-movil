// hooks/useSpeech.ts
import * as Speech from 'expo-speech';
import { useCallback, useEffect } from 'react';
import { LANGUAGE_PROFILES, resolveLanguage, type AvailableLanguage } from '@/lib/i18n/languages';
import { useAppStore } from '@/store';

/**
 * Lectura en voz alta con el motor del dispositivo. Se detiene al salir de la pantalla.
 * Lee con la voz del idioma de la app; si el texto está en otro idioma (una pantalla que aún no
 * se tradujo sigue en español), hay que indicarlo en `language` para no leerlo con la voz errada.
 */
export function useSpeech() {
  const readAloudEnabled = useAppStore((state) => state.accessibility.readAloud);
  const appLanguage = useAppStore((state) => resolveLanguage(state.language));

  const stop = useCallback(() => {
    Speech.stop();
  }, []);

  const speak = useCallback(
    (text: string, language: AvailableLanguage = appLanguage) => {
      Speech.stop();
      Speech.speak(text, { language: LANGUAGE_PROFILES[language].speech });
    },
    [appLanguage],
  );

  /** Lee `text` solo si el usuario activó "Lectura en voz alta" en Accesibilidad. */
  const speakIfEnabled = useCallback(
    (text: string, language?: AvailableLanguage) => {
      if (readAloudEnabled) speak(text, language);
    },
    [readAloudEnabled, speak],
  );

  useEffect(() => stop, [stop]);

  return { speak, speakIfEnabled, stop };
}

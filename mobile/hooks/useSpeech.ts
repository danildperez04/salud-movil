// hooks/useSpeech.ts
import * as Speech from 'expo-speech';
import { useCallback, useEffect } from 'react';
import { useAppStore } from '@/store';

const SPEECH_LANGUAGE = 'es';

/** Lectura en voz alta con el motor del dispositivo. Se detiene al salir de la pantalla. */
export function useSpeech() {
  const readAloudEnabled = useAppStore((state) => state.accessibility.readAloud);

  const stop = useCallback(() => {
    Speech.stop();
  }, []);

  const speak = useCallback((text: string) => {
    Speech.stop();
    Speech.speak(text, { language: SPEECH_LANGUAGE });
  }, []);

  /** Lee `text` solo si el usuario activó "Lectura en voz alta" en Accesibilidad. */
  const speakIfEnabled = useCallback(
    (text: string) => {
      if (readAloudEnabled) speak(text);
    },
    [readAloudEnabled, speak],
  );

  useEffect(() => stop, [stop]);

  return { speak, speakIfEnabled, stop };
}

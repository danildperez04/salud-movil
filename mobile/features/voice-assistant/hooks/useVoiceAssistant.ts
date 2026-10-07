// features/voice-assistant/hooks/useVoiceAssistant.ts
import { useRef, useState } from 'react';
import { VOICE_ASSISTANT_LABELS } from '@/constants/labels';
import { useSpeech } from '@/hooks/useSpeech';
import { recognizeSpeech } from '../api/mock-voice-recognizer';

const labels = VOICE_ASSISTANT_LABELS;

type VoiceStatus = 'idle' | 'listening' | 'done';

/** Estado del asistente: escuchar, mostrar lo que entendió y leerlo si el usuario lo pidió. */
export function useVoiceAssistant() {
  const { speakIfEnabled, stop } = useSpeech();
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState<string | null>(null);

  // cada intento tiene un número; si el usuario cancela o elige un ejemplo, el resultado tardío se descarta
  const attempt = useRef(0);

  const showTranscript = (text: string) => {
    setTranscript(text);
    setStatus('done');
    speakIfEnabled(text);
  };

  const toggleListening = async () => {
    if (status === 'listening') {
      attempt.current += 1;
      setStatus(transcript ? 'done' : 'idle');
      return;
    }

    attempt.current += 1;
    const current = attempt.current;
    stop();
    setStatus('listening');

    const text = await recognizeSpeech();
    if (current === attempt.current) showTranscript(text);
  };

  const chooseExample = (text: string) => {
    attempt.current += 1;
    showTranscript(text);
  };

  const title =
    status === 'listening'
      ? labels.listeningTitle
      : status === 'done'
        ? labels.doneTitle
        : labels.idleTitle;

  return {
    isListening: status === 'listening',
    title,
    transcript:
      status === 'listening'
        ? labels.transcriptListening
        : (transcript ?? labels.transcriptPlaceholder),
    hasTranscript: status !== 'listening' && transcript !== null,
    toggleListening,
    chooseExample,
  };
}

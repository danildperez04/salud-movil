// features/voice-assistant/api/mock-voice-recognizer.ts
//
// SIMULADO: no escucha el micrófono ni usa ningún modelo. Devuelve frases de
// ejemplo después de una pausa, para poder diseñar y probar el flujo completo.
// TODO: reemplazar `recognizeSpeech` por reconocimiento de voz real y, si
// corresponde, por la respuesta de un modelo de lenguaje (proveedor por definir).
const SAMPLE_PHRASES = [
  'Tengo dolor de cabeza desde esta mañana y quiero saber qué hacer.',
  '¿Cuándo debo tomar mi medicamento?',
  'Necesito encontrar un centro de salud cercano.',
];

const LISTENING_MS = 1400;

let nextPhrase = 0;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Texto "entendido" a partir de la voz del usuario. */
export async function recognizeSpeech(): Promise<string> {
  await delay(LISTENING_MS);
  const phrase = SAMPLE_PHRASES[nextPhrase % SAMPLE_PHRASES.length];
  nextPhrase += 1;
  return phrase;
}

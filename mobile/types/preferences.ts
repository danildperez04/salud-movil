// types/preferences.ts
// Preferencias del dispositivo/usuario que se guardan localmente (MMKV).

export type TextSize = 'normal' | 'large' | 'xlarge';

export type AccessibilityPreferences = {
  textSize: TextSize;
  highContrast: boolean;
  reduceMotion: boolean;
  /** oculta textos explicativos secundarios */
  simpleMode: boolean;
  /** lee en voz alta los contenidos importantes (ej. lo que entendió el asistente) */
  readAloud: boolean;
};

/** ISO 639-3. Español más las lenguas de la Costa Caribe de Nicaragua. */
export type LanguageCode = 'es' | 'bzk' | 'miq' | 'yan' | 'ulw' | 'cab' | 'rma';

export type NotificationPreferences = {
  medications: boolean;
  appointments: boolean;
  indicators: boolean;
  news: boolean;
};

export type SecurityPreferences = {
  fingerprint: boolean;
  faceRecognition: boolean;
  pinFallback: boolean;
};

// lib/i18n/index.ts
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { LanguageCode } from '@/types/preferences';
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_PROFILES,
  resolveLanguage,
  type AvailableLanguage,
} from './languages';
import { bzk } from './locales/bzk';
import { es } from './locales/es';

const TRANSLATIONS = { es, bzk } satisfies Record<AvailableLanguage, typeof es>;

/** Textos de cada idioma, bajo la etiqueta (`locale`) con la que `Intl` los entiende. */
export const resources = Object.fromEntries(
  AVAILABLE_LANGUAGES.map((language) => [
    LANGUAGE_PROFILES[language].locale,
    TRANSLATIONS[language],
  ]),
);

/** Debe coincidir con `defaultNS` de types/i18next.d.ts. */
const defaultNS = 'common';

/**
 * Instancia única de la app. Se inicia de forma síncrona (los textos viven en el bundle), así que
 * `t()` ya funciona al importar este módulo, también fuera de React (esquemas, errores, alertas).
 * Lo que falte en un idioma se muestra en español.
 */
export const i18n = createInstance().use(initReactI18next);

void i18n.init({
  resources,
  lng: LANGUAGE_PROFILES[DEFAULT_LANGUAGE].locale,
  fallbackLng: LANGUAGE_PROFILES[DEFAULT_LANGUAGE].locale,
  supportedLngs: Object.values(LANGUAGE_PROFILES).map((profile) => profile.locale),
  defaultNS,
  initAsync: false,
  // React ya escapa lo que se dibuja, y los textos también van a Alert, voz y WhatsApp
  interpolation: { escapeValue: false },
});

/** Cambia el idioma de toda la app. Los componentes con `useTranslation` se redibujan solos. */
export function applyLanguage(code: LanguageCode | string | undefined) {
  const { locale } = LANGUAGE_PROFILES[resolveLanguage(code)];
  if (i18n.language !== locale) void i18n.changeLanguage(locale);
}

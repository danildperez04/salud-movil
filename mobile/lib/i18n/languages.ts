// lib/i18n/languages.ts
import type { LanguageCode } from '@/types/preferences';

/**
 * Idiomas con traducción real. El resto de `LanguageCode` (miskito, mayangna, ulwa, garífuna,
 * rama) se muestra como "Próximamente" y nunca se puede guardar como idioma de la app.
 */
export const AVAILABLE_LANGUAGES = ['es', 'bzk'] as const;
export type AvailableLanguage = (typeof AVAILABLE_LANGUAGES)[number];

type LanguageProfile = {
  /** Etiqueta BCP 47 con la que se registran los textos en i18next. */
  locale: string;
  /** Idioma que recibe el motor de voz del dispositivo (`expo-speech`). */
  speech: string;
};

/**
 * `bzk` (inglés criollo de Nicaragua) existe en ISO 639-3, pero no en CLDR/ICU: `Intl` no tiene
 * reglas para él y, en vez de fallar, usa el idioma del teléfono (`new Intl.PluralRules('bzk')`
 * devuelve las reglas del español en un teléfono en español). Como su base léxica es el inglés,
 * se registra con la etiqueta `en-NI` (inglés de Nicaragua): así los plurales siguen siempre
 * las reglas del inglés, sin depender de cómo tenga configurado el teléfono la persona.
 *
 * Los motores de voz tampoco tienen una voz criolla ni de `en-NI`; `en-US` es la más común y la
 * que más se parece al criollo de la Costa Caribe, y se lee mejor que con una voz en español.
 */
export const LANGUAGE_PROFILES: Record<AvailableLanguage, LanguageProfile> = {
  es: { locale: 'es', speech: 'es' },
  bzk: { locale: 'en-NI', speech: 'en-US' },
};

export const DEFAULT_LANGUAGE: AvailableLanguage = 'es';

export function isAvailableLanguage(code: string | undefined): code is AvailableLanguage {
  return AVAILABLE_LANGUAGES.some((language) => language === code);
}

/** Idioma de la app para un código guardado; lo que no tiene traducción cae en español. */
export function resolveLanguage(code: LanguageCode | string | undefined): AvailableLanguage {
  return isAvailableLanguage(code) ? code : DEFAULT_LANGUAGE;
}

// features/language/domain/language-options.ts
import type { RadioOption } from '@/components/ui/radio-card-list';
import { LANGUAGE_LABELS } from '@/constants/labels';
import { isAvailableLanguage } from '@/lib/i18n/languages';
import type { LanguageCode } from '@/types/preferences';

const LANGUAGE_CODES = Object.keys(LANGUAGE_LABELS) as LanguageCode[];

/**
 * Opciones del selector de idioma. El nombre de cada lengua va escrito en esa lengua (no en la
 * activa), para reconocerla desde cualquier idioma. Las que aún no tienen traducción se listan,
 * pero deshabilitadas y con `comingSoon` a la derecha: no se pueden guardar.
 */
export function languageOptions(comingSoon: string): RadioOption<LanguageCode>[] {
  return LANGUAGE_CODES.map((value) =>
    isAvailableLanguage(value)
      ? { value, label: LANGUAGE_LABELS[value] }
      : { value, label: LANGUAGE_LABELS[value], disabled: true, hint: comingSoon },
  );
}

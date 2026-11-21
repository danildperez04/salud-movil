// features/language/hooks/useLanguageSettings.ts
import { useTranslation } from 'react-i18next';
import { useSettingsDraft } from '@/hooks/useSettingsDraft';
import { isAvailableLanguage, resolveLanguage } from '@/lib/i18n/languages';
import { useAppStore } from '@/store';
import type { LanguageCode } from '@/types/preferences';
import { languageOptions } from '../domain/language-options';

/**
 * Idioma de la app. Se guarda al confirmar y se aplica en toda la interfaz al instante (ver
 * lib/i18n/store-binding.ts). Las lenguas sin traducción se listan, pero no se pueden elegir.
 */
export function useLanguageSettings() {
  const { t } = useTranslation('language');
  const saved = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const { draft, update, save } = useSettingsDraft<{ language: LanguageCode }>(
    { language: resolveLanguage(saved) },
    ({ language }) => setLanguage(language),
  );

  return {
    options: languageOptions(t('comingSoon')),
    selected: draft.language,
    select: (language: LanguageCode) => {
      if (isAvailableLanguage(language)) update('language', language);
    },
    save,
  };
}

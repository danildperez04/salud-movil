// features/language/hooks/useLanguageSettings.ts
import type { RadioOption } from '@/components/ui/radio-card-list';
import { LANGUAGE_LABELS } from '@/constants/labels';
import { useSettingsDraft } from '@/hooks/useSettingsDraft';
import { useAppStore } from '@/store';
import type { LanguageCode } from '@/types/preferences';

const LANGUAGE_OPTIONS: RadioOption<LanguageCode>[] = (
  Object.keys(LANGUAGE_LABELS) as LanguageCode[]
).map((value) => ({ value, label: LANGUAGE_LABELS[value] }));

/**
 * Idioma preferido. Se guarda al confirmar.
 * TODO: aplicar el idioma en la interfaz cuando existan las traducciones.
 */
export function useLanguageSettings() {
  const saved = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const { draft, update, save } = useSettingsDraft({ language: saved }, ({ language }) =>
    setLanguage(language),
  );

  return {
    options: LANGUAGE_OPTIONS,
    selected: draft.language,
    select: (language: LanguageCode) => update('language', language),
    save,
  };
}

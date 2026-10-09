// lib/i18n/store-binding.ts
// Aparte de ./index para que los tests de i18n no carguen el store (MMKV es nativo).
import { useAppStore } from '@/store';
import { applyLanguage } from './index';

let bound = false;

/**
 * Aplica el idioma guardado y lo mantiene al día cuando cambia en el store. Se llama una vez al
 * cargar el layout raíz, antes del primer render: MMKV es síncrono, así que el idioma guardado
 * ya está disponible y no hay un parpadeo en español.
 */
export function bindLanguageToStore() {
  if (bound) return;
  bound = true;

  applyLanguage(useAppStore.getState().language);
  useAppStore.subscribe((state, previous) => {
    if (state.language !== previous.language) applyLanguage(state.language);
  });
}

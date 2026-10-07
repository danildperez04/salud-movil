// hooks/useSettingsDraft.ts
import { router } from 'expo-router';
import { useState } from 'react';

/**
 * Borrador de una pantalla de ajustes con botón "Guardar": los cambios viven en
 * `draft` y solo se confirman al guardar; al salir sin guardar se descartan.
 */
export function useSettingsDraft<T extends object>(saved: T, onSave: (value: T) => void) {
  const [draft, setDraft] = useState<T>(saved);

  const update = <K extends keyof T>(key: K, value: T[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const save = () => {
    onSave(draft);
    router.back();
  };

  return { draft, update, save };
}

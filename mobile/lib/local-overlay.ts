// lib/local-overlay.ts
// Cambios locales sobre una lista que viene del backend, para las escrituras cuyo
// endpoint todavía no existe (agendar una cita, crear un medicamento...). Los datos
// reales siguen siendo la fuente de verdad; esto solo agrega, reemplaza u oculta
// elementos. Vive en memoria: se pierde al cerrar la app y al cerrar sesión.

type WithId = { id: string };

const overlays = new Set<{ clear: () => void }>();

export function createLocalOverlay<T extends WithId>() {
  const upserts = new Map<string, T>();
  const removed = new Set<string>();

  const overlay = {
    /** Agrega el elemento o, si ya existe (en el backend o aquí), lo reemplaza. */
    upsert(item: T) {
      removed.delete(item.id);
      upserts.set(item.id, item);
    },

    remove(id: string) {
      upserts.delete(id);
      removed.add(id);
    },

    /** Los datos del backend con los cambios locales aplicados; los elementos nuevos van al final. */
    apply(remote: readonly T[]): T[] {
      const remoteIds = new Set(remote.map((item) => item.id));
      const merged = remote
        .filter((item) => !removed.has(item.id))
        .map((item) => upserts.get(item.id) ?? item);
      const created = [...upserts.values()].filter((item) => !remoteIds.has(item.id));
      return [...merged, ...created];
    },

    clear() {
      upserts.clear();
      removed.clear();
    },
  };

  overlays.add(overlay);
  return overlay;
}

/** Id para un elemento creado solo en el dispositivo; no choca con los uuid del backend. */
export const newLocalId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const isLocalId = (id: string) => id.startsWith('local-');

/** Descarta todos los cambios locales (al cerrar sesión). */
export function clearLocalOverlays() {
  overlays.forEach((overlay) => overlay.clear());
}

// lib/catalog.ts

/**
 * Claves de un catálogo (objeto clave -> texto) con el tipo que pide z.enum,
 * para que los valores válidos de un formulario salgan de una sola fuente.
 */
export function keysOf<T extends Record<string, unknown>>(catalog: T) {
  return Object.keys(catalog) as [Extract<keyof T, string>, ...Extract<keyof T, string>[]];
}

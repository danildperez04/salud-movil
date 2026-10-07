// lib/text-format.ts

/** Une los textos no vacíos con " · " (o el separador indicado). */
export const joinParts = (parts: (string | undefined | null | false)[], separator = ' · ') =>
  parts.filter((part): part is string => !!part).join(separator);

// Marcas de acento combinadas (U+0300 a U+036F) que deja `normalize('NFD')`
const COMBINING_MARKS = new RegExp(
  `[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`,
  'g',
);

/** Minúsculas y sin acentos, para comparar o buscar texto sin distinguir "Ácido" de "acido". */
export const normalizeText = (text: string) =>
  text.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase().trim();

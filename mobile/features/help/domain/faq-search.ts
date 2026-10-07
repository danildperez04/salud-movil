// features/help/domain/faq-search.ts
import { normalizeText } from '@/lib/text-format';
import type { FaqItem } from '../api/mock-help';

/**
 * Preguntas que contienen todas las palabras buscadas, sin distinguir
 * mayúsculas ni acentos, en la pregunta o en la respuesta.
 */
export function searchFaq(items: FaqItem[], query: string): FaqItem[] {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return items;

  return items.filter((item) => {
    const text = normalizeText(`${item.question} ${item.answer}`);
    return terms.every((term) => text.includes(term));
  });
}

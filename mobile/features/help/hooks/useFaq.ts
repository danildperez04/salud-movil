// features/help/hooks/useFaq.ts
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { fetchMockFaq } from '../api/mock-help';
import { searchFaq } from '../domain/faq-search';

// TODO: reemplazar el mock por apiClient cuando el backend exponga el endpoint.

/** Preguntas frecuentes con buscador y una sola respuesta abierta a la vez. */
export function useFaq() {
  const { data, isLoading } = useQuery({ queryKey: ['help', 'faq'], queryFn: fetchMockFaq });
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const items = useMemo(() => searchFaq(data ?? [], query), [data, query]);

  return {
    items,
    isLoading,
    query,
    setQuery,
    openId,
    toggle: (id: string) => setOpenId((current) => (current === id ? null : id)),
  };
}

// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que un dato se considera "fresco" antes de refetchear en background.
      // 1 min es un default razonable; ajustalo por query si algo cambia más/menos seguido.
      staleTime: 60 * 1000,
      // Reintentos ante error de red — en mobile la conexión es menos estable que en web.
      retry: 2,
    },
    mutations: {
      retry: 0, // las mutaciones (POST/PUT/DELETE) NO se reintentan solas por defecto,
      // para evitar duplicar una acción (ej: agendar una cita dos veces) si el
      // primer intento sí llegó a impactar en el servidor pero la respuesta se perdió.
    },
  },
});

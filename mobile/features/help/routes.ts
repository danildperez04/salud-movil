// features/help/routes.ts
import type { Href } from 'expo-router';

const BASE = '/(app)/help';

export const helpRoutes = {
  home: BASE as Href,
  faq: `${BASE}/faq` as Href,
  chat: `${BASE}/chat` as Href,
  report: `${BASE}/report` as Href,
};

// types/i18next.d.ts
// Tipa `t()` con los textos en español: las claves se autocompletan y una clave que no existe
// no compila.
import type { es } from '@/lib/i18n/locales/es';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof es;
  }
}

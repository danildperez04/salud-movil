// lib/i18n/locales/es/index.ts
// El español es la fuente de verdad: define las claves y es el idioma de respaldo. Cada idioma
// nuevo se tipa contra estos objetos, así que el compilador avisa si falta o sobra una clave.
import { common } from './common';
import { navigation } from './navigation';

export const es = { common, navigation };

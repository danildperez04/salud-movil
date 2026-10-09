// lib/i18n/locales/es/index.ts
// El español es la fuente de verdad: define las claves y es el idioma de respaldo. Cada idioma
// nuevo se tipa contra estos objetos, así que el compilador avisa si falta o sobra una clave.
import { accessibility } from './accessibility';
import { common } from './common';
import { home } from './home';
import { language } from './language';
import { navigation } from './navigation';

export const es = { accessibility, common, home, language, navigation };

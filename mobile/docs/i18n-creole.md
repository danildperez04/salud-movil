# Idiomas de la app y guía del inglés criollo

Salud Móvil se puede usar en **español** y en **inglés criollo de Nicaragua** (`bzk`, el criollo de
la Costa Caribe, escrito "Kriol" en la lista de idiomas). Las demás lenguas de la Costa Caribe
(miskito, mayangna, ulwa, garífuna, rama) aparecen en el selector como "Próximamente" y todavía no
se pueden elegir.

> **El criollo es un borrador sin validar.** Lo redactó un desarrollador que no es hablante nativo,
> apoyándose en rasgos documentados del criollo. Antes de publicarlo, y sobre todo los textos de
> medicamentos y dosis, debe revisarlo gente de la comunidad criolla (por ejemplo, de Bluefields,
> Corn Island o Laguna de Perlas). Ver [Qué debe validar un hablante](#qué-debe-validar-un-hablante).

## Qué está traducido

| Traducido                                                                 | Sigue en español                                              |
| ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Bienvenida, login y verificación en dos pasos                             | Citas, medicamentos, recordatorios                            |
| Inicio, barra de pestañas, menú **Más**                                   | Expediente clínico, indicadores, actividad, mapa, referencias |
| Idioma y Accesibilidad                                                    | Perfil, seguridad, notificaciones, emergencia, ayuda          |
| Mensajes de error, pantalla de fallo, botón "Volver"                      | Catálogos que vienen de la base de datos                      |
| Títulos de **todas** las pantallas (listos para cuando cada una se migre) |                                                               |

Lo que falta en un idioma se muestra en español, nunca como una clave suelta.

## Cómo funciona

- Motor: `i18next` + `react-i18next` (JS puro, no requiere recompilar el cliente nativo). No se
  usa `expo-localization`: el idioma lo elige la persona, nunca se deduce del teléfono.
- El idioma se guarda en el store (`language`, MMKV) y se aplica **antes del primer render**
  (`lib/i18n/store-binding.ts`), así que la app no arranca un instante en español.
- Los textos viven en `lib/i18n/locales/{es,bzk}/<namespace>.ts`. **El español es la fuente de
  verdad:** el criollo se tipa contra él (`typeof spanish`), así que una clave que falte o sobre
  no compila.
- `lib/i18n/locales.test.ts` revisa lo que los tipos no ven: mismos `{{marcadores}}`, ningún texto
  vacío, ningún texto del español copiado y ninguna letra o signo del español (`¿ ¡ ñ á é í ó ú`)
  en el criollo.

### Por qué el criollo se registra como `en-NI`

`bzk` existe en ISO 639-3 pero no en CLDR/ICU: `Intl` no tiene reglas para él y, en lugar de
fallar, usa el idioma del teléfono (`new Intl.PluralRules('bzk')` devuelve las reglas del español en
un teléfono en español). Como su base léxica es el inglés, se registra como `en-NI` (inglés de
Nicaragua): los plurales siguen siempre las reglas del inglés y las fechas salen como
`Friday, October 9`. La voz (`expo-speech`) usa `en-US`, porque no existe una voz criolla.
Está todo en `lib/i18n/languages.ts`; un test avisa si algún día `Intl` incorpora `bzk`.

## Cómo migrar una pantalla

1. Mover su grupo de `constants/labels.ts` a `lib/i18n/locales/es/<namespace>.ts`. Solo cadenas:
   las funciones pasan a `{{marcador}}` y los plurales a `clave_one` / `clave_other`.
2. Crear `lib/i18n/locales/bzk/<namespace>.ts` tipado con `typeof spanish` y registrar ambos en
   los `index.ts`.
3. En la pantalla: `const { t } = useTranslation('<namespace>')`. Nada de leer textos a nivel de
   módulo (un `const labels = X_LABELS` o un arreglo construido al importar no sigue al idioma).
4. Fuera de React, traducir **al momento de usar**: `i18n.t('ns:clave')`. En zod, mensajes como
   función: `.min(1, { error: () => i18n.t('ns:clave') })`.
5. Si la pantalla usa `useSpeech`, quitar el `'es'` explícito y el `TODO(i18n)`.
6. `npm test` y `npm run typecheck`.

`COMMON_LABELS`, `SCREEN_TITLES`, `MORE_LABELS` y `ROLE_LABELS` siguen exportados desde
`constants/labels.ts` como **alias en español de los mismos objetos**, para las pantallas que aún no
se migran. Se borran cuando ya nadie los lea.

## Guía de estilo del criollo

Criterio: **ortografía legible**. Las raíces se escriben como en inglés (así las lee quien sabe
inglés o español) y el sabor criollo está en la gramática y en las palabras funcionales. Tuteo
con `yu`. Sin signos de apertura (`¿ ¡`). Las preguntas no invierten el orden: `Yu forget yu
password?`.

| Rasgo                         | Se escribe                        | Ejemplo en la app                                |
| ----------------------------- | --------------------------------- | ------------------------------------------------ |
| el / la                       | `di`                              | `Check di info an try agen.`                     |
| y                             | `an`                              | `Privacy an Security`                            |
| para + verbo                  | `fi`                              | `Put in yu details fi continue`                  |
| con                           | `wid`                             | `Guide yu to di center wid di service yu need`   |
| tú / tu                       | `yu`                              | `Yu priority level…`                             |
| mi (posesivo)                 | `mi`                              | `Mi Account`, `Mi Priority`                      |
| nosotros                      | `wi`                              | `Wi send yu a new code.`                         |
| estar / está haciendo         | `de`                              | `How yu de today`, `Wi de work pon dis part`     |
| ya (terminado)                | `done` + verbo                    | `Di code done expire.`                           |
| negación                      | `no` antes del verbo              | `Yu no have permission fi do dis.`               |
| doble negación                | `no … no more`                    | `Di old one no work no more.`                    |
| tomar / hacer / poquito       | `tek` / `mek` / `likl`            | `Yu can mek di text bigger`, `Wait a likl while` |
| otra vez                      | `agen`                            | `Try agen`                                       |
| "th" → t / d                  | `ting`, `di`, `dis`, `dat`, `dan` | `Someting go wrong`, `dan usual`                 |
| verbo sin "-s" en 3.ª persona | —                                 | `Di code expire in 4:30`                         |

`couldn't` y `can't` se dejan con la ortografía del inglés. Los nombres propios y siglas
(`Salud Móvil`, `IPCP`) no se traducen.

### Glosario

| Español               | Criollo             | Español                 | Criollo           |
| --------------------- | ------------------- | ----------------------- | ----------------- |
| cita                  | appointment         | contraseña              | password          |
| medicamento           | medicine            | iniciar / cerrar sesión | log in / log out  |
| indicadores de salud  | health indicators   | código de verificación  | verification code |
| expediente clínico    | health record       | presión arterial        | blood pressure    |
| antecedentes          | health history      | glucosa                 | blood sugar       |
| alergia · diagnóstico | allergy · diagnosis | actividad física        | exercise          |
| laboratorio / examen  | lab test            | guardar · cancelar      | save · cancel     |
| próximamente          | coming soon         | ajustes                 | settings          |

Cuando falte un término, usar la palabra inglesa más simple y agregarla acá, para que todo el
equipo lo escriba igual.

## Qué debe validar un hablante

Estas son las decisiones donde hay más probabilidad de error. Si un hablante las corrige, se
cambian en los archivos de `lib/i18n/locales/bzk/` y se actualiza esta tabla.

1. `de` como "estar / estar haciendo" (`How yu de today`, `It de tek more time`): ¿es `de`, `a` o `di`?
2. `done` + verbo para lo terminado (`Di code done expire`).
3. `pon` por "en / sobre" (`Wi de work pon dis part`, `a problem pon wi side`).
4. `mi` como posesivo en títulos (`Mi Account`, `Mi Priority`) y `yu`, `wi` como pronombres.
5. Grafías `agen`, `likl`, `Someting`, `Loadin`: ¿cómo las escribiría la comunidad?
6. Saludo (`Hello,`) y la frase de la pantalla de inicio (`Yu de go di right way!`).
7. **Vocabulario médico** (`blood sugar`, `medicine`, `health history`) y todo texto de dosis o
   advertencias, cuando se migren: no deben publicarse sin revisión.
8. El nombre de la lengua en el selector, hoy `Inglés Creole (Kriol)`: ¿"Creole", "Kriol" u otro?

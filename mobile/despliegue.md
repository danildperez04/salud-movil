# Despliegue de la app móvil (Salud Móvil)

Este documento explica cómo se generan builds de la app móvil con **EAS Build**, qué perfil usar según el objetivo, y un problema conocido a resolver antes de compartir un build con testers.

## Perfiles configurados (`eas.json`)

| Perfil        | `distribution` | Uso                                                                              |
| ------------- | -------------- | -------------------------------------------------------------------------------- |
| `development` | `internal`     | Development client — requiere Metro corriendo, para trabajo diario del equipo    |
| `preview`     | `internal`     | APK standalone (JS embebido) — para compartir con testers/stakeholders sin Metro |
| `production`  | (default)      | Build final para subir a la Play Store                                           |

`appVersionSource: "remote"` significa que EAS lleva el control del número de versión, no `app.json` local — no hay que tocar versiones a mano.

## Cómo generar un build

Requiere estar logueado en una cuenta de Expo/EAS (`npx eas login`) y que el proyecto ya esté configurado (`eas build:configure`, ya hecho si `eas.json` existe).

### Build de preview (APK para compartir, sin Metro)

```bash
npx eas build --platform android --profile preview
```

Esto sube el código a la nube de EAS, compila un APK completo con el JS ya embebido (no depende de que tu Metro esté corriendo), y lo deja disponible para descargar/instalar.

### Build de development (development client, para el equipo)

```bash
npx eas build --platform android --profile development
```

Genera el mismo tipo de APK que usás con `npx expo run:android`, pero compilado en la nube en vez de localmente — útil si alguien del equipo no puede compilar localmente por su cuenta (por ejemplo, no tiene Android Studio bien configurado).

### Build de producción (para subir a la Play Store)

```bash
npx eas build --platform android --profile production
```

## Cómo instalar un build ya generado

1. Andá al [dashboard de EAS](https://expo.dev) → tu proyecto → Builds.
2. Abrí el build que terminó (estado `Finished`, ver columna Status).
3. Botón **Install** → genera un QR/link para instalar directo en el celular, o **Open with Orbit** para instalarlo en un emulador conectado a tu PC vía la extensión Orbit.

## Firma del APK (Android signing)

EAS Build genera y gestiona automáticamente un keystore de Android la primera vez que compilás, salvo que se configure explícitamente uno propio. Para builds de `preview`/`development` esto es suficiente. Para `production`, ese mismo keystore debe mantenerse estable entre builds (EAS lo persiste solo, pero **no lo borres ni regeneres manualmente** una vez que la app esté publicada en la Play Store, o dejará de poder actualizarse).

## Troubleshooting

| Problema                                                   | Causa probable                                                                                                                         |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| La app abre pero ninguna pantalla carga datos, login falla | `EXPO_PUBLIC_API_URL` no configurada en el perfil de `eas.json`, o backend no accesible públicamente                                   |
| Build falla en el paso `Install dependencies`              | Revisar que `package-lock.json` esté commiteado y sincronizado con `package.json`                                                      |
| El APK no se puede instalar ("app not installed")          | Puede haber una versión previa instalada firmada con un keystore distinto — desinstalar la versión anterior antes de instalar la nueva |

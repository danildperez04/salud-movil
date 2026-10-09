# Despliegue — Salud Móvil (mobile)

## Resumen

| Componente                      | Plataforma                                  |
| ------------------------------- | ------------------------------------------- |
| App móvil (Expo / React Native) | EAS Build (Expo Application Services)       |
| API backend                     | Render — `https://salud-movil.onrender.com` |

## Expo Go no es compatible

**No usar Expo Go** (la app de la store). El proyecto depende de `react-native-mmkv` (v4) y `react-native-nitro-modules`, que son **módulos nativos** y no existen en el runtime de Expo Go. `npx expo start` y escanear el QR con Expo Go **fallará al cargar la app**.

Para desarrollo local, dos caminos:

1. `npx expo run:android` — compila el APK de desarrollo con gradle y lo instala en un emulador o dispositivo (requiere Android SDK / Android Studio).
2. `eas build --profile development --platform android` — build en la nube de EAS; instalar el APK de desarrollo y conectarse con Metro.

En ambos casos el APK instalado tiene que ser un "development build" firmado con las mismas credenciales que el proyecto (`developmentClient: true` en `eas.json`), no un build normal.

## Requisitos previos

- Cuenta de Expo/EAS.
- `eas-cli` instalado (`npm i -g eas-cli`, o usarlo vía `npx eas-cli`). Este proyecto fija `"cli": { "version": ">= 23.2.0" }` en `eas.json`, así que cualquier versión de `eas-cli` por debajo de esa se rechaza automáticamente.
- Sesión iniciada: `eas login`.
- Proyecto vinculado a EAS (`eas init` la primera vez, si `app.json`/`app.config` todavía no tiene un `projectId` en `extra.eas`).

## Variables de entorno

- `EXPO_PUBLIC_API_URL`: URL base del backend que consume `lib/api-client.ts`.
  - Al llevar el prefijo `EXPO_PUBLIC_`, el valor queda embebido en el bundle del cliente — no es información sensible.
  - **En local:** se toma del `.env` en la raíz de `mobile/`.
  - **En builds de EAS (nube):** el `.env` local NO se sube automáticamente al build. Por eso cada profile de `eas.json` define explícitamente su propio `env` (ver abajo). Si un profile no lo define, `api-client.ts` cae al fallback `http://10.0.2.2:3000` (loopback del emulador de Android) — válido solo para desarrollo local, nunca para un build distribuido.

## `eas.json` — configuración de referencia

```json
{
  "cli": {
    "version": ">= 23.2.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://salud-movil.onrender.com"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://salud-movil.onrender.com"
      }
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_API_URL": "https://salud-movil.onrender.com"
      }
    },
    "apk": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://salud-movil.onrender.com"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

| Profile       | Distribución                              | Uso                                                                                                                |
| ------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `development` | `internal`, con `developmentClient: true` | Build con cliente de desarrollo, para iterar con Metro/Expo Dev Tools conectado.                                   |
| `preview`     | `internal`                                | Build de prueba instalable directamente (sin pasar por las stores), para compartir con testers vía link/QR de EAS. |
| `production`  | (para stores) con `autoIncrement: true`   | Build final (AAB para Google Play); el número de build se incrementa automáticamente en cada corrida.              |
| `apk`         | `internal`, `buildType: apk`              | Instalable de distribución directa (fuera de Play Store): solo arm64 y con las librerías comprimidas. Ver abajo.   |

> Si en el futuro el backend cambia de URL por ambiente (ej. un staging distinto para `preview`), basta con cambiar el valor de `EXPO_PUBLIC_API_URL` en ese profile puntual — no hay que tocar código.

## Comandos de build

```bash
# Development
eas build --profile development --platform android
eas build --profile development --platform ios

# Preview (distribución interna, para QA/testers)
eas build --profile preview --platform android
eas build --profile preview --platform ios

# Production
eas build --profile production --platform android
eas build --profile production --platform ios

# APK de distribución directa (Android, el más liviano)
eas build --profile apk --platform android
```

Al terminar un build `internal` (development/preview/apk), EAS entrega un link y un código QR para instalar el `.apk`/`.ipa` directamente en un dispositivo, sin pasar por Google Play / App Store.

## Tamaño y rendimiento del build Android

La configuración vive en `app.config.js` (extiende `app.json`) y actúa según el profile de EAS (`EAS_BUILD_PROFILE`):

| Medida                                                               | `development`  | `preview` / `production` |   `apk`   |
| -------------------------------------------------------------------- | :------------: | :----------------------: | :-------: |
| R8 + recursos sin usar (`enableMinify`/`enableShrinkResources`)      | (solo release) |            sí            |    sí     |
| Arquitecturas                                                        |     las 4      |  arm64-v8a, armeabi-v7a  | arm64-v8a |
| Librerías nativas comprimidas (`useLegacyPackaging`)                 |       no       |            no            |    sí     |
| Sin permiso `SYSTEM_ALERT_WINDOW` (solo para depuración)             |       no       |            sí            |    sí     |
| `allowBackup=false` (datos de salud fuera de los backups de Android) |       sí       |            sí            |    sí     |

Resultado medido del profile `apk` (SDK 57, build de EAS):

| Etapa                                                                              | APK         |
| ---------------------------------------------------------------------------------- | ----------- |
| R8, sin x86, fuentes e íconos recortados (arm64 + armeabi-v7a, libs sin comprimir) | 55,3 MB     |
| + solo arm64-v8a y librerías comprimidas (profile `apk`)                           | **22,5 MB** |

Otras medidas que ya están en el código:

- **Fuentes**: `app/_layout.tsx` importa cada peso por separado (`@expo-google-fonts/poppins/700Bold`, …). Importar el índice del paquete empaqueta las 37 fuentes (10 MB) aunque se usen 7.
- **Íconos**: se importan desde `lib/icons.ts`, no de `lucide-react-native`, que arrastra sus ~1.700 íconos al bundle. Si usas un ícono nuevo, agrégalo en ese archivo.
- **Red**: `lib/api-client.ts` corta cada petición a los 60 s con un mensaje claro, y al abrir la app hace un `GET /health` para despertar el servidor (ver "Backend").

Medir el arranque en frío en un dispositivo (el emulador no es representativo):

```bash
adb install -r salud-movil.apk
adb shell am force-stop com.jarey17.mobile
adb shell am start -W -n com.jarey17.mobile/.MainActivity   # TotalTime = arranque en frío (ms)
```

Repetir 5 veces y quedarse con la mediana. Si el dispositivo tiene instalado un build de desarrollo, hay que desinstalarlo antes: está firmado con otra llave.

## Publicación a las stores (`submit`)

```bash
eas submit --profile production --platform android
eas submit --profile production --platform ios
```

El bloque `submit.production` en `eas.json` está vacío (`{}`), así que en la primera corrida `eas-cli` va a pedir de forma interactiva los datos necesarios (service account de Google Play para Android, Apple ID/App Store Connect para iOS). Una vez completado el flujo interactivo, conviene guardar esos valores en `eas.json` para que las siguientes publicaciones no vuelvan a preguntar.

## Backend (Render)

- URL de producción: `https://salud-movil.onrender.com`
- La base de datos está en Supabase (plan gratuito) y la API la necesita para arrancar (`GET /health` hace un `SELECT 1`). **Un proyecto gratuito de Supabase se pausa tras ~7 días sin actividad**: si el APK instala pero no puede iniciar sesión, revisar primero el panel de Supabase ("Restore project") y luego los logs de Render.
- El plan gratuito de Render duerme el servicio tras ~15 min sin tráfico y tarda ~50 s en despertar. La app lo despierta al abrirse, pero antes de una demo conviene abrir la URL `/health` un par de minutos antes.

## Checklist antes de cada release

- [ ] Confirmar que el profile usado tiene `env.EXPO_PUBLIC_API_URL` apuntando al backend correcto (no asumir que toma el `.env` local).
- [ ] Verificar que el número de versión/build sea el esperado (`autoIncrement` solo aplica al profile `production`).
- [ ] Instalar y probar el build `preview` en un dispositivo físico antes de pasar a `production`.
- [ ] `curl https://salud-movil.onrender.com/health` responde `{"status":"ok"}` (si no, ver "Backend").
- [ ] Revisar el manifiesto del APK: `aapt2 dump badging app.apk` (sin `SYSTEM_ALERT_WINDOW`, `native-code` esperado) y `apksigner verify --print-certs app.apk` (firma de producción, no la de debug).
- [ ] Confirmar que el backend en Render esté respondiendo (o tener en cuenta el cold start si está en plan free).

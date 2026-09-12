# Despliegue — Salud Móvil (mobile)

## Resumen

| Componente                      | Plataforma                                  |
| ------------------------------- | ------------------------------------------- |
| App móvil (Expo / React Native) | EAS Build (Expo Application Services)       |
| API backend                     | Render — `https://salud-movil.onrender.com` |

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
| `production`  | (para stores) con `autoIncrement: true`   | Build final; el número de build se incrementa automáticamente en cada corrida.                                     |

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
```

Al terminar un build `internal` (development/preview), EAS entrega un link y un código QR para instalar el `.apk`/`.ipa` directamente en un dispositivo, sin pasar por Google Play / App Store.

## Publicación a las stores (`submit`)

```bash
eas submit --profile production --platform android
eas submit --profile production --platform ios
```

El bloque `submit.production` en `eas.json` está vacío (`{}`), así que en la primera corrida `eas-cli` va a pedir de forma interactiva los datos necesarios (service account de Google Play para Android, Apple ID/App Store Connect para iOS). Una vez completado el flujo interactivo, conviene guardar esos valores en `eas.json` para que las siguientes publicaciones no vuelvan a preguntar.

## Backend (Render)

- URL de producción: `https://salud-movil.onrender.com`

## Checklist antes de cada release

- [ ] Confirmar que el profile usado tiene `env.EXPO_PUBLIC_API_URL` apuntando al backend correcto (no asumir que toma el `.env` local).
- [ ] Verificar que el número de versión/build sea el esperado (`autoIncrement` solo aplica al profile `production`).
- [ ] Instalar y probar el build `preview` en un dispositivo físico antes de pasar a `production`.
- [ ] Confirmar que el backend en Render esté respondiendo (o tener en cuenta el cold start si está en plan free).

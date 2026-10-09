# Despliegue con Docker — Salud Móvil

Un solo comando levanta el panel web, la API y PostgreSQL en cualquier máquina
con Docker (Linux, macOS, Windows, un VPS, un servidor on‑premise…).

```
Internet ──► web (nginx :8080) ──┬─ /      panel web (SPA estática)
                                 └─ /api/  ──► api (NestJS :3000) ──► db (PostgreSQL)
```

- **Solo `web` publica un puerto.** La API y la base de datos viven en redes
  internas de Docker: la base nunca es alcanzable desde fuera, y la API solo a
  través de nginx.
- **Panel y API comparten origen** (`https://tu-dominio/` y
  `https://tu-dominio/api/`), así que el navegador no hace peticiones
  cross‑origin y el mismo build del panel sirve en cualquier dominio o puerto.
- La app móvil usa la misma URL: `EXPO_PUBLIC_API_URL=https://tu-dominio/api`.

## Inicio rápido

```bash
cp .env.example .env
# Edita .env: como mínimo DB_PASSWORD y JWT_SECRET
#   openssl rand -base64 24    # DB_PASSWORD
#   openssl rand -base64 48    # JWT_SECRET
docker compose up -d --build
```

Abre `http://localhost` (o `http://localhost:<HTTP_PORT>`). Comprobaciones:

```bash
docker compose ps                          # api y db deben quedar "healthy"
curl http://localhost/healthz              # nginx               -> ok
curl http://localhost/api/health           # API + base de datos -> {"status":"ok"}
```

El primer arranque aplica las migraciones y siembra catálogos y cuentas
iniciales (ver [Cuentas iniciales](#cuentas-iniciales)).

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `docker-compose.yml` | Stack completo: `db`, `api`, `web` |
| `docker-compose.dev.yml` | Override de desarrollo: publica `api:3000` y `db:5432` en localhost |
| `.env.example` | Todas las variables, documentadas |
| `api/Dockerfile`, `api/docker-entrypoint.sh` | Imagen multi‑etapa del API; el entrypoint aplica migraciones y arranca |
| `frontend/Dockerfile` | Compila la SPA y la sirve con nginx |
| `frontend/nginx/default.conf.template` | Reverse proxy `/api/`, SPA, caché y compresión |
| `frontend/nginx/snippets/security-headers.conf` | Cabeceras de seguridad de la SPA |
| `frontend/nginx/snippets/api-proxy.conf` | Cabeceras comunes del proxy hacia la API |

## CORS

CORS lo gestiona **solo la API** (`CORS_ORIGIN`); nginx no añade cabeceras CORS
(llegarían duplicadas y el navegador rechazaría la respuesta).

| Escenario | Qué hacer |
|---|---|
| Panel servido por este nginx (lo normal) | Nada. Es mismo origen. Por defecto `CORS_ORIGIN` = `PUBLIC_URL` |
| Otro frontend en otro dominio | `CORS_ORIGIN=https://otro.dominio,https://staging.dominio` (separados por coma, sin `/` final) |
| Desarrollo con Vite (`:5173`) | `docker-compose.dev.yml` ya lo configura |
| App móvil | No aplica: CORS es una restricción de navegadores |

Si `CORS_ORIGIN` no está definida (ejecución sin Docker) la API acepta cualquier
origen (`*`); con una lista, solo esos. El preflight se cachea 10 minutos.

## Variables

Todas están documentadas en [`.env.example`](../.env.example). Las
imprescindibles:

| Variable | Descripción |
|---|---|
| `DB_PASSWORD` | Contraseña de PostgreSQL. **Obligatoria** |
| `JWT_SECRET` | Secreto de firma de JWT. **Obligatorio**, único por entorno |
| `HTTP_PORT` | Puerto del host donde se publica nginx (por defecto `80`) |
| `PUBLIC_URL` | URL pública del panel; sirve de `CORS_ORIGIN` por defecto |
| `TRUST_PROXY` | Nº de proxies delante de la API (por defecto `1` = nginx) |
| `RELEASE_MAX_MB` | Tamaño máximo de un instalable subido desde el panel (por defecto `500`). Lo aplican el API y nginx |

> **`TRUST_PROXY` importa para la seguridad.** La API limita las peticiones por
> IP (`THROTTLE_LIMIT`). Detrás de un proxy sin `TRUST_PROXY`, todos los usuarios
> comparten una sola IP (la de nginx) y se bloquearían entre sí. nginx añade la
> IP real a `X-Forwarded-For`; la API toma la que corresponde al número de
> proxies configurado y no se fía de lo que el cliente ponga al principio de la
> cabecera. Si añades un balanceador/CDN delante de nginx, usa `TRUST_PROXY=2`.

`VITE_API_URL` (por defecto `/api`) se **incrusta al compilar** el panel; cambiarla
exige `docker compose build web`. Solo cámbiala si la API vive en otro dominio.

## Sitio público: descargas y solicitudes de demo

La landing (`/`) ofrece la descarga de la app y un formulario para pedir una
demostración. Ambos se gestionan desde el panel, con una cuenta **administradora**
(las secciones *Sitio web → Solicitudes de demo* e *Instaladores* del menú).

**Instaladores.** El admin sube el APK (Android), EXE (Windows) o DMG (macOS) de
cada versión. Para cada plataforma la landing ofrece la versión *publicada más
reciente*; si no hay ninguna, muestra «Disponible pronto». El API valida la
extensión y la firma del archivo (un `.apk` debe ser un ZIP, un `.exe` debe
empezar por `MZ`) y guarda su SHA-256.

- Los archivos viven en el volumen **`release-data`** (`/data/releases` en el
  contenedor), no en la base de datos. **Inclúyelo en tus copias de seguridad**,
  junto con `pg_dump`: restaurar solo la base dejaría versiones sin archivo.
- nginx deja pasar hasta `RELEASE_MAX_MB` (500 MB por defecto) únicamente en
  `POST /api/admin/releases`; el resto de la API sigue limitada a 2 MB. Si usas
  otro proxy o CDN delante de nginx, súbele también el límite de cuerpo ahí.
- Para guardar los archivos en S3 u otro servicio, basta una subclase de
  `ReleaseStorage` (`api/src/features/releases/release-storage.ts`).

```bash
# Copia de seguridad del volumen de instaladores
docker run --rm -v salud-movil_release-data:/data -v "$PWD":/backup alpine   tar czf /backup/releases.tgz -C /data .
```

**Solicitudes de demo.** `POST /api/demo-requests` es público y está limitado a
5 envíos por hora por IP (de ahí la importancia de `TRUST_PROXY`); un correo que
ya tiene una solicitud pendiente de las últimas 24 h no genera otra. Las
solicitudes se leen y gestionan solo desde el panel: **no se envía ningún
correo de aviso**, así que conviene revisar el panel con regularidad.

## Cuentas iniciales

El seed crea, si no existen, un administrador y un personal de salud de
ejemplo. Sin configuración usa contraseñas **públicas** (`Admin123!`,
`Personal123!`). En cualquier entorno accesible desde internet, define
`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_PERSONNEL_EMAIL` y
`SEED_PERSONNEL_PASSWORD` **antes del primer arranque**: el seed no modifica
cuentas ya creadas. Si ya arrancaste con los valores por defecto, cambia las
contraseñas desde la aplicación.

## HTTPS

La imagen sirve HTTP. Para producción, termina TLS delante:

- **Proveedor / balanceador** (Cloudflare, ALB, Render, Fly…): apunta al puerto
  publicado de `web`. Debe enviar `X-Forwarded-Proto`; nginx lo conserva.
  Usa `TRUST_PROXY=2`.
- **Caddy en el mismo servidor** (certificados automáticos). `Caddyfile`:

  ```
  salud.ejemplo.com {
      reverse_proxy 127.0.0.1:8080
  }
  ```

  Publica `web` solo en loopback con un `docker-compose.override.yml`:

  ```yaml
  services:
    web:
      ports: !override
        - "127.0.0.1:8080:8080"
  ```

  y en `.env`: `PUBLIC_URL=https://salud.ejemplo.com`, `TRUST_PROXY=2`.

## Base de datos externa (Supabase, RDS…)

```bash
# .env
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=5432
DB_USER=postgres.<ref>
DB_PASSWORD=...
DB_NAME=postgres

docker compose up -d --build --no-deps api web
```

`--no-deps` evita levantar el contenedor `db`.

## Operación

```bash
docker compose logs -f api                 # logs
docker compose up -d --build               # actualizar tras un git pull
docker compose down                        # parar (conserva los datos)
docker compose down -v                     # parar y BORRAR la base de datos

# Copia de seguridad / restauración (la base; los instaladores, ver
# «Sitio público» más arriba)
docker compose exec -T db pg_dump -U salud_movil salud_movil > backup.sql
docker compose exec -T db psql -U salud_movil salud_movil < backup.sql
```

**Migraciones.** Se aplican al arrancar `api` (`RUN_MIGRATIONS=true`), con
reintentos mientras la base termina de iniciar. Con varias réplicas de la API,
ponlo en `false` y ejecuta las migraciones desde un único job.

**Desarrollo local.**

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db api
cd frontend && pnpm dev      # VITE_API_URL=http://localhost:3000
```

## Solución de problemas

| Síntoma | Causa probable |
|---|---|
| `required variable DB_PASSWORD is missing` | Falta `.env` o la variable |
| `502 Bad Gateway` en `/api/` | `api` no está sano: `docker compose logs api` |
| Errores CORS en consola | El panel se abre desde una URL distinta de `PUBLIC_URL`/`CORS_ORIGIN` (p. ej. otro puerto) |
| `429 Too Many Requests` para todos | `TRUST_PROXY` no coincide con el número de proxies reales |
| `api` en bucle de reinicios con "migraciones fallidas" | Credenciales/host de base incorrectos |
| `exec ./docker-entrypoint.sh: no such file` (Windows) | El script se guardó con CRLF; `.gitattributes` fuerza LF, vuelve a clonar |

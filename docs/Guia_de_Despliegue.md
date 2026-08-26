# Guía de Despliegue — Salud Móvil

**Última actualización:** 24 de agosto de 2026
**Estado:** API desplegada en Render + PostgreSQL en Supabase · Panel web pendiente de desplegar

## 1. Arquitectura de despliegue

```
GitHub (rama main)
   │  push / merge
   ▼
Render ── Web Service ──── API NestJS (api/)  ──►  Supabase (PostgreSQL, Session Pooler)
       └─ Static Site ──── Panel web (frontend/) ──► consume la API vía HTTPS  [pendiente]
```

| Componente | Servicio | Repositorio | Estado |
|---|---|---|---|
| API REST | Render — Web Service | `api/` | Desplegada |
| Base de datos | Supabase — PostgreSQL | — | Desplegada |
| Panel web | Render — Static Site | `frontend/` | Pendiente |
| App móvil | EAS Build (Expo) | `mobile/` | Fuera de alcance por ahora |

## 2. Prerrequisitos

- Cuentas en [GitHub](https://github.com), [Render](https://render.com) y [Supabase](https://supabase.com).
- El repositorio conectado a Render con acceso de lectura.
- Para verificaciones locales: Node.js 20+ y pnpm 10.

## 3. Base de datos: Supabase (Session Pooler, IPv4)

El proyecto usa el **Session Pooler** de Supabase porque es compatible con IPv4. La conexión directa a la base de datos (`db.<ref>.supabase.co:5432`) es solo IPv6 y no funciona desde todos los proveedores.

**Pasos:**

1. Crear un proyecto en [supabase.com](https://supabase.com) (elegir la región más cercana a los usuarios).
2. Guardar la contraseña de la base de datos que se genera al crear el proyecto.
3. En el dashboard: **Connect → Session pooler** y copiar los parámetros de conexión.

**Mapeo a las variables del proyecto:**

| Parámetro de Supabase | Variable de entorno | Valor de ejemplo |
|---|---|---|
| Host | `DB_HOST` | `aws-0-us-east-1.pooler.supabase.com` |
| Puerto | `DB_PORT` | `5432` |
| Usuario | `DB_USER` | `postgres.abcdefghijk` |
| Contraseña | `DB_PASSWORD` | *(la del proyecto)* |
| Base de datos | `DB_NAME` | `postgres` |
| Tipo | `DB_TYPE` | `postgres` |

> **Importante:** con el pooler, el usuario es `postgres.<project-ref>` (lleva el sufijo del proyecto). No confundirlo con el usuario directo `postgres`.

**Notas del plan gratuito:**

- Los proyectos se **pausan tras ~1 semana de inactividad**; se restauran desde el dashboard (los datos se conservan).
- La API mantiene la conexión viva mientras reciba tráfico, pero si nadie la usa en varios días conviene verificar que Supabase no esté pausado.

## 4. API en Render (Web Service)

Configuración actual del servicio:

| Opción | Valor |
|---|---|
| Tipo | Web Service |
| Repositorio / rama | `danildperez04/salud-movil` / `main` |
| Root Directory | `api` |
| Runtime | Node |
| Build Command | `pnpm install && pnpm build` |
| Start Command | `pnpm start:prod` |
| Plan | Free |

**Variables de entorno** (Environment):

| Variable | Valor | Notas |
|---|---|---|
| `DB_TYPE` | `postgres` | |
| `DB_HOST` | `aws-<n>-<region>.pooler.supabase.com` | Ver sección 3 |
| `DB_PORT` | `5432` | |
| `DB_USER` | `postgres.<project-ref>` | Con sufijo del proyecto |
| `DB_PASSWORD` | *(contraseña de Supabase)* | Marcar como secreto |
| `DB_NAME` | `postgres` | |
| `JWT_SECRET` | *(cadena aleatoria larga)* | Generar con `openssl rand -base64 48`; nunca usar el valor de desarrollo |
| `JWT_EXPIRES_IN` | `1d` | |
| `CORS_ORIGIN` | `https://<panel>.onrender.com` | URL final del panel web; actualizar en el paso 6 |
| `PORT` | *(no definir)* | Render la inyecta automáticamente; `main.ts` la lee |

**Notas técnicas:**

- `PORT`: `main.ts` escucha en `process.env.PORT ?? 3000`, así que respeta el puerto que asigna Render.
- **bcrypt nativo:** el archivo `api/pnpm-workspace.yaml` aprueba los scripts de compilación de `bcrypt` (`allowBuilds`). Sin esa aprobación, pnpm ≥ 10 no compila el binario nativo y el build falla.
- **Primer arranque:** el seed idempotente crea roles, catálogos (17 departamentos, 150 municipios) y usuarios iniciales, entre ellos `admin@saludmovil.com` con contraseña `Admin123!`.
- No hay endpoint público de health check (`GET /` responde 404). En Render puede dejarse el Health Check Path vacío; agregar `GET /health` queda pendiente para la Fase 7.

**Verificación rápida:**

```bash
curl -X POST https://<tu-api>.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@saludmovil.com","password":"Admin123!"}'
```

Si responde `accessToken`, la API está operativa y conectada a Supabase.

## 5. Panel web en Render (Static Site)

El panel aún no está desplegado. Pasos para hacerlo cuando corresponda:

1. En Render: **New → Static Site**, conectar el mismo repositorio.
2. Configuración:

| Opción | Valor |
|---|---|
| Branch | `main` |
| Root Directory | `frontend` |
| Build Command | `pnpm install && pnpm build` |
| Publish Directory | `dist` |

3. Agregar la variable de entorno de build:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://<tu-api>.onrender.com` |

4. Agregar la regla de rewrite para SPA (React Router maneja las rutas del lado cliente):

| Regla | Origen | Destino | Acción |
|---|---|---|---|
| Rewrite | `/*` | `/index.html` | Rewrite |

Sin esta regla, refrescar una ruta como `/patients/1` devuelve 404.

> **Importante:** `VITE_API_URL` es una variable **de build**: Vite la incrusta en el bundle al compilar. Cambiarla después exige un redeploy del static site.

## 6. Cierre del ciclo: CORS

1. Copiar la URL final del Static Site (por ejemplo `https://salud-movil-web.onrender.com`).
2. En el Web Service de la API: **Environment → `CORS_ORIGIN`** = esa URL exacta (sin `/` final).
3. **Save and Deploy** para aplicar.

`main.ts` divide `CORS_ORIGIN` por comas, así que admite varios orígenes (por ejemplo, panel y un entorno de pruebas):

```bash
CORS_ORIGIN=https://panel.onrender.com,https://staging-panel.onrender.com
```

Sin este paso, el navegador bloquea las peticiones del panel con errores de CORS aunque la API funcione.

## 7. Consideraciones de producción

| Tema | Situación actual | Recomendación |
|---|---|---|
| Esquema de BD | `synchronize: true` crea/altera tablas al arrancar (deuda conocida) | Reemplazar por migraciones SQL antes de v1.0.0 (Fase 7) |
| Logging SQL | `logging: true` imprime cada query (incluye contraseñas en tránsito de queries de login) | Desactivar o filtrar en producción (Fase 7) |
| Usuario admin | El seed crea `admin@saludmovil.com` / `Admin123!` | Cambiar la contraseña inmediatamente después del primer despliegue |
| `JWT_SECRET` | Debe ser aleatorio y exclusivo de producción | `openssl rand -base64 48`; rotar ante cualquier sospecha |
| Cold starts | El plan Free de Render duerme el servicio tras ~15 min sin tráfico (~50 s en despertar) | Aceptable para demos; evitar en producción real |
| Pausa de Supabase | Proyectos free se pausan por inactividad | Revisar el dashboard si la API reporta errores de conexión tras días sin uso |
| Seguridad extra | Sin Helmet ni rate limiting | Pendiente en Fase 7 (`@nestjs/throttler`) |
| Health check | No existe endpoint público | Agregar `GET /health` en Fase 7 |

## 8. Checklist post-despliegue

- [ ] `POST /auth/login` con admin responde `accessToken`.
- [ ] `POST /auth/login` con personal de salud responde `accessToken`.
- [ ] `GET /catalogues/departments` con token devuelve los 17 departamentos.
- [ ] El panel web carga y el login funciona desde el navegador (sin errores de CORS en consola).
- [ ] Crear y editar un paciente desde el panel persiste en Supabase.
- [ ] La contraseña del admin fue cambiada.

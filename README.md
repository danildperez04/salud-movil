![logo](shared/assets/logo_default.png)

# Salud Movil

[![Netlify Status](https://api.netlify.com/api/v1/badges/d81d4de3-9685-44da-978b-0f08c91cde0b/deploy-status)](https://app.netlify.com/projects/salud-movil/deploys)

## Descripción

Salud Móvil es una plataforma para el seguimiento de pacientes con enfermedades crónicas y discapacidades en Nicaragua. Permite registrar y consultar el expediente clínico, monitorear indicadores de salud, gestionar citas médicas y recordatorios de medicamentos.

El sistema se compone de tres aplicaciones:

- **App móvil** (Expo/React Native): para pacientes y cuidadores.
- **Panel web** (React/Vite): para administradores y personal de salud.
- **API** (NestJS): backend compartido.

## Funcionalidades implementadas

- Autenticación JWT con control de acceso basado en roles (RBAC): registro de cuidador, inicio de sesión, recuperación y cambio de contraseña, perfil de usuario.
- CRUD de personal de salud (solo administrador) con creación transaccional de usuario y perfil de trabajador de salud.
- Búsqueda de cuidadores para vinculación a pacientes.
- CRUD de pacientes con búsqueda, filtrado por centro de salud y borrado lógico.
- Vinculación y desvinculación de cuidadores a pacientes.
- Expediente clínico con upsert y consultas médicas cronológicas.
- 12 catálogos de referencia (departamentos, municipios, géneros, tipos de cita, estados de cita, roles, tipos de indicador, vías de administración, tipos de parentesco, estados de notificación, especialidades y tipos de centro de salud).
- Seed de datos iniciales (usuario admin, personal de salud, 17 departamentos, 150 municipios).
- Panel web con login, dashboard por rol, gestión de personal de salud (listar, crear, editar) y gestión de pacientes (listar, crear, editar, detalle con pestañas de datos, expediente, consultas y cuidadores).

## Funcionalidades pendientes

- Módulo de citas médicas (entidades definidas, sin controlador/servicio).
- Módulo de indicadores de salud (entidad definida, sin controlador/servicio).
- Módulo de medicamentos y recordatorios (entidades definidas, sin controlador/servicio).
- App móvil: pantallas de funcionalidad (auth, pacientes, indicadores, citas, medicamentos).
- Almacenamiento seguro de tokens móviles (`expo-secure-store`).
- Notificaciones locales (`expo-notifications`).
- Migraciones SQL (actualmente usa `synchronize: true`).
- Rate limiting y Helmet.
- CI/CD con GitHub Actions.

## Arquitectura

El proyecto es un monorepo con tres aplicaciones:

| Carpeta | Aplicación | Tecnología |
| --- | --- | --- |
| `api` | Backend / API REST | NestJS 11 + TypeORM + PostgreSQL |
| `mobile` | App móvil (pacientes y cuidadores) | Expo SDK 57 + React Native + TypeScript |
| `frontend` | Panel web (admin y personal de salud) | React 19 + Vite 8 + TypeScript |
| `shared` | Recursos compartidos | Logos e imágenes |

## Stack Tecnológico

- **App móvil:** Expo SDK 57, React Native 0.86, React 19, expo-router, Uniwind/Tailwind v4, TanStack React Query, Zustand.
- **Panel web:** React 19, Vite 8, React Router 8, Tailwind v4, Zustand (con persist en localStorage).
- **Backend / API:** NestJS 11, TypeORM, JWT con guards globales (`JwtAuthGuard` + `RolesGuard`).
- **Base de datos:** PostgreSQL.
- **Autenticación:** JWT con RBAC (4 roles: admin, personal de salud, paciente, cuidador).

## Estructura de carpetas

```
salud-móvil/
├── api/
│   └── src/
│       ├── common/           # Decorators (@Roles, @Public, @CurrentUser) y guards (JWT, Roles)
│       ├── config/           # Configuración tipada de entorno
│       ├── database/         # Módulo de seed y datos iniciales
│       ├── features/
│       │   ├── auth/         # Login, registro, recuperación de contraseña
│       │   ├── users/        # CRUD de usuarios, personal de salud, cuidadores
│       │   ├── patients/     # CRUD de pacientes, vinculación de cuidadores
│       │   ├── medical-records/  # Expediente clínico y consultas médicas
│       │   ├── catalogues/   # 12 entidades de catálogo
│       │   ├── appointments/ # Citas: CRUD, cancelación, estados, próximo
│       │   ├── health-indicators/  # Indicadores: CRUD, último, resumen+rangos
│       │   ├── medications/  # Medicamentos: CRUD, horarios, recordatorios
│       │   └── health-centers/    # Entidad (usada por otros módulos)
│       └── main.ts
├── mobile/
│   ├── app/                  # Pantallas (expo-router, en desarrollo)
│   ├── components/ui/        # Componentes base (Button, Text)
│   ├── hooks/                # Hooks personalizados
│   ├── lib/                  # Tema, tokens, utilidades, cliente React Query
│   └── store/                # Estado con Zustand (UI activo, Auth pendiente)
├── frontend/
│   └── src/
│       ├── auth/             # Guards de rutas (RequireAuth, RequireRole)
│       ├── components/ui/    # 11 componentes (Alert, Badge, Button, Card, ConfirmDeleteModal, Input, Logo, Modal, Select, Table, buttonStyles)
│       ├── components/patients/  # HealthIndicatorBar e IpcpBadge
│       ├── layouts/          # AppLayout (sidebar) y AuthLayout
│       ├── lib/              # Cliente API, tipos de fecha, roles, navegación
│       ├── pages/            # Login, Home, RecoverPassword, personal, pacientes, cuidadores y ficha clínica
│       └── store/            # Zustand (auth con persist, catalogues)
├── docs/                     # Documentación del proyecto
└── shared/                   # Logo del proyecto
```

## Endpoints de la API

### Autenticación (`/auth`)

| Método | Ruta | Descripción | Acceso |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Registrar cuenta de cuidador | Público |
| `POST` | `/auth/login` | Iniciar sesión (devuelve JWT) | Público |
| `GET` | `/auth/me` | Obtener perfil del usuario actual | Autenticado |
| `POST` | `/auth/forgot-password` | Solicitar recuperación (siempre responde 200, sin revelar si el correo existe) | Público |
| `POST` | `/auth/reset-password` | Restablecer contraseña con token | Público |
| `POST` | `/auth/change-password` | Cambiar contraseña | Autenticado |

### Usuarios (`/users`)

| Método | Ruta | Descripción | Acceso |
| --- | --- | --- | --- |
| `POST` | `/users` | Crear personal de salud (crea user + healthcare_worker) | Admin |
| `GET` | `/users` | Listar usuarios | Admin |
| `GET` | `/users/:id` | Obtener usuario por ID | Admin |
| `PATCH` | `/users/:id` | Actualizar usuario | Admin |
| `DELETE` | `/users/:id` | Eliminar usuario (soft delete) | Admin |
| `GET` | `/caregivers?q=` | Buscar cuidadores | Admin, Personal de salud |

### Catálogos (`/catalogues`)

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/catalogues/departments` | Listar departamentos |
| `GET` | `/catalogues/genres` | Listar géneros |
| `GET` | `/catalogues/relationship-types` | Listar tipos de parentesco |
| `GET` | `/catalogues/majors` | Listar especialidades |
| `GET` | `/catalogues/health-centers` | Listar centros de salud |
| `GET` | `/catalogues/municipalities?departmentId=` | Listar municipios por departamento |
| `GET` | `/catalogues/type-indicators` | Listar tipos de indicador con su unidad |
| `GET` | `/catalogues/appointment-states` | Listar estados de cita |
| `GET` | `/catalogues/appointment-types` | Listar tipos de cita |
| `GET` | `/catalogues/notification-states` | Listar estados de notificación |
| `GET` | `/catalogues/route-administrations` | Listar vías de administración |

### Panel (`/dashboard`)

| Método | Ruta | Descripción | Acceso |
| --- | --- | --- | --- |
| `GET` | `/dashboard/stats` | Contadores del panel y pacientes con indicadores en banda de alerta o crítica | Admin, Personal de salud |

### Pacientes (`/patients`)

| Método | Ruta | Descripción | Acceso |
| --- | --- | --- | --- |
| `POST` | `/patients` | Crear paciente (crea user + patient) | Admin, Personal de salud |
| `GET` | `/patients?q=` | Listar/buscar pacientes (filtrado por centro, con última consulta) | Admin, Personal de salud |
| `GET` | `/patients/me` | Obtener perfil propio del paciente | Paciente |
| `GET` | `/patients/linked` | Obtener pacientes vinculados | Cuidador |
| `GET` | `/patients/:id` | Obtener detalle de paciente | Admin, Personal de salud |
| `PATCH` | `/patients/:id` | Actualizar paciente (admin puede reasignar el centro de salud) | Admin, Personal de salud |
| `DELETE` | `/patients/:id` | Eliminar paciente (soft delete) | Admin |
| `GET` | `/patients/:id/caregivers` | Listar cuidadores vinculados | Admin, Personal de salud |
| `POST` | `/patients/:id/caregivers` | Vincular cuidador a paciente | Admin, Personal de salud |
| `DELETE` | `/patients/:id/caregivers/:caregiverId` | Desvincular cuidador | Admin, Personal de salud |

### Expediente Clínico (montado bajo `/patients`)

| Método | Ruta | Descripción | Acceso |
| --- | --- | --- | --- |
| `PUT` | `/patients/:id/medical-record` | Crear o actualizar expediente clínico | Admin, Personal de salud |
| `GET` | `/patients/:id/medical-record` | Obtener expediente con consultas | Admin, Personal de salud |
| `POST` | `/patients/:id/medical-visits` | Registrar consulta médica | Admin, Personal de salud |
| `GET` | `/patients/me/history` | Ver propio historial clínico | Paciente |

### Indicadores de salud (montado bajo `/patients`)

| Método | Ruta | Descripción | Acceso |
| --- | --- | --- | --- |
| `POST` | `/patients/me/health-indicators` | Registrar indicador propio | Paciente |
| `GET` | `/patients/me/health-indicators?typeIndicatorId=&from=&to=` | Listar propios indicadores | Paciente |
| `PATCH` | `/patients/me/health-indicators/:indicatorId` | Editar indicador propio | Paciente |
| `DELETE` | `/patients/me/health-indicators/:indicatorId` | Eliminar indicador propio | Paciente |
| `POST` | `/patients/:id/health-indicators` | Registrar indicador de un paciente | Admin, Personal de salud |
| `GET` | `/patients/:id/health-indicators?typeIndicatorId=&from=&to=` | Listar indicadores de un paciente | Admin, Personal de salud |
| `GET` | `/patients/:id/health-indicators/latest` | Último valor por tipo de indicador | Admin, Personal de salud |
| `GET` | `/patients/:id/health-indicators/summary` | Resumen con rangos clínicos y estado (normal/bajo/alto) | Admin, Personal de salud |
| `PATCH` | `/patients/:id/health-indicators/:indicatorId` | Editar indicador | Admin, Personal de salud |
| `DELETE` | `/patients/:id/health-indicators/:indicatorId` | Eliminar indicador | Admin, Personal de salud |

### Citas (montado bajo `/patients`)

| Método | Ruta | Descripción | Acceso |
| --- | --- | --- | --- |
| `GET` | `/patients/me/appointments/upcoming` | Próximas citas propias | Paciente |
| `GET` | `/patients/me/reminders?windowDays=` | Feed de recordatorios: tomas y citas (por defecto 7 días) | Paciente |
| `GET` | `/patients/:id/reminders?windowDays=` | Feed de recordatorios de un paciente | Admin, Personal de salud |
| `POST` | `/patients/:id/appointments` | Crear cita (genera recordatorio 30 min antes) | Admin, Personal de salud |
| `GET` | `/patients/:id/appointments` | Listar citas del paciente | Admin, Personal de salud |
| `GET` | `/patients/:id/appointments/upcoming` | Próximas citas (estado Scheduled, ordenadas por fecha) | Admin, Personal de salud |
| `PATCH` | `/patients/:id/appointments/:appointmentId` | Modificar cita programada | Admin, Personal de salud |
| `DELETE` | `/patients/:id/appointments/:appointmentId` | Eliminar cita programada | Admin, Personal de salud |
| `POST` | `/patients/:id/appointments/:appointmentId/cancel` | Cancelar cita (motivo + marca temporal) | Admin, Personal de salud |
| `PATCH` | `/patients/:id/appointments/:appointmentId/state` | Cambiar estado (Completed / No show) | Admin, Personal de salud |

### Medicamentos (montado bajo `/patients`)

| Método | Ruta | Descripción | Acceso |
| --- | --- | --- | --- |
| `GET` | `/patients/me/medications` | Listar propios medicamentos con horarios | Paciente |
| `POST` | `/patients/me/medications/:medicationId/reminders/:reminderId/confirm` | Confirmar toma (HU-26) | Paciente |
| `POST` | `/patients/:id/medications` | Prescribir medicamento (genera recordatorios) | Admin, Personal de salud |
| `GET` | `/patients/:id/medications` | Listar medicamentos del paciente | Admin, Personal de salud |
| `PATCH` | `/patients/:id/medications/:medicationId` | Editar (activo, horarios, datos) | Admin, Personal de salud |
| `DELETE` | `/patients/:id/medications/:medicationId` | Eliminar medicamento (soft delete) | Admin, Personal de salud |

### Índice de prioridad del paciente (IPCP)

Regla explicable sobre datos medidos: desviación de indicadores, adherencia,
cumplimiento de controles y tendencia, con renormalización de las variables sin
datos. Ver la advertencia de la §Estado de desarrollo sobre la validación
médica pendiente.

| Método | Ruta | Descripción | Acceso |
| --- | --- | --- | --- |
| `GET` | `/patients/:id/ipcp` | IPCP del paciente, con desglose por variable (HU-32, HU-33) | Admin, Personal de salud |
| `GET` | `/patients/me/ipcp` | IPCP propio (HU-34) | Paciente |

Fuera del alcance del paciente queda el **peso**: `cat_type_indicator` no tiene
rangos ni bandas para él, así que no hay umbral con el que puntuarlo. Está
documentado en la respuesta (`exclusions`) en vez de inventarse un rango.

## Estado de desarrollo

| Aplicación | Estado | Detalle |
| --- | --- | --- |
| **API** | ~97% | 12 módulos (los 11 anteriores más `ipcp`). Helmet, rate limiting, bandas de gravedad clínica, IPCP multivariable con renormalización, esquema gobernado por migraciones (`synchronize: false`) y **78 unitarias + 14 e2e**. Pendiente: la validación médica de bandas y pesos |
| **Frontend** | ~80% | Login, recuperación de contraseña completa (solicitar **y** establecer), perfil y cambio de contraseña, dashboard con datos reales, gestión de personal, pacientes y cuidadores, y ficha clínica con indicadores, IPCP, citas, medicamentos y consultas. Sin datos clínicos inventados, con un guardia que lo verifica. Pendiente: 4 rutas `ComingSoon` (§9 del plan de cierre) |
| **Mobile** | ~5% | Scaffold con Expo SDK 57, tokens de diseño y layout base. **La API que necesita ya está entregada**: recordatorios, indicadores, citas, medicamentos e IPCP |

### Reparto del trabajo

- **`api/` y `frontend/`**: un solo frente. El panel consume la API directamente.
- **`mobile/`**: lo asume **jarey**. La API entrega lo que necesita en `me/*` y en el feed de recordatorios; ver el contrato en el plan de cierre.
- El plan de cierre vive **fuera del repositorio**, en
  `/data/development/opencode-plans/salud-movil/plan-cierre-mvp.md`, y ahí se
  registra el avance de cada fase.

> ⚠️ **Rangos clínicos y pesos del IPCP pendientes de validación médica.**
> Las bandas `normal` / `alert` / `critical` y los pesos del índice (40/25/20/15)
> son valores estándar de referencia, **no umbrales validados clínicamente**. El
> IPCP **no debe usarse para priorizar pacientes reales** hasta que el equipo
> médico los confirme.
>
> El IPCP es una **regla explicable y determinista, no IA**: la misma
> información produce siempre el mismo score, y la API devuelve el desglose por
> variable para que se pueda revisar. Renormaliza: una variable sin datos no
> cuenta como 0, el resto se reescala. No diagnostica ni sustituye al médico.
> Los pesos están en constantes aisladas (`api/src/features/ipcp/ipcp.constants.ts`)
> para que cambiarlos no obligue a reescribir el cálculo.

**Cronograma:** el de `docs/Plan_de_Desarrollo.md` fijaba la entrega de v1.0.0
el 1 de septiembre de 2026 y **esa fecha venció**, igual que la de la
presentación. Se conserva como documento histórico; el estado real y lo que
falta están en el **plan de cierre**, que vive fuera del repositorio:

```
/data/development/opencode-plans/salud-movil/plan-cierre-mvp.md
```

Su §9 es el registro de **lo que queda fuera del MVP**: functionality
conservada en el código pero no implementada, con el motivo y lo que falta para
cada cosa.

## Instalación

Clona el repositorio:

``` bash
git clone https://github.com/danildperez04/salud-móvil.git
```

### Dependencias

- [Node.js](https://nodejs.org) y [pnpm](https://pnpm.io) para `api` y `frontend`.
- npm para `mobile` (proyecto Expo / React Native).

> **Importante (`frontend/`):** el gestor canónico es **pnpm**. El repo conserva un `package-lock.json` obsoleto que provoca errores de dependencias faltantes si alguien usa `npm install`; ignorarlo y usar siempre `pnpm install`.

### Backend

``` bash
cd api
pnpm install
pnpm run migration:run   # crea el esquema (ver abajo)
pnpm run start:dev
```

#### El esquema lo crean las migraciones

Desde el 5-oct-2026 la API usa `synchronize: false`: el arranque **no** altera
la base. El esquema sale de `src/database/migrations/`, así que hay que aplicar
las migraciones una vez por base.

``` bash
pnpm run migration:run     # aplicar
pnpm run migration:show    # ver cuál falta
pnpm run migration:check   # fallar si las entidades y las migraciones divergen
```

> **La base de desarrollo actual no está registrada en `migrations`**: nació de
> `synchronize`, tiene el esquema correcto pero con residuos, y `migration:run`
> le fallaría. Para reconstruirla desde cero hay
> `scripts/reset-dev-db.sh`, que es **destructivo** (exige `CONFIRM_RESET`).

Regenerar la migración baseline exige una base **vacía**: contra una ya creada
por `synchronize` no habría diferencias y saldría una migración vacía. Para eso
está `scripts/migration-baseline.sh`, que crea una base temporal, genera y
verifica que la migración reconstruye el esquema en una segunda base.

### Pruebas

Las unitarias no tocan la base. Las **e2e sí**, y se niegan a arrancar si el
nombre de la base no contiene `test`: antes escribían en la de desarrollo y
dejaron 52 usuarios `e2e-*` ahí.

``` bash
cd api && pnpm test     # unitarias

# e2e sobre una base dedicada (el globalSetup aplica las migraciones)
createdb salud_movil_test
DB_NAME=salud_movil_test pnpm test:e2e

cd frontend && pnpm verify   # lint + guardia de mocks + build
```

### Frontend

``` bash
cd frontend
pnpm install
pnpm run dev
```

### App móvil

``` bash
cd mobile
npm install
npx expo start
```

### Entorno

Crea un archivo `.env` en la carpeta `api` definiendo las siguientes variables (ver `api/.env.example`):

``` bash
HOST=your_host
PORT=your_port

DB_TYPE=your_database_type
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

JWT_SECRET=your_secret
JWT_EXPIRES_IN=your_expiration
```

## Documentación adicional

Toda la documentación del proyecto se encuentra en la carpeta `docs/`:

- `PRD_MVP_MoSCoW_ANALISIS_DE_LA_APP.md` — Documento de requisitos del producto y priorización MoSCoW.
- `Plan_de_Desarrollo.md` — Plan de desarrollo por fases con cronograma.
- `Guia_de_Despliegue.md` — Guía de despliegue: API en Render, PostgreSQL en Supabase y panel web.
- `Esquema_de_Base_de_Datos.md` — Esquema completo de la base de datos (28 tablas).
- `Backlog_del_Proyecto_SALUD_MOVIL.md` — Backlog de historias de usuario.
- `Plan_SCRUM_y_estrategia_de_versionado.md` — Metodología SCRUM y estrategia de versionado.
- `Definicion_de_la_solucion.md` — Definición técnica de la solución.

## Licencia

Este proyecto es privado. Ver `LICENSE` para más detalles.

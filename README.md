![logo](shared/assets/logo_default.png)

# Salud Movil

## Descripcion

Salud Movil es una plataforma para el seguimiento de pacientes con enfermedades cronicas y discapacidades en Nicaragua. Permite registrar y consultar el expediente clinico, monitorear indicadores de salud, gestionar citas medicas y recordatorios de medicamentos.

El sistema se compone de tres aplicaciones:

- **App movil** (Expo/React Native): para pacientes y cuidadores.
- **Panel web** (React/Vite): para administradores y personal de salud.
- **API** (NestJS): backend compartido.

## Funcionalidades implementadas

- Autenticacion JWT con control de acceso basado en roles (RBAC): registro de cuidador, inicio de sesion, recuperacion y cambio de contrasena, perfil de usuario.
- CRUD de personal de salud (solo administrador) con creacion transaccional de usuario y perfil de trabajador de salud.
- Busqueda de cuidadores para vinculacion a pacientes.
- CRUD de pacientes con busqueda, filtrado por centro de salud y borrado logico.
- Vinculacion y desvinculacion de cuidadores a pacientes.
- Expediente clinico con upsert y consultas medicas cronologicas.
- 12 catalogos de referencia (departamentos, municipios, generos, tipos de cita, estados de cita, roles, tipos de indicador, vias de administracion, tipos de parentesco, estados de notificacion, especialidades y tipos de centro de salud).
- Seed de datos iniciales (usuario admin, personal de salud, 17 departamentos, 150 municipios).
- Panel web con login, dashboard por rol, gestion de personal de salud (listar, crear, editar) y gestion de pacientes (listar, crear, editar, detalle con pestanas de datos, expediente, consultas y cuidadores).

## Funcionalidades pendientes

- Modulo de citas medicas (entidades definidas, sin controlador/servicio).
- Modulo de indicadores de salud (entidad definida, sin controlador/servicio).
- Modulo de medicamentos y recordatorios (entidades definidas, sin controlador/servicio).
- App movil: pantallas de funcionalidad (auth, pacientes, indicadores, citas, medicamentos).
- Almacenamiento seguro de tokens moviles (`expo-secure-store`).
- Notificaciones locales (`expo-notifications`).
- Migraciones SQL (actualmente usa `synchronize: true`).
- Rate limiting y Helmet.
- CI/CD con GitHub Actions.

## Arquitectura

El proyecto es un monorepo con tres aplicaciones:

| Carpeta | Aplicacion | Tecnologia |
| --- | --- | --- |
| `api` | Backend / API REST | NestJS 11 + TypeORM + PostgreSQL |
| `mobile` | App movil (pacientes y cuidadores) | Expo SDK 57 + React Native + TypeScript |
| `frontend` | Panel web (admin y personal de salud) | React 19 + Vite 8 + TypeScript |
| `shared` | Recursos compartidos | Logos e imagenes |

## Stack Tecnologico

- **App movil:** Expo SDK 57, React Native 0.86, React 19, expo-router, Uniwind/Tailwind v4, TanStack React Query, Zustand.
- **Panel web:** React 19, Vite 8, React Router 8, Tailwind v4, Zustand (con persist en localStorage).
- **Backend / API:** NestJS 11, TypeORM, JWT con guards globales (`JwtAuthGuard` + `RolesGuard`).
- **Base de datos:** PostgreSQL.
- **Autenticacion:** JWT con RBAC (4 roles: admin, personal de salud, paciente, cuidador).

## Estructura de carpetas

```
salud-movil/
├── api/
│   └── src/
│       ├── common/           # Decorators (@Roles, @Public, @CurrentUser) y guards (JWT, Roles)
│       ├── config/           # Configuracion tipada de entorno
│       ├── database/         # Modulo de seed y datos iniciales
│       ├── features/
│       │   ├── auth/         # Login, registro, recuperacion de contrasena
│       │   ├── users/        # CRUD de usuarios, personal de salud, cuidadores
│       │   ├── patients/     # CRUD de pacientes, vinculacion de cuidadores
│       │   ├── medical-records/  # Expediente clinico y consultas medicas
│       │   ├── catalogues/   # 12 entidades de catalogo
│       │   ├── appointments/ # Entidades (controlador/servicio pendientes)
│       │   ├── health-indicators/  # Entidad (controlador/servicio pendientes)
│       │   ├── medications/  # Entidades (controlador/servicio pendientes)
│       │   └── health-centers/    # Entidad (usada por otros modulos)
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
│       ├── components/ui/    # 8 componentes reutilizables (Alert, Badge, Button, Card, Input, Modal, Select, Table)
│       ├── layouts/          # AppLayout (sidebar) y AuthLayout
│       ├── lib/              # Cliente API, mapeo de roles
│       ├── pages/            # Login, Home, StaffList, StaffForm, PatientsList, PatientForm, PatientDetail
│       └── store/            # Zustand (auth con persist, catalogues)
├── docs/                     # Documentacion del proyecto
└── shared/                   # Logo del proyecto
```

## Endpoints de la API

### Autenticacion (`/auth`)

| Metodo | Ruta | Descripcion | Acceso |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Registrar cuenta de cuidador | Publico |
| `POST` | `/auth/login` | Iniciar sesion (devuelve JWT) | Publico |
| `GET` | `/auth/me` | Obtener perfil del usuario actual | Autenticado |
| `POST` | `/auth/forgot-password` | Solicitar token de recuperacion | Publico |
| `POST` | `/auth/reset-password` | Restablecer contrasena con token | Publico |
| `POST` | `/auth/change-password` | Cambiar contrasena | Autenticado |

### Usuarios (`/users`)

| Metodo | Ruta | Descripcion | Acceso |
| --- | --- | --- | --- |
| `POST` | `/users` | Crear personal de salud (crea user + healthcare_worker) | Admin |
| `GET` | `/users` | Listar usuarios | Admin |
| `GET` | `/users/:id` | Obtener usuario por ID | Admin |
| `PATCH` | `/users/:id` | Actualizar usuario | Admin |
| `DELETE` | `/users/:id` | Eliminar usuario (soft delete) | Admin |
| `GET` | `/caregivers?q=` | Buscar cuidadores | Admin, Personal de salud |

### Catalogos (`/catalogues`)

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/catalogues/departments` | Listar departamentos |
| `GET` | `/catalogues/genres` | Listar generos |
| `GET` | `/catalogues/relationship-types` | Listar tipos de parentesco |
| `GET` | `/catalogues/majors` | Listar especialidades |
| `GET` | `/catalogues/health-centers` | Listar centros de salud |
| `GET` | `/catalogues/municipalities?departmentId=` | Listar municipios por departamento |

### Pacientes (`/patients`)

| Metodo | Ruta | Descripcion | Acceso |
| --- | --- | --- | --- |
| `POST` | `/patients` | Crear paciente (crea user + patient) | Admin, Personal de salud |
| `GET` | `/patients?q=` | Listar/buscar pacientes (filtrado por centro) | Admin, Personal de salud |
| `GET` | `/patients/me` | Obtener perfil propio del paciente | Paciente |
| `GET` | `/patients/linked` | Obtener pacientes vinculados | Cuidador |
| `GET` | `/patients/:id` | Obtener detalle de paciente | Admin, Personal de salud |
| `PATCH` | `/patients/:id` | Actualizar paciente | Admin, Personal de salud |
| `DELETE` | `/patients/:id` | Eliminar paciente (soft delete) | Admin |
| `GET` | `/patients/:id/caregivers` | Listar cuidadores vinculados | Admin, Personal de salud |
| `POST` | `/patients/:id/caregivers` | Vincular cuidador a paciente | Admin, Personal de salud |
| `DELETE` | `/patients/:id/caregivers/:caregiverId` | Desvincular cuidador | Admin, Personal de salud |

### Expediente Clinico (montado bajo `/patients`)

| Metodo | Ruta | Descripcion | Acceso |
| --- | --- | --- | --- |
| `PUT` | `/patients/:id/medical-record` | Crear o actualizar expediente clinico | Admin, Personal de salud |
| `GET` | `/patients/:id/medical-record` | Obtener expediente con consultas | Admin, Personal de salud |
| `POST` | `/patients/:id/medical-visits` | Registrar consulta medica | Admin, Personal de salud |
| `GET` | `/patients/me/history` | Ver propio historial clinico | Paciente |

## Estado de desarrollo

| Aplicacion | Estado | Detalle |
| --- | --- | --- |
| **API** | ~70% | 5 modulos funcionales (auth, users, patients, catalogues, medical-records). 3 modulos con entidades definidas sin logica (appointments, health-indicators, medications). Pendientes: migraciones SQL, rate limiting, tests. |
| **Frontend** | ~60% | Login, dashboard, gestion de personal de salud y pacientes completa. Pendiente: modulo de indicadores de salud en panel web. |
| **Mobile** | ~5% | Scaffold con Expo SDK 57, tokens de disenno y layout base. Sin pantallas funcionales ni cliente API. |

**Cronograma de desarrollo (ver `docs/Plan_de_Desarrollo.md`):**

| Fase | Periodo | Contenido | Estado |
| --- | --- | --- | --- |
| Fase 0-1 | Ago 6-13 | Scaffold, auth, usuarios, pacientes, expediente, frontend | Completada |
| Fase 2 | Ago 13-14 | App movil: auth, pacientes, expediente | Pendiente |
| Fase 3 | Ago 14-16 | Indicadores de salud (API + movil) | Pendiente |
| Fase 4 | Ago 17-20 | Citas medicas (API + movil) | Pendiente |
| Fase 5 | Ago 21-24 | Medicamentos y recordatorios (API + movil) | Pendiente |
| Fase 6 | Ago 25-28 | Panel web: indicadores | Pendiente |
| Fase 7 | Ago 29 - Sep 1 | Seguridad, tests, CI/CD, builds, entrega | Pendiente |

## Instalacion

Clona el repositorio:

``` bash
git clone https://github.com/danildperez04/salud-movil.git
```

### Dependencias

- [Node.js](https://nodejs.org) y [pnpm](https://pnpm.io) para `api` y `frontend`.
- npm para `mobile` (proyecto Expo / React Native).

### Backend

``` bash
cd api
pnpm install
pnpm run start:dev
```

### Frontend

``` bash
cd frontend
pnpm install
pnpm run dev
```

### App movil

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

## Documentacion adicional

Toda la documentacion del proyecto se encuentra en la carpeta `docs/`:

- `PRD_MVP_MoSCoW_ANALISIS_DE_LA_APP.md` — Documento de requisitos del producto y priorizacion MoSCoW.
- `Plan_de_Desarrollo.md` — Plan de desarrollo por fases con cronograma.
- `Esquema_de_Base_de_Datos.md` — Esquema completo de la base de datos (28 tablas).
- `Backlog_del_Proyecto_SALUD_MOVIL.md` — Backlog de historias de usuario.
- `Plan_SCRUM_y_estrategia_de_versionado.md` — Metodologia SCRUM y estrategia de versionado.
- `Definicion_de_la_solucion.md` — Definicion tecnica de la solucion.

## Licencia

Este proyecto es privado. Ver `LICENSE` para mas detalles.

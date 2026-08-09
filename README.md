![logo](shared/assets/logo_default.png)

# Salud Movil

## Descripción

Salud Móvil es una solución para personas con enfermedades crónicas y discapacidades. Permite registrar y consultar el expediente clínico, monitorear indicadores de salud (presión arterial, glucosa, peso y temperatura), gestionar citas médicas y recordatorios de medicamentos, y facilita al personal de salud el seguimiento de sus pacientes a través de una app móvil y un panel web.

## Funcionalidades

- Registro e inicio de sesión de pacientes, cuidadores y personal de salud (gestión de cuentas por el administrador).
- Expediente clínico único con historial cronológico de consultas.
- Registro y visualización de indicadores de salud con historial y gráficas.
- Gestión de citas médicas (crear, modificar, cancelar y confirmar) con recordatorios locales.
- Registro de medicamentos con horarios y recordatorios locales de toma.
- Panel web para el personal de salud: gestión de cuentas y pacientes asignados.

## Instalación

Primero clona el repositorio en tu entorno local usando el siguiente comando

``` bash
  git clone https://github.com/danildperez04/salud-movil.git
```

### Dependencias

- [Node.js](https://nodejs.org) y [pnpm](https://pnpm.io) para `api` y `frontend`.
- npm para `mobile` (Proyecto Expo / React Native).

### Instalación del backend

Primero hay que inicializar y correr el servidor backend con los siguientes comandos

``` bash
  cd api
  pnpm install
  pnpm run start:dev
```

### Instalación del frontend

Luego desde la carpeta root hay que inicializar y correr el servidor del frontend

``` bash
  cd frontend
  pnpm install
  pnpm run dev
```

### Instalación de la app móvil

``` bash
  cd mobile
  npm install
  npx expo start
```

### Entorno

Crea un archivo `.env` en la carpeta `api` definiendo las siguientes variables (ver `api/.env.example`)

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

## Arquitectura

El proyecto es un monorepo con tres aplicaciones:

| Carpeta | Aplicación | Tecnología |
| --- | --- | --- |
| `api` | Backend / API REST | NestJS + TypeORM + PostgreSQL |
| `mobile` | App móvil (pacientes, cuidadores y personal de salud) | Expo + React Native + TypeScript |
| `frontend` | Panel web (personal de salud) | React + TypeScript + Vite |
| `shared` | Recursos compartidos | Logos e imágenes |

### Estructura de carpetas

- `api/src/features/`: módulos por dominio (`users`, `patients`, `catalogues`, `medical-records`, `health-indicators`, `appointments`, `medications`, `health-centers`) con sus entidades.
- `api/src/features/<dominio>/entities/`: entidades TypeORM que modelan el esquema de base de datos.
- `docs/`: documentación del proyecto (backlog, PRD, plan de desarrollo, esquema de BD y estrategia SCRUM).

### Stack Tecnologico

- **App móvil:** Expo + React Native (notificaciones locales con Expo Notifications).
- **Panel web:** React + TypeScript (Vite).
- **Backend / API:** NestJS + TypeORM.
- **Base de datos:** PostgreSQL.
- **Autenticación:** JWT con control de acceso basado en roles (RBAC) (en implementación).

## Uso Básico

### API

La API corre por defecto en `http://localhost:PORT` (configurable en `.env`). Los endpoints actualmente disponibles son los CRUD del módulo `users` (`POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`). El módulo de autenticación (`/auth/login`) está pendiente de implementación (ver `docs/Plan_de_Desarrollo.md`).
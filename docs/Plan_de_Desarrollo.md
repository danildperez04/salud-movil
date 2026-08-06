# Plan de Desarrollo — Salud Móvil (MVP)

**Fecha de elaboración:** 6 de agosto de 2026
**Entrega objetivo:** v1.0.0 funcional el **1 de septiembre de 2026**

## 1. Objetivo

Entregar el Producto Mínimo Viable (MVP) de **Salud Móvil** cumpliendo las 17 historias de usuario del backlog organizadas en 6 épicas, respetando la estrategia de versionado semántico definida en `Plan_SCRUM_y_estrategia_de_versionado.md`.

**Prioridades transversales:**

1. **App móvil primero**: las funcionalidades esenciales se desarrollan y prueban en la app móvil (Expo/React Native).
2. **Panel web para personal de salud como prioridad media**: se incluye al final con una versión de consulta básica si el avance lo permite (aparece como "Should Have" en el PRD).
3. **Recordatorios con notificación local** en el dispositivo para el MVP (más fiable y sin infraestructura externa). El envío remoto vía Firebase Cloud Messaging (FCM) queda como mejora futura.

## 2. Estado actual del código (diagnóstico)

### 2.1 API — `api/` (NestJS 11 + TypeORM + PostgreSQL)

| Presente | Falta |
|---|---|
| Scaffold NestJS 11 con TypeORM y PostgreSQL conectado | Autenticación (JWT/RBAC) |
| Config de entorno tipada (`src/config/configuration.ts`) | Entidad `User` completa y CRUD real |
| Módulo `users` (stub, con DTOs vacíos) | Todos los módulos de dominio (pacientes, expediente, indicadores, citas, medicamentos) |
| | Migraciones (usa `synchronize: true`) |
| | `ValidationPipe` global, CORS, helmet |

**Deuda técnica a corregir en Fase 0:**
- `main.ts` sin `ValidationPipe` global, sin CORS y sin prefijo `/api`.
- El README raíz documenta endpoints de auth (`POST /auth/login`) que aún no existen.

### 2.2 Mobile — `mobile/` (Expo SDK 57 + React Native + Uniwind/Tailwind)

| Presente | Falta |
|---|---|
| Expo SDK 57, TypeScript, Uniwind + Tailwind v4 con tokens de diseño | Router activo (`expo-router` instalado pero sin carpeta `app/`) |
| Reanimated, gesture-handler, safe-area, expo-router instalado | Pantallas de auth y de funciones |
| `lib/theme.ts` con colores, fuentes y tipografías | Cliente API y gestión de sesión |
| | Almacenamiento seguro de tokens (`expo-secure-store`) |
| | Notificaciones (`expo-notifications`) |

**Deuda técnica a corregir en Fase 0:**
- `metro.config.js` referencia `./src/global.css` y `./src/uniwind-types.d.ts`, pero esos archivos están en la raíz del proyecto (no existe carpeta `src/`).

### 2.3 Frontend — `frontend/` (React 19 + Vite 8 + TypeScript)

| Presente | Falta |
|---|---|
| Scaffold Vite + React 19 + TypeScript + React Compiler | React Router y rutas |
| | Páginas de login y panel médico |
| | Cliente API |

### 2.4 Infraestructura y procesos

- **Sin CI/CD**: no hay GitHub Actions ni workflows.
- **Branches**: `main` y `develop` ya existen en el repositorio.
- **Package managers inconsistentes**: `api/` y `frontend/` usan `pnpm`; `mobile/` usa `npm`. Se estandariza así (no se migra el mobile para no arriesgar).
- **`shared/`**: solo contiene el logo; sin código compartido todavía.

## 3. Stack tecnológico objetivo

| Componente | Tecnología |
|---|---|
| App móvil | Expo (SDK 57) + React Native + expo-router + Uniwind/Tailwind |
| Portal web | React 19 + Vite + React Router + TypeScript |
| Backend / API | NestJS 11 + TypeORM |
| Base de datos | PostgreSQL |
| Autenticación | JWT con control de acceso basado en roles (RBAC) |
| Notificaciones | `expo-notifications` (local scheduling en el MVP) |

## 4. Fases de implementación

### Fase 0 — Cimientos (6–7 de agosto)

**API**
- [x] Registrar `UsersModule` en `app.module.ts`.
- [ ] `main.ts`: `ValidationPipe` global (whitelist + transform), CORS habilitado, prefijo global `/api`, helmet.
- [x] Completar `.env.example` (faltan `DB_PORT`, `DB_NAME`, `DB_TYPE`).
- [ ] Crear carpeta de migraciones y mecanismo de ejecución (reemplazar `synchronize: true` en el arranque de producción).

**Mobile**
- [ ] Corregir rutas de `metro.config.js` (o mover `global.css` y `uniwind-types.d.ts` a `src/` según lo que convenga).
- [ ] Activar expo-router: crear `app/` con layout de auth (`app/(auth)`) y layout con tabs para sesión iniciada.
- [ ] Añadir `expo-secure-store` para guardar el token de sesión.

**Frontend**
- [ ] Añadir `react-router-dom` y un layout base con ruta de login.

### Fase 1 — Autenticación y Usuarios → HU-01, HU-02, HU-03 (hasta 9 de agosto) — v0.2.0

**API**
- [ ] Entidad `User` completa: `email`, `passwordHash` (bcrypt), `role` (enum: `patient`, `caregiver`, `health_staff`, `admin`), `firstName`, `lastName`, `phone`, `dateOfBirth`, `isActive`.
- [ ] `AuthModule`: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`.
- [ ] JWT (`@nestjs/jwt`) + guard de autenticación + `RolesGuard` con decorador `@Roles()`.
- [ ] `UsersModule` con CRUD real sobre repositorio.
- [ ] Vínculo cuidador ↔ pacientes (relación N:M).
- [ ] Seed de usuarios: un `admin` y personal de salud de ejemplo.

**Mobile**
- [ ] Cliente API (fetch/axios con base URL configurable) e interceptor de token.
- [ ] Pantalla de login y registro (con selección de rol).
- [ ] Onboarding de vinculación de paciente (cuidador) y perfil.
- [ ] Gestión de sesión (context + `expo-secure-store`).

**Frontend**
- [ ] Página de login y registro conectadas al API.

### Fase 2 — Pacientes y Expediente Clínico → HU-04, HU-05, HU-06 (10–13 de agosto) — v0.3.0

**API**
- [ ] Entidad `Patient` (datos básicos, diagnóstico principal, teléfono, dirección) y relación con personal de salud asignado y cuidadores.
- [ ] Entidad `MedicalRecord` (consultas: diagnóstico, observaciones, fecha).
- [ ] Endpoints CRUD de pacientes y consultas.
- [ ] Historial clínico cronológico por paciente.
- [ ] Control de acceso por rol: el paciente solo puede ver su propia información clínica.

**Mobile**
- [ ] Pantallas para personal de salud: listado de pacientes, ficha del paciente, alta de consulta, historial clínico.
- [ ] Pantalla del paciente: consulta de su propio historial.

### Fase 3 — Monitoreo de Indicadores de Salud → HU-07, HU-08, HU-09 (14–16 de agosto) — v0.3.0

**API**
- [ ] Entidad `HealthIndicator`: `type` (presión arterial, glucosa, peso, temperatura), `value`, `date`.
- [ ] CRUD de indicadores con fecha y hora.
- [ ] Serie temporal por tipo de indicador para gráficas.
- [ ] Endpoint de últimos registros por paciente (para el panel médico y el dashboard móvil).

**Mobile**
- [ ] Pantalla de registro de indicadores (PA, glucosa, peso, temperatura).
- [ ] Historial en lista y gráficas (librería de gráficas, p. ej. `react-native-gifted-charts`).
- [ ] Dashboard resumen: últimos registros, próximos medicamentos y citas.

### Fase 4 — Gestión de Citas Médicas → HU-10, HU-11, HU-12 (17–20 de agosto) — v0.4.0

**API**
- [ ] Entidad `Appointment`: paciente, fecha, hora, motivo, estado (programada, modificada, cancelada).
- [ ] CRUD de citas.
- [ ] Endpoint de próximas citas ordenadas por fecha.
- [ ] Aviso al paciente al modificar/cancelar una cita (hook/evento que dispare la notificación).

**Mobile**
- [ ] Programar, editar y cancelar citas (personal de salud).
- [ ] Consulta de próximas citas (paciente).

### Fase 5 — Recordatorios de Medicamentos y Citas → HU-13, HU-14, HU-15 (21–24 de agosto) — v0.4.0

**API**
- [ ] Entidad `Medication`: nombre, dosis, frecuencia, horarios, paciente.
- [ ] Endpoints CRUD de medicamentos.
- [ ] Endpoint de horarios de medicación por paciente (consumido por la app para agendar notificaciones).

**Mobile**
- [ ] Alta de medicamentos con configuración de horarios, dosis y frecuencia.
- [ ] Notificaciones locales con `expo-notifications`: recordatorios diarios de medicamentos y recordatorio antes de cada cita.
- [ ] Solicitud y gestión de permisos de notificación.

### Fase 6 — Panel Web para Personal de Salud → HU-16, HU-17 (25–28 de agosto) — prioridad media

**API**
- [ ] Endpoint de pacientes asignados con sus indicadores más recientes.
- [ ] Endpoint de consulta del expediente clínico de un paciente.
- [ ] HU-17: asignación de pacientes al personal de salud (solo `admin`).

**Frontend**
- [ ] Rutas protegidas por rol.
- [ ] Dashboard del médico: pacientes asignados, indicadores recientes, historial resumido.
- [ ] Vista de consulta del expediente clínico.
- [ ] Pantalla de asignación de pacientes (admin).

**Nota de alcance:** si el avance se retrasa, esta fase se reduce a las pantallas de **consulta** (lectura) y la asignación vía admin queda como mejora.

### Fase 7 — Seguridad, Pruebas, CI y Entrega (29 de agosto – 1 de septiembre) — v1.0.0

**API**
- [ ] Rate limiting (`@nestjs/throttler`).
- [ ] Migraciones SQL en producción (eliminar `synchronize: true`).
- [ ] Tests unitarios de servicios y e2e de los flujos principales (auth, CRUDs).
- [ ] CI con GitHub Actions: lint + test + build para `api`, `mobile` y `frontend` en cada PR.

**General**
- [ ] Actualizar `README.md` con los endpoints reales y el estado del proyecto.
- [ ] Definición de Terminado completa: revisar cada HU contra sus criterios de aceptación.
- [ ] Build de Android con EAS y verificación en dispositivo/emulador.
- [ ] Corrección de errores finales y documentación.
- [ ] Merge final a `main`, etiqueta `v1.0.0` y preparación del pitch.

## 5. Cronograma replanificado

> Replanificado el 6 de agosto según el estado real del código (el Sprint 1 original se completó; el Sprint 2 original quedó pendiente de funcionalidad).

| Rango | Contenido | Versión |
|---|---|---|
| 6–7 ago | Fase 0: cimientos y deuda técnica | — |
| 8–9 ago | Fase 1: auth y usuarios | v0.2.0 |
| 10–13 ago | Fase 2: pacientes y expediente clínico | v0.3.0 |
| 14–16 ago | Fase 3: indicadores de salud | v0.3.0 |
| 17–20 ago | Fase 4: gestión de citas | v0.4.0 |
| 21–24 ago | Fase 5: recordatorios (medicamentos y citas) | v0.4.0 |
| 25–28 ago | Fase 6: panel web del personal de salud | — |
| 29 ago – 1 sep | Fase 7: seguridad, pruebas, CI, despliegue y presentación | v1.0.0 |

**Correspondencia con el plan original:**

| Documento original | Replanificación |
|---|---|
| Sprint 2 (28 jul – 10 ago): auth + registro de pacientes + expediente | Fases 1 y 2 (8–13 ago) |
| Sprint 3 (11–17 ago): indicadores, panel médico, historial y citas | Fases 3 y 4 (14–20 ago) |
| Sprint 4 (18–24 ago): recordatorios y seguridad | Fase 5 (21–24 ago) |
| Sprint 5 (25 ago – 1 sep): pruebas, integración y entrega | Fases 6 y 7 (25 ago – 1 sep) |

## 6. Estrategia de versionado

Se respeta el esquema del plan SCRUM: **MAJOR.MINOR.PATCH**, ramas `main` (estable), `develop` (integración), `feature/HU-XX` (por historia), `release/vX.Y.0` (pruebas) y `hotfix/` (errores críticos). Commits con **Conventional Commits** (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).

- **v0.2.0** — 9 ago: autenticación, usuarios y roles.
- **v0.3.0** — 16 ago: expediente clínico y monitoreo de indicadores.
- **v0.4.0** — 24 ago: gestión de citas y recordatorios.
- **v1.0.0** — 1 sep: MVP completo, pruebas finales, panel web y versión lista para la presentación.

## 7. Definición de Terminado (Definition of Done)

Una historia de usuario se considera terminada cuando:

1. Cumple con todos los criterios de aceptación establecidos en el backlog.
2. La funcionalidad está completamente integrada con el resto del sistema.
3. Se realizaron pruebas funcionales y no existen errores críticos.
4. El código fue revisado por otro integrante del equipo antes de integrarse a `develop`.
5. La documentación correspondiente está actualizada.
6. La funcionalidad está lista para presentarse durante la demostración final.

## 8. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Calendario ajustado (26 días para 17 HU) | Panel web reducido a consulta; recordatorios con notificación local (sin infraestructura push); priorizar app móvil. |
| Notificaciones push remotas complejas | MVP con `expo-notifications` local; FCM queda documentado como mejora futura. |
| Falta de roles/seguridad mal implementada | RBAC definido desde la Fase 1; cifrado y autenticación desde la primera versión. |
| Bases de datos con `synchronize: true` en producción | Migraciones SQL a partir de la Fase 0 y uso obligatorio antes de v1.0.0. |
| Package managers inconsistentes entre repos | Mantener `pnpm` en api/frontend y `npm` en mobile; documentar en cada README. |
| Conectividad limitada en zonas rurales | Documentar el modo offline como mejora post-MVP (según PRD). |

# Plan de Desarrollo — Salud Móvil (MVP)

**Fecha de elaboración:** 6 de agosto de 2026 (actualizado el 10 de agosto de 2026)
**Entrega objetivo:** v1.0.0 funcional el **1 de septiembre de 2026** · presentación oficial el **2 de septiembre de 2026**

## 1. Objetivo

Entregar el Producto Mínimo Viable (MVP) de **Salud Móvil** cumpliendo las 31 historias de usuario del backlog organizadas en 6 épicas, respetando la estrategia de versionado semántico definida en `Plan_SCRUM_y_estrategia_de_versionado.md`.

Del total de 31 historias (127 Story Points), **23 son Must Have (imprescindibles)**, 6 son Should Have y 2 son Could Have. Las historias Should/Could no bloquean la entrega de v1.0.0 y se recortan si el avance del cronograma se retrasa.

**Prioridades transversales:**

1. **App móvil primero**: las funcionalidades esenciales se desarrollan y prueban en la app móvil (Expo/React Native).
2. **Repartición de audiencias por plataforma (decisión del 10 de agosto)**: el **panel web** es para **admin y personal de salud** (gestión de personal, pacientes, expediente, consultas y vínculos de cuidadores); la **app móvil** es para **cuidadores y pacientes** (registro de cuentas, indicadores, citas y recordatorios). Los flujos de cuidador/paciente no se duplican en web (sin registro web).
3. **Recordatorios con notificación local** en el dispositivo para el MVP (más fiable y sin infraestructura externa). El envío remoto vía Firebase Cloud Messaging (FCM) queda como mejora futura.

## 2. Estado actual del código (diagnóstico)

### 2.1 API — `api/` (NestJS 11 + TypeORM + PostgreSQL)

| Presente | Falta |
|---|---|
| Scaffold NestJS 11 con TypeORM y PostgreSQL conectado | Migraciones (usa `synchronize: true` en dev; pendientes las SQL para producción, Fase 7) |
| Config de entorno tipada (`src/config/configuration.ts`) y `.env.example` completo (`DB_PORT`, `DB_NAME`, `DB_TYPE`, JWT) | Helmet y rate limiting (Fase 7) |
| Autenticación JWT/RBAC con guards globales (`JwtAuthGuard` + `RolesGuard`) y decoradores `@Roles()` / `@Public()` | |
| `AuthModule`: `POST /auth/register` (cuidador), `POST /auth/login`, `GET /auth/me`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password` | |
| CRUD de usuarios para el administrador (HU-01): `POST/GET/PATCH/DELETE /users` con creación de personal de salud en transacción (user + `healthcare_worker`) | |
| `UsersModule` registrado en `app.module.ts` | |
| Entidades de dominio creadas: `user`, `patient`, `caregiver`, `healthcare_worker`, `patient_caregiver`, `health_center`, `medical_record`, `medical_visit`, `health_indicator`, `medication`, `medication_schedule`, `medication_schedule_day`, `medication_reminder`, `appointment`, `appointment_reminder`, `password_reset` y los 12 catálogos | |
| Soft delete (`@DeleteDateColumn`) y borrados en cascada a nivel de BD | |
| `ValidationPipe` global con `whitelist + transform + forbidNonWhitelisted` y CORS habilitado (sin prefijo `/api`, decisión del equipo) | |

**Deuda técnica pendiente:**
- Helmet y rate limiting (`@nestjs/throttler`) se añaden en la Fase 7 de seguridad.
- Migraciones SQL: `synchronize: true` sigue activo y debe reemplazarse antes de v1.0.0.

### 2.2 Mobile — `mobile/` (Expo SDK 57 + React Native + Uniwind/Tailwind)

| Presente | Falta |
|---|---|
| Expo SDK 57, TypeScript, Uniwind + Tailwind v4 con tokens de diseño | Router activo (`expo-router` instalado pero sin carpeta `app/`) |
| Reanimated, gesture-handler, safe-area, expo-router instalado | Pantallas de auth y de funciones (cuidador y paciente; admin y personal usan el panel web) |
| `lib/theme.ts` con colores, fuentes y tipografías | Cliente API y gestión de sesión |
| | Almacenamiento seguro de tokens (`expo-secure-store`) |
| | Notificaciones (`expo-notifications`) |

**Deuda técnica a corregir en Fase 0:**
- `metro.config.js` referencia `./src/global.css` y `./src/uniwind-types.d.ts`, pero esos archivos están en la raíz del proyecto (no existe carpeta `src/`).

### 2.3 Frontend — `frontend/` (React 19 + Vite 8 + TypeScript + Tailwind v4)

| Presente | Falta |
|---|---|
| Scaffold Vite + React 19 + TypeScript + React Compiler + Tailwind v4 | — |
| React Router con rutas protegidas por rol (admin y personal de salud) | — |
| Estado con **Zustand** (`persist` en localStorage): store de auth y store de catálogos | — |
| Cliente API (`lib/api.ts`) con inyección de token JWT y `ApiError` | — |
| Login (sin registro web), dashboard por rol, layout con sidebar y logout | — |
| Panel admin: gestión de personal de salud (crear, editar, desactivar) | — |
| Pacientes: listado con búsqueda, crear/editar y detalle con pestañas (datos, expediente, consultas, cuidadores) | — |

### 2.4 Infraestructura y procesos

- **Sin CI/CD**: no hay GitHub Actions ni workflows.
- **Branches**: `main` y `develop` ya existen en el repositorio.
- **Package managers**: `api/` y `frontend/` usan `pnpm`; `mobile/` usa `npm`. Se mantiene así (no se migra el mobile para no arriesgar).
- **`shared/`**: solo contiene el logo; sin código compartido todavía.

## 3. Stack tecnológico objetivo

| Componente | Tecnología |
|---|---|
| App móvil | Expo (SDK 57) + React Native + expo-router + Uniwind/Tailwind — **cuidadores y pacientes** |
| Portal web | React 19 + Vite + React Router + TypeScript + Tailwind v4 + **Zustand** — **admin y personal de salud** |
| Backend / API | NestJS 11 + TypeORM |
| Base de datos | PostgreSQL |
| Autenticación | JWT con control de acceso basado en roles (RBAC) |
| Notificaciones | `expo-notifications` (local scheduling en el MVP) |

## 4. Fases de implementación

### Fase 0 — Cimientos (6–7 de agosto)

**API**
- [x] Registrar `UsersModule` en `app.module.ts`.
- [x] `main.ts`: `ValidationPipe` global con `whitelist + transform + forbidNonWhitelisted` y CORS habilitado (sin prefijo `/api`, decisión del equipo; helmet en Fase 7).
- [x] Completar `.env.example` (faltaban `DB_PORT`, `DB_NAME`, `DB_TYPE`).
- [ ] Crear carpeta de migraciones y mecanismo de ejecución (reemplazar `synchronize: true` en el arranque de producción).
- [x] Completar el CRUD real de `users` (repositorio + DTOs con validación + transacción).

**Mobile**
- [ ] Corregir rutas de `metro.config.js` (o mover `global.css` y `uniwind-types.d.ts` a `src/` según lo que convenga).
- [ ] Activar expo-router: crear `app/` con layout de auth (`app/(auth)`) y layout con tabs para sesión iniciada.
- [ ] Añadir `expo-secure-store` para guardar el token de sesión.

**Frontend**
- [ ] Añadir `react-router-dom` y un layout base con ruta de login.

### Fase 1 — Autenticación y Usuarios → HU-01, HU-02, HU-03, HU-04, HU-08 (8–9 de agosto) — v0.2.0

**API**
- [x] `AuthModule`: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`.
- [x] JWT (`@nestjs/jwt`) + `JwtAuthGuard` global + `RolesGuard` con decorador `@Roles()` y `@Public()` para rutas públicas.
- [x] Creación de cuentas de personal de salud por el administrador (HU-01): `POST /users` crea user + `healthcare_worker` (licencia, especialidad, centro de salud) en transacción; listado, detalle, actualización y baja (soft delete) solo `admin`.
- [x] Registro de cuenta de cuidador (HU-02) e inicio de sesión (HU-03). *(La creación de la cuenta del paciente por el personal de salud es HU-06 → Fase 2).*
- [x] Restablecimiento de contraseña (HU-04): `POST /auth/forgot-password`, `POST /auth/reset-password` y `POST /auth/change-password` (token con hash SHA-256, expiración configurable; en dev se devuelve en la respuesta).
- [x] Perfil de usuario (HU-08): `GET /auth/me`; el cierre de sesión se maneja descartando el token en el cliente.
- [x] Seed de usuarios y catálogos: `admin` y personal de salud de ejemplo, roles, géneros, especialidades, tipos de centro, 17 departamentos (15 + 2 regiones autónomas) y 150 municipios.

**Mobile**
- [ ] Cliente API (fetch/axios con base URL configurable) e interceptor de token.
- [ ] Pantallas de login, registro de cuidador y perfil.
- [ ] Gestión de sesión (context + `expo-secure-store`).

**Frontend**
- [x] Página de login conectada al API (el registro de cuentas web se elimina; cuidadores y pacientes se registran desde la app móvil).

### Fase 2 — Pacientes y Expediente Clínico → HU-05, HU-06, HU-07, HU-09, HU-10, HU-11, HU-12 (10–13 de agosto) — v0.3.0

**API**
- [x] Entidad `Patient` (datos básicos, fecha de nacimiento, género, centro de salud) y relación con cuidadores.
- [x] Vínculo cuidador ↔ pacientes (relación N:M con parentesco) (HU-05): `GET /patients/linked` (cuidador), `GET/POST /patients/:id/caregivers` y `DELETE /patients/:id/caregivers/:caregiverId` (personal/admin). El vínculo se registra con `relationshipTypeId` (catálogo) y `isPrimary` (un solo principal por paciente).
- [x] CRUD de pacientes con búsqueda (HU-06, HU-07): `POST /patients` (registro en transacción: user + patient + expediente vacío; el personal asigna siempre su centro, el admin lo indica explícitamente), `GET /patients?q=` (ILIKE por nombre/correo/usuario/DNI, con alcance por centro para el personal), `GET/PATCH/DELETE /patients/:id` (baja solo admin) y `GET /patients/me` (paciente).
- [x] Entidad `MedicalRecord` (expediente maestro: diagnóstico principal, historial, alergias, grupo sanguíneo) (HU-09): `PUT/GET /patients/:id/medical-record` (upsert único por paciente).
- [x] Entidad `MedicalVisit` (consultas: diagnóstico, observaciones, tratamiento, fecha) (HU-10): `POST /patients/:id/medical-visits`.
- [x] Endpoints CRUD de pacientes y consultas; historial clínico cronológico por paciente (HU-11): `GET /patients/:id/medical-record` devuelve las consultas ordenadas por fecha.
- [x] Control de acceso por rol: el paciente solo puede ver su propia información clínica (HU-12): `GET /patients/me/history`; además, el personal solo accede a pacientes/expedientes de su propio centro.
- [x] `GET /catalogues/genres`, `/relationship-types`, `/majors`, `/health-centers`, `/departments` y `/municipalities?departmentId=` (con `departmentId` en cada municipio para resolver cascadas al editar). Seed idempotente por tabla (incluye `cat_relationship_type`).
- [x] `GET /caregivers?q=` (búsqueda de cuidadores para vincular, admin y personal de salud) y `GET /auth/me` ampliado con los datos del `healthcareWorker` (centro y especialidad) para el encabezado del panel.

**Mobile**
- [ ] Pantallas para personal de salud: listado de pacientes, ficha del paciente, alta de consulta, historial clínico.
- [ ] Pantalla del paciente: consulta de su propio historial.

### Fase 3 — Monitoreo de Indicadores de Salud → HU-13, HU-14, HU-15, HU-16, HU-17 (14–16 de agosto) — v0.3.0

**API**
- [ ] Entidad `HealthIndicator`: tipo (presión arterial, glucosa, peso, temperatura), valor, valor secundario (diastólica) y fecha y hora.
- [ ] CRUD de indicadores con fecha y hora (HU-13).
- [ ] Serie temporal por tipo de indicador para lista y gráficas (HU-14, HU-15).
- [ ] Endpoint de últimos registros por paciente (para el panel médico y el dashboard móvil) (HU-16).
- [ ] Edición/eliminación de registros propios con trazabilidad (HU-17).

**Mobile**
- [ ] Pantalla de registro de indicadores (PA, glucosa, peso, temperatura).
- [ ] Historial en lista y gráficas (librería de gráficas, p. ej. `react-native-gifted-charts`).
- [ ] Dashboard resumen: últimos registros, próximos medicamentos y citas.

### Fase 4 — Gestión de Citas Médicas → HU-18, HU-19, HU-20, HU-21, HU-22 (17–20 de agosto) — v0.4.0

**API**
- [ ] Entidad `Appointment`: paciente, fecha, hora, motivo, tipo y estado.
- [ ] CRUD de citas (HU-18, HU-19).
- [ ] Cancelación de citas con motivo y aviso al paciente (HU-20).
- [ ] Endpoint de próximas citas ordenadas por fecha (HU-21).
- [ ] Cambio de estado de la cita (completada / no asistió) (HU-22).

**Mobile**
- [ ] Programar, editar y cancelar citas (personal de salud).
- [ ] Consulta de próximas citas (paciente).

### Fase 5 — Recordatorios de Medicamentos y Citas → HU-23, HU-24, HU-25, HU-26, HU-27 (21–24 de agosto) — v0.4.0

**API**
- [ ] Entidad `Medication` (nombre, dosis, vía, fechas) y `MedicationSchedule`/`MedicationScheduleDay` (horarios y días de toma) (HU-23, HU-24).
- [ ] Endpoints CRUD de medicamentos y horarios.
- [ ] Registro de recordatorios (`MedicationReminder`) y confirmación de toma (HU-26).
- [ ] Endpoint de horarios de medicación por paciente (consumido por la app para agendar notificaciones).

**Mobile**
- [ ] Alta de medicamentos con configuración de horarios, dosis y frecuencia.
- [ ] Notificaciones locales con `expo-notifications`: recordatorios diarios de medicamentos y recordatorio antes de cada cita (HU-25, HU-27).
- [ ] Solicitud y gestión de permisos de notificación.
- [ ] Confirmación de toma de medicamentos.

### Fase 6 — Panel Web para Admin y Personal de Salud → HU-28, HU-29 (25–28 de agosto) — v0.5.0

**Alcance (adelantado al 10 de agosto):** el panel web para **admin y personal de salud** ya se construyó junto con la Fase 2 (gestión de personal, pacientes, expediente, consultas y vínculos de cuidadores). Pendiente para esta fase: el resumen de indicadores recientes (HU-31).

**API**
- [x] Endpoint de asignación del centro de salud a un paciente (solo `admin`) (HU-28). *(Cubierto por el campo `healthCenterId` en `POST /patients` y el alcance por centro del personal.)*
- [x] Endpoint de pacientes del centro de salud con su información principal (HU-29). *(Cubierto por `GET /patients` con alcance por centro.)*

**Frontend**
- [x] Rutas protegidas por rol (`RequireAuth` + `RequireRole`).
- [x] Pantalla de gestión de cuentas de personal de salud (admin): listado, crear, editar y desactivar.
- [x] Pantalla de asignación del centro de salud a los pacientes (admin) dentro de la creación de paciente.
- [x] Listado de pacientes del centro de salud para el personal de salud con búsqueda.

**Nota de alcance:** el resumen de indicadores recientes (HU-31) queda pendiente para esta fase; el expediente clínico (HU-30) ya está cubierto en el detalle de paciente del panel.

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
- [ ] Merge final a `main`, etiqueta `v1.0.0` y preparación del pitch para la presentación del **2 de septiembre**.

## 5. Cronograma replanificado

> Replanificado el 6 de agosto según el estado real del código (el Sprint 1 original se completó; el Sprint 2 original quedó pendiente de funcionalidad).

| Rango | Contenido | Versión |
|---|---|---|
| 6–7 ago | Fase 0: cimientos y deuda técnica | — |
| 8–9 ago | Fase 1: auth y usuarios (HU-01 a HU-04 y HU-08) | v0.2.0 |
| 10–13 ago | Fase 2: pacientes y expediente clínico (HU-05 a HU-07 y HU-09 a HU-12) | v0.3.0 |
| 14–16 ago | Fase 3: indicadores de salud (HU-13 a HU-17) | v0.3.0 |
| 17–20 ago | Fase 4: gestión de citas (HU-18 a HU-22) | v0.4.0 |
| 21–24 ago | Fase 5: recordatorios y medicación (HU-23 a HU-27) | v0.4.0 |
| 25–28 ago | Fase 6: panel web del personal de salud (HU-28 y HU-29) | v0.5.0 |
| 29 ago – 1 sep | Fase 7: seguridad, pruebas, CI, despliegue y presentación | v1.0.0 |
| 2 sep | Presentación oficial del proyecto | — |

> **Estado al 10 de agosto:** completada la **API de la Fase 1** (autenticación JWT/RBAC, reset de contraseña y CRUD de usuarios admin), la **API de la Fase 2** (pacientes, expediente clínico y vínculos cuidador–paciente, HU-05/06/07/09–12) y el **panel web para admin y personal de salud** (login, gestión de personal, pacientes con expediente/consultas/cuidadores; estado con Zustand y rutas por rol; el registro de cuentas web se eliminó, cuidador y paciente se registran desde mobile). Pendientes: mobile (cliente API, pantallas de login/registro/perfil/gestión de sesión para cuidador y paciente; pantallas de personal y paciente de la Fase 2) y el dashboard de indicadores web (HU-31).

**Correspondencia con el plan original:**

| Documento original | Replanificación |
|---|---|
| Sprint 2 (28 jul – 10 ago): auth, usuarios, registro de pacientes y expediente | Fases 1 y 2 (8–13 ago): HU-01 a HU-12 |
| Sprint 3 (11–17 ago): indicadores, historial y citas | Fases 3 y 4 (14–20 ago): HU-13 a HU-22 |
| Sprint 4 (18–24 ago): recordatorios y medicación | Fase 5 (21–24 ago): HU-23 a HU-27 |
| Sprint 5 (25 ago – 1 sep): panel web, pruebas e integración | Fases 6 y 7 (25 ago – 1 sep): HU-28 a HU-31 |

## 6. Estrategia de versionado

Se respeta el esquema del plan SCRUM: **MAJOR.MINOR.PATCH**, ramas `main` (estable), `develop` (integración), `feature/HU-XX` (por historia), `release/vX.Y.0` (pruebas) y `hotfix/` (errores críticos). Commits con **Conventional Commits** (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).

- **v0.2.0** — 9 ago: autenticación y gestión de usuarios.
- **v0.3.0** — 16 ago: pacientes, expediente clínico y monitoreo de indicadores.
- **v0.4.0** — 24 ago: gestión de citas, recordatorios y medicación.
- **v0.5.0** — 28 ago: panel web de admin y personal de salud (adelantado; pendiente el dashboard de indicadores HU-31).
- **v1.0.0** — 1 sep: MVP completo, pruebas finales y versión lista para la presentación (2 sep).

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
| Calendario ajustado (26 días para 29 historias del MVP) | Panel web limitado a funciones básicas (registro y asignación); las historias Should/Could quedan fuera si hay retraso; recordatorios con notificación local (sin infraestructura push); priorizar app móvil. |
| Notificaciones push remotas complejas | MVP con `expo-notifications` local; FCM queda documentado como mejora futura. |
| Falta de roles/seguridad mal implementada | RBAC definido desde la Fase 1; cifrado y autenticación desde la primera versión. |
| Bases de datos con `synchronize: true` en producción | Migraciones SQL a partir de la Fase 0 y uso obligatorio antes de v1.0.0. |
| Package managers inconsistentes entre repos | Mantener `pnpm` en api/frontend y `npm` en mobile; documentar en cada README. |
| Conectividad limitada en zonas rurales | Documentar el modo offline como mejora post-MVP (según PRD). |

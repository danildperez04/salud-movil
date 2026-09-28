# Plan de Cierre del MVP — Salud Móvil

**Fecha de elaboración:** 27 de septiembre de 2026
**Estado:** vigente — suple el cronograma de `docs/Plan_de_Desarrollo.md` (§5) a partir de esta fecha
**Alcance acordado:** MVP completo (23 historias Must Have), sin fecha fija de entrega
**Convención de versionado:** `main` / `develop` / `feature/*` — ver `docs/Plan_SCRUM_y_estrategia_de_versionado.md`

> **Nota de ubicación:** este plan vive en `.opencode/plans/`. Cuando se integre, debe copiarse a `docs/Plan_Cierre_MVP.md` y enlazarse desde el `README.md` (sección de documentación, línea ~235).

---

## 1. Por qué existe este documento

`docs/Plan_de_Desarrollo.md` fijó la entrega de v1.0.0 el 1 de septiembre de 2026 y la presentación el 2 de septiembre. **Ambas fechas vencieron.**

Este documento no reemplaza a los anteriores: conserva el diagnóstico, el backlog (`docs/Backlog_del_Proyecto_SALUD_MOVIL.md`) y el modelo de datos (`docs/Esquema_de_Base_de_Datos.md`), y añade el **gap real** entre lo planificado y lo implementado, con el orden de ejecución corregido según las dependencias técnicas reales.

### Decisiones tomadas el 27 de septiembre de 2026

| Decisión | Valor |
|---|---|
| Alcance | MVP completo (23 Must Have) |
| Fecha objetivo | Sin fecha fija; se prioriza por valor |
| IPCP | Implementarlo de verdad (regla explicable, **no** IA) |
| Rangos clínicos | Nuevo catálogo en base de datos |
| Pruebas | Por etapas, junto al código |

---

## 2. Diagnóstico: qué está realmente implementado

### 2.1 Línea de base verificada (27-sep-2026)

| Proyecto | Comando | Resultado |
|---|---|---|
| API | `pnpm build` | ✅ compila |
| Frontend | `npm run build` | ⚠️ **fallaba** — `node_modules` desfasado tras el PR #56 (faltaban `lucide-react` y `react-icons`). Resuelto con `pnpm install`; ahora compila ✅ |
| Mobile | `npx tsc --noEmit` | ⚠️ no verificable — **no existe script `typecheck`** ni binario local de `tsc` |

**Nota de dependencias:** `frontend/` tiene **dos lockfiles** (`pnpm-lock.yaml` y `package-lock.json`). Gana pnpm; el segundo es una trampa para quien use `npm install` y provoque un build roto.

### 2.2 Estado por aplicación

**API — funcional en auth, usuarios, pacientes, expediente y catálogos (6 de 12 catálogos)**

Los módulos `appointments`, `health-indicators` y `medications` existen **solo como entidades**: sin controller, service, module ni DTO. Sus tablas se crean en la base de datos por `synchronize: true`, pero son inalcanzables por HTTP.

**Frontend (panel) — CRUD completo, pero con mocks clínicos**

`Home.tsx` es 100% mock (contadores, 4 pacientes ficticios, "actualizado hace 2 min" fijo). `RecoverPassword.tsx` no llama a la API, que sí existe. Los indicadores de salud e IPCP se generan con un hash del UUID del paciente. Hay 5 rutas `ComingSoon`, y 6 de las 9 entradas del sidebar apuntan a stubs.

**Mobile — estructura sólida, casi todo en mocks**

Solo el login es real (`POST /auth/login`, verificado extremo a extremo). Citas, medicamentos e indicadores son mocks. Tres enlaces navegan a rutas inexistentes y caen en 404.

### 2.3 El bloqueo de arranque

**5 de los 12 catálogos no están sembrados** y no tienen endpoint:

| Catálogo | Lo consume | Endpoint |
|---|---|---|
| `cat_type_indicator` | `health_indicator` | ❌ |
| `cat_appointment_state` | `appointment` | ❌ |
| `cat_appointment_type` | `appointment` | ❌ |
| `cat_notification_state` | `medication_reminder`, `appointment_reminder` | ❌ |
| `cat_route_administration` | `medication` | ❌ |

Todas esas FK son `RESTRICT`. **Sin filas sembradas, los tres módulos nuevos no pueden crear ni un solo registro.** Eso es la Fase 0.

### 2.4 El IPCP no está definido en ninguna parte

Los documentos lo nombran 6 veces y **siempre como funcionalidad futura, valor agregado o "mediante inteligencia artificial"**, explícitamente fuera del MVP. No hay fórmula, pesos ni umbrales.

El código actual (`frontend/src/lib/ipcp.ts`) es un hash djb2 del UUID: **no lee ningún dato clínico**.

La única especificación existente es el mockup `frontend/public/assets/mockups/ipcp-1.webp`: un cuestionario de 10 preguntas en escala 1-5 sobre intensidad, evolución, respiración, dolor, fiebre, hidratación y condiciones previas.

Hay **tres modelos incompatibles** circulando:

| Modelo | Origen | Descripción |
|---|---|---|
| Score 0-99, cortes 70/40 | `frontend/src/lib/ipcp.ts` | Placeholder: hash del UUID |
| Score 0-100, cortes 70/40 | `frontend/src/lib/priority.ts` | Clasifica los scores del anterior |
| Semáforo verde/amarillo/rojo con IA | `docs/Definicion_de_la_solucion.md`, `docs/Plan_SCRUM_...md` | Prometido, nunca diseñado |

Además, `ipcp.ts` usa cortes 1-39/40-69/70-**99** con vocabulario `Alta|Moderada|Baja`, mientras `priority.ts` usa 0-39/40-69/70-**100** con `high|moderate|low`.

**Decisión tomada:** regla explicable y determinista desde el cuestionario, semáforo de tres niveles, **no IA**. Los pesos y cortes deben validarlos el equipo médico.

---

## 3. Trazabilidad de historias de usuario

Estado al 27-sep-2026. ✅ implementado · ⚠️ parcial · ❌ pendiente

| HU | Prioridad | Historia | Estado | Dónde se cierra |
|---|---|---|---|---|
| HU-01 | Must | Admin crea cuentas de personal de salud | ✅ | — |
| HU-02 | Must | Cuidador se registra | ⚠️ | API existe; el panel crea la cuenta por admin (decisión del 10-ago) |
| HU-03 | Must | Inicio de sesión con JWT y RBAC | ✅ | — |
| HU-04 | Should | Restablecer contraseña | ⚠️ | API completa; falta UI (4.2) |
| HU-05 | Must | Cuidador se vincula a pacientes | ⚠️ | API completa; falta UI en el panel (4.5) |
| HU-06 | Must | Personal registra paciente | ✅ | — |
| HU-07 | Must | Personal busca y edita paciente | ✅ | — |
| HU-08 | Should | Perfil y cierre de sesión | ⚠️ | `GET /auth/me` existe; falta UI |
| HU-09 | Must | Expediente clínico (upsert) | ✅ | — |
| HU-10 | Must | Personal registra consulta | ⚠️ | API existe; falta UI (4.4) |
| HU-11 | Must | Historial clínico cronológico | ⚠️ | La API devuelve `visits`; el panel no las renderiza (4.4) |
| HU-12 | Must | Paciente consulta su historial | ⚠️ | API `/patients/me/history`; falta pantalla en móvil (3.3) |
| HU-13 | Must | Registrar indicadores con fecha y hora | ❌ | 1.A + 3.2 |
| HU-14 | Must | Historial de indicadores en lista | ❌ | 1.A + 3.2 |
| HU-15 | Should | Evolución mediante gráficas | ❌ | 3.4 (falta librería) |
| HU-16 | Must | Personal ve indicadores recientes | ❌ | 1.A (`/summary`) + 4.1 |
| HU-17 | Should | Corregir un registro propio | ❌ | 1.A (`PATCH`/`DELETE`) |
| HU-18 | Must | Personal programa citas | ❌ | 1.B |
| HU-19 | Must | Personal modifica una cita | ❌ | 1.B |
| HU-20 | Must | Personal cancela cita con motivo | ❌ | 1.B + 3.4 |
| HU-21 | Must | Paciente ve próximas citas | ❌ | 1.B (`/upcoming`) + 3.2 |
| HU-22 | Should | Marcar completada / inasistencia | ❌ | 1.B (`/state`) |
| HU-23 | Must | Paciente registra medicamento | ❌ | 1.C |
| HU-24 | Must | Configurar horarios y días de toma | ❌ | 1.C |
| HU-25 | Must | Notificación local en hora de toma | ❌ | 3.4 (falta `expo-notifications`) |
| HU-26 | Should | Confirmación de toma | ❌ | 1.C |
| HU-27 | Must | Notificación local antes de la cita | ❌ | 3.4 |
| HU-28 | Must | Admin asigna centro de salud | ⚠️ | Asignación en alta ✅; **reasignación no permitida** por el backend |
| HU-29 | Must | Personal ve pacientes de su centro | ⚠️ | Listado con alcance por centro ✅; falta "última consulta" |
| HU-30 | Could | Expediente desde el panel | ✅ | — |
| HU-31 | Could | Resumen de indicadores en el panel | ❌ | 1.A + 4.1 |

**Resumen:** 9 completas · 9 parciales · 13 pendientes. De las 13 pendientes, **8 dependen de la Fase 1**.

---

## 4. Fases de ejecución

Las fases son secuenciales por dependencia técnica real, no por conveniencia. La Fase 0 bloquea a la 1; la Fase 1 desbloquea 8 historias.

### Fase 0 — Saneamiento

Sin esta fase, la Fase 1 no puede crear registros y el build falla en un clon limpio.

| # | Tarea | Archivo |
|---|---|---|
| 0.1 | Sembrar los 5 catálogos faltantes | `api/src/database/seed-data.ts`, `seed.service.ts` |
| 0.2 | Exponer los 5 endpoints `GET /catalogues/*` faltantes | `api/src/features/catalogues/` |
| 0.3 | Documentar que pnpm es el gestor canónico de `frontend/` y que hay un lockfile obsoleto | `README.md` |
| 0.4 | Añadir `"typecheck": "tsc --noEmit"` a `mobile/package.json` y al `lint-staged` | `mobile/package.json` |
| 0.5 | Corregir `GET /` (responde 401 por guard global) o eliminar `app.controller.ts` y su e2e | `api/src/app.controller.ts` |
| 0.6 | Documentar que **Expo Go no funciona**: MMKV 4 + Nitro son módulos nativos. El flujo real es `expo run:android` o EAS dev build | `mobile/despliegue.md` |

**Criterio de salida:** `pnpm install && pnpm build` funciona en `api/` y `frontend/` desde un clon limpio; los 5 catálogos devuelven filas vía HTTP.

---

### Fase 1 — API: los tres módulos faltantes

Desbloquea 8 historias Must Have.

**Plantilla a replicar:** `api/src/features/medical-records/` — el módulo más reciente y mejor estructurado del proyecto.

Convenciones que ya usa el proyecto y hay que respetar:
- `@Controller` montado sobre el recurso padre (ej. `@Controller('patients')`), no con prefijo propio
- `@Roles(...)` **siempre a nivel de método**, nunca a nivel de clase
- Controllers como delegadores puros: sin lógica, sin try/catch
- `ValidationPipe` global con `whitelist + forbidNonWhitelisted`: los DTOs deben listar los campos **exhaustivamente** o llega 400
- Fuera de alcance se responde **404**, nunca 403 (no revelar existencia del recurso)
- Nunca devolver la entidad cruda: mappers a interfaces `Public*` exportadas desde el service
- Scoping por centro: reutilizar `patientsService.findRecordForScope()` inyectando `PatientsModule` (no duplicar la lógica)

#### 1.A — Health indicators (HU-13, 14, 16, 17)

El más simple de los tres. Empezar aquí.

- Endpoints: `POST/GET/PATCH/DELETE /patients/:id/health-indicators`, `GET /latest`, `GET /summary` (HU-16)
- ⚠️ `value` es `decimal(8,2)`: **TypeORM lo devuelve como `string`**. Convertir con `Number()` en el mapper
- ⚠️ Regla del ERD §5.9: si el tipo es presión arterial, `valueSecondary` es **obligatorio**
- `registered_by` es NOT NULL: llenarlo siempre, incluso para admin
- Añadir `@Index(['patientId','typeIndicatorId','dateHour'])` — el ERD §7 lo pide y no existe

#### 1.B — Appointments (HU-18 a HU-22)

- CRUD + `POST /:id/cancel` con `cancel_reason` y `cancelled_at` (HU-20)
- `GET /upcoming` ascendente (HU-21) + `PATCH /:id/state` (HU-22)
- Índices `(patient_id, date_hour)` y `(healthcare_worker_id, date_hour)` según ERD §7

#### 1.C — Medications (HU-23, 24, 26)

**Requiere transacción:** un solo `POST` crea medicamento + N horarios + M días.

- ⚠️ `medication_schedule_day` tiene **PK compuesta** `(schedule_id, week_day)` **más `deleted_at`**. Reinsertar el mismo par viola unicidad. Aplicar el patrón de revivir que ya existe en `patients.service.ts:366-389` (buscar con `withDeleted: true`, revivir con `deletedAt: null`)
- ⚠️ La columna se llama `medicine_id`, no `medication_id`. **No "corregirla"**: coincide con el ERD
- Validar `endDate >= startDate`
- La propiedad TS es `prescribedByUser` (no `prescribedBy`)

#### 1.D — Catálogo de rangos clínicos *(nuevo)*

Decisión tomada: los rangos viven en la base de datos.

- Tabla de rangos por tipo de indicador (mínimo, máximo, óptimo) con la unidad del catálogo
- Alimenta la clasificación `normal` / `alto` / `bajo` y al IPCP
- **Actualizar `docs/Esquema_de_Base_de_Datos.md` §9** (cambios aplicados respecto al DDL original)
- Los valores iniciales son estándar, pero **deben validarlos el equipo médico**

#### 1.E — Pruebas (junto al código)

Por módulo: auth y RBAC, scoping por centro de salud, y las reglas de negocio críticas — PA exige valor secundario, revivir días de horario, `endDate >= startDate`.

**Criterio de salida:** los tres módulos exponen endpoints funcionales, `pnpm test` en verde, y se puede crear un paciente → registrar indicador → agendar cita → recetar medicamento.

---

### Fase 2 — IPCP real

Reemplaza el hash del UUID por un cálculo explicable.

| # | Tarea |
|---|---|
| 2.1 | Tabla de respuestas del cuestionario (10 preguntas, escala 1-5) según el mockup `ipcp-1.webp` |
| 2.2 | Cálculo en backend: puntaje → semáforo (bajo / moderado / alto). **Constantes documentadas y testeadas** para que el equipo médico las ajuste sin reescribir lógica |
| 2.3 | Consumir el catálogo de rangos (1.D) |
| 2.4 | Borrar `frontend/src/lib/ipcp.ts` y `frontend/src/lib/priority.ts` — están duplicados y se contradicen. Un solo vocabulario |
| 2.5 | Implementar `/app/priority` y `/app/priority-map` (hoy `ComingSoon`) |
| 2.6 | Alinear el copy de la landing y del README: **es una regla, no IA** |
| 2.7 | Decidir qué se hace con el copy del login del panel, que hoy promete "priorizando la atención mediante el IPCP" |

⚠️ **Riesgo clínico:** pesos y cortes los define el equipo médico. Si se inventan, el índice orienta mal a un paciente real. Marcar los valores como pendientes de validación en el código y en este documento.

**Criterio de salida:** el IPCP se calcula desde datos reales, es reproducible para una misma entrada, y hay prueba unitaria de cada umbral.

---

### Fase 3 — Mobile: de mocks a API real

| # | Tarea | Nota |
|---|---|---|
| 3.1 | **Arreglar el conflicto de ruta `appointments`** | `app/(app)/(tabs)/appointments.tsx` ocupa el nombre. Crear `appointments/{index,new}.tsx` o el wizard no se puede construir |
| 3.2 | Cablear los 3 mocks a `apiClient` y extraer `useQuery`/`useMutation` a `features/*/hooks/` | Hoy los hooks están inline dentro de los screens |
| 3.3 | Crear las 3 rutas rotas: `/(app)/appointments/new`, `/(app)/medical-record` (cierra HU-12), `/(app)/reminders` | Los componentes `Stepper` y `ReminderCard` ya existen y están huérfanos |
| 3.4 | Instalar `expo-notifications` (HU-25, 27) y una librería de gráficas (HU-15) | No instaladas. Los recordatorios son el diferencial del MVP |
| 3.5 | Quitar los datos falsos de `HomeScreen`: `value={75}` y el `HealthIndicatorCard` de Glucosa | Hoy la app muestra valores inventados |
| 3.6 | Corregir el 401: `logout('expired')` y `queryClient.clear()` en el logout | Hoy el logout es mudo y hay fuga de caché entre usuarios |
| 3.7 | Conectar los 3 `Pressable` muertos (campana, "olvidé mi contraseña") y reemplazar los tres "historial próximamente" por un `EmptyState` | |
| 3.8 | Corregir `dose: '850mg'` de Metoprolol | La dosis real es 25/50/100 mg. Ante un jurado queda mal |
| 3.9 | Conectar los catálogos de la Fase 0.2 | Hoy `INDICATOR_TYPES` está hardcodeado y se desincroniza de la BD en silencio |

**Criterio de salida:** los cuatro tabs consumen la API real, ningún flujo cae en 404, y `tsc --noEmit` pasa limpio.

---

### Fase 4 — Panel: eliminar los mocks engañosos

| # | Tarea |
|---|---|
| 4.1 | `Home.tsx` es 100% mock. Sustituir por datos reales (cierra HU-16 y HU-31) |
| 4.2 | Conectar `RecoverPassword.tsx` — el endpoint `POST /auth/forgot-password` ya existe y funciona |
| 4.3 | Borrar `lib/healthIndicators.ts`: genera valores desde un hash e introduce SatO₂, que **no existe** en `cat_type_indicator` |
| 4.4 | Renderizar `visits` en `PatientRecord` y construir la UI de alta de consulta — `api.createMedicalVisit` es código muerto |
| 4.5 | UI para vincular y desvincular cuidadores — `linkCaregiver` / `unlinkCaregiver` existen, sin interfaz |
| 4.6 | Resolver las 5 rutas `ComingSoon` o retirarlas del sidebar (6 de 9 entradas son stubs) |
| 4.7 | Logout automático ante 401 en `lib/api.ts` (el cliente móvil ya lo hace) |
| 4.8 | Limpieza: `ageOf` duplicada, doble fetch en cuidadores, `GET /users` descarga todos los roles para filtrar en cliente, código muerto (`date.ts`, `PatientDetailTab`, `relationshipTypes`) |
| 4.9 | `GET /patients` debe incluir la última consulta (criterio de aceptación de HU-29) |

**Criterio de salida:** ninguna pantalla muestra datos clínicos inventados, y ningún paciente ficticio aparece en el panel.

---

### Fase 5 — Cierre: seguridad, pruebas, CI y entrega

| # | Tarea |
|---|---|
| 5.1 | Migraciones SQL y **`synchronize: false`** en producción |
| 5.2 | `@nestjs/throttler` (rate limiting) y Helmet |
| 5.3 | GitHub Actions: lint + typecheck + test + build de los 3 proyectos. **Hoy `.github/` no existe** |
| 5.4 | `forgot-password`: dejar de devolver el token en la respuesta y responder siempre 200 (hoy permite enumerar cuentas) |
| 5.5 | Rotar las contraseñas de seed — hoy se escriben en los logs en texto plano |
| 5.6 | Desactivar `logging: true` en producción (imprime SQL con datos sensibles) |
| 5.7 | Build EAS de Android y verificación en dispositivo |
| 5.8 | Merge a `main` y etiqueta `v1.0.0` |
| 5.9 | Actualizar `README.md` (dice Mobile ~5%) y `docs/Plan_de_Desarrollo.md` (cronograma vencido) |
| 5.10 | Completar el checklist de `docs/Guia_de_Despliegue.md` §8 (los 6 ítems están sin marcar) |

---

## 5. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| La API en Render no respondió (timeout de 25 s el 27-sep) | No se puede validar nada extremo a extremo | Confirmar si es cold start del plan free o caída — **Fase 0** |
| La BD de producción usa `synchronize: true` | Al escribir los servicios, el esquema se altera en el arranque sin revisión | Migraciones antes de desplegar la Fase 1 (**5.1**) |
| Las entidades huérfanas ya existen en la BD desplegada | La Fase 1 las activa sin previo aviso | Verificar el diff de esquema antes del primer despliegue |
| Los pesos del IPCP se inventan | El índice orienta mal a un paciente real | Validación del equipo médico; constantes aisladas y testeadas (**2.2**) |
| La landing promete "IA" y el IPCP es una regla | Expectativa incorrecta ante el jurado | Alinear el copy (**2.6**) |
| Dos lockfiles en `frontend/` | Build roto en un clon limpio con npm | Documentar pnpm como canónico (**0.3**) |
| Expo Go no funciona con MMKV 4 + Nitro | El flujo de arranque documentado no sirve | Documentar el flujo real (**0.6**) |
| No hay red de pruebas | Las Fases 1-4 son refactor sin red | Escribir las pruebas junto al código (**1.E**) |
| `main` está 127 commits atrás de `develop` | El repositorio de entrega no tiene nada de lo hecho | Mergear `develop` → `main` en la Fase 5 |

---

## 6. Definición de Terminado

Se conservan los 6 criterios de `docs/Plan_de_Desarrollo.md` §7: cumple los criterios de aceptación, está integrado, tiene pruebas funcionales, fue revisado por otra persona antes de llegar a `develop`, su documentación está actualizada y está listo para la demostración.

**Criterio de salida global del MVP:**

- [ ] Las 23 historias Must Have marcadas como completadas en §3
- [ ] Ninguna pantalla muestra datos clínicos inventados
- [ ] `pnpm build && pnpm test` en `api/`; `npm run build && npm run lint` en `frontend/`; `npm run typecheck && npm run lint` en `mobile/`
- [ ] Flujo completo verificado extremo a extremo: login → registrar indicador → agendar cita → registrar medicamento, en panel y móvil
- [ ] Checklist de `docs/Guia_de_Despliegue.md` §8 completado
- [ ] README y `docs/Plan_de_Desarrollo.md` actualizados

---

## 7. Verificación por fase

```bash
# API
cd api && pnpm build && pnpm test && pnpm lint

# Frontend
cd frontend && pnpm install && npm run build && npm run lint

# Mobile
cd mobile && npx tsc --noEmit && npm run lint
```

Prueba de humo del flujo principal, en ambos paneles: login → registro de indicador → agendar cita → registrar medicamento.

---

## 8. Registro de avance

Actualizar esta tabla en cada PR mergeado a `develop`.

| Fecha | Fase | Tarea | Autor | PR |
|---|---|---|---|---|
| 27-sep-2026 | — | Documento creado. Diagnóstico y línea de base verificados | — | — |

# Esquema de Base de Datos — Salud Móvil

**Versión:** 1.1 (propuesta revisada)
**Fecha de elaboración:** 6 de agosto de 2026
**Base de datos:** PostgreSQL
**Documento fuente original:** `salud_movil_ddl.sql` (modificado según este documento)

---

## 1. Propósito y alcance

Este documento describe el modelo de datos de **Salud Móvil** de forma estructurada y legible, sin sintaxis SQL. Define las entidades, sus campos, relaciones, reglas de integridad e índices necesarios para implementar las 31 historias de usuario del backlog (6 épicas) del MVP.

El modelo se basa en el script DDL original y lo **modifica** para cumplir los criterios de aceptación del backlog. Los cambios aplicados se listan en la sección 9.

---

## 2. Convenciones

- **Identificadores:** las entidades principales usan identificadores universales (UUID) generados automáticamente. Las tablas de catálogo usan identificadores numéricos pequeños, asignados manualmente.
- **Nombres de campos:** en minúsculas, palabras separadas por guion bajo (`snake_case`).
- **Nombres de tablas:** en minúsculas, palabras separadas por guion bajo.
- **Fechas y horas:** las marcas de tiempo se almacenan en la zona horaria del sistema. Las horas de toma de medicamentos no incluyen zona horaria.
- **Momentos de creación:** toda entidad principal registra `created_at` (fecha de creación). Las que permiten edición registran también `updated_at`.
- **Estados de eliminación (borrado lógico / soft delete):** en lugar de borrar físicamente, todas las tablas principales registran `deleted_at` (marca temporal de borrado lógico; nula mientras el registro exista). Las consultas estándar excluyen automáticamente las filas borradas. Los catálogos `cat_*` no usan borrado lógico (datos de referencia). Además se conservan los estados de negocio `is_active` (usuario) y `active` (medicamento), con semántica distinta del borrado.
- **Borrado en cascada:** el borrado físico elimina en cascada (a nivel de base de datos) los registros dependientes de un paciente. El borrado lógico se propaga por la jerarquía de agregados mediante cascada de aplicación (soft-remove): al marcar un `user` como borrado se marcan sus perfiles (paciente/cuidador/personal de salud) y, en cascada, el expediente, las consultas, los indicadores, los medicamentos (con horarios, días y recordatorios), las citas (con recordatorios) y los vínculos con cuidadores.

---

## 3. Panorama de entidades

### 3.1 Dominio de usuarios y roles

- `user` — cuenta de acceso a la aplicación (autenticación).
- `patient` — perfil clínico del paciente (hereda de `user`).
- `caregiver` — perfil del cuidador o familiar (hereda de `user`).
- `healthcare_worker` — perfil del personal de salud (hereda de `user`).
- `patient_caregiver` — vínculo entre paciente y cuidador (relación N:M con tipo de parentesco).
- `password_reset` — token de restablecimiento de contraseña (HU-04).

### 3.2 Dominio de centros de salud

- `health_center` — unidad de salud donde trabaja el personal médico.

### 3.3 Dominio del expediente clínico

- `medical_record` — expediente maestro del paciente (uno por paciente).
- `medical_visit` — cada consulta médica registrada dentro del expediente.

### 3.4 Dominio del monitoreo de salud

- `health_indicator` — registro de indicadores (presión arterial, glucosa, peso, temperatura).

### 3.5 Dominio de medicación

- `medication` — tratamiento farmacológico de un paciente.
- `medication_schedule` — hora de toma de un medicamento.
- `medication_schedule_day` — días de la semana en que aplica un horario.
- `medication_reminder` — recordatorio generado para una hora de toma.

### 3.6 Dominio de citas

- `appointment` — cita médica programada.
- `appointment_reminder` — recordatorio generado para una cita.

### 3.7 Catálogos (tablas de referencia)

- `cat_role` — roles de usuario.
- `cat_genre` — género.
- `cat_type_indicator` — tipos de indicador con su unidad de medida.
- `cat_appointment_state` — estados de una cita.
- `cat_notification_state` — estados de un recordatorio.
- `cat_route_administration` — vías de administración de medicamentos.
- `cat_relationship_type` — tipos de parentesco entre paciente y cuidador.
- `cat_major` — especialidades médicas.
- `cat_health_center_type` — tipos de centro de salud.
- `cat_appointment_type` — tipos de cita médica.
- `cat_department` — departamentos de Nicaragua.
- `cat_municipality` — municipios de Nicaragua, cada uno pertenece a un departamento.

### 3.8 Resumen de tablas por dominio

**Usuarios y roles**

| Tabla | Rol en el dominio |
|---|---|
| `user` | Cuenta de acceso (base de todos los perfiles) |
| `patient` | Perfil del paciente |
| `caregiver` | Perfil del cuidador o familiar |
| `healthcare_worker` | Perfil del personal de salud |
| `patient_caregiver` | Vínculo N:M paciente ↔ cuidador (parentesco y cuidador principal) |
| `password_reset` | Token de restablecimiento de contraseña (hash, expiración y uso) |

**Centros de salud**

| Tabla | Rol en el dominio |
|---|---|
| `health_center` | Unidad de salud donde labora el personal y se asignan pacientes |

**Expediente clínico**

| Tabla | Rol en el dominio |
|---|---|
| `medical_record` | Expediente maestro del paciente (1:1) |
| `medical_visit` | Cada consulta médica dentro del expediente |

**Monitoreo de salud**

| Tabla | Rol en el dominio |
|---|---|
| `health_indicator` | Registros de presión arterial, glucosa, peso y temperatura |

**Medicación**

| Tabla | Rol en el dominio |
|---|---|
| `medication` | Tratamiento farmacológico del paciente |
| `medication_schedule` | Hora de toma de un medicamento |
| `medication_schedule_day` | Días de la semana en que aplica un horario |
| `medication_reminder` | Recordatorio de una toma |

**Citas**

| Tabla | Rol en el dominio |
|---|---|
| `appointment` | Cita médica programada |
| `appointment_reminder` | Recordatorio previo a una cita |

**Catálogos (tablas de referencia)**

| Tabla | Contenido |
|---|---|
| `cat_role` | Roles de usuario |
| `cat_genre` | Género |
| `cat_type_indicator` | Tipos de indicador y unidad de medida |
| `cat_appointment_state` | Estados de cita |
| `cat_appointment_type` | Tipos de cita |
| `cat_notification_state` | Estados de notificación |
| `cat_route_administration` | Vías de administración |
| `cat_relationship_type` | Tipos de parentesco |
| `cat_major` | Especialidades médicas |
| `cat_health_center_type` | Tipos de centro |
| `cat_department` | Departamentos de Nicaragua |
| `cat_municipality` | Municipios por departamento |

**Total:** 16 tablas principales + 12 catálogos = **28 tablas**.

---

## 4. Tablas de catálogo

### 4.1 Roles de usuario — `cat_role`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (50) | Nombre del rol |

**Valores semilla:**

| id | name | Código RBAC |
|---|---|---|
| 1 | Patient | `patient` |
| 2 | Caregiver | `caregiver` |
| 3 | Healthcare_Worker | `health_staff` |
| 4 | Administrator | `admin` |

### 4.2 Género — `cat_genre`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (50) | Nombre del género |

**Valores semilla:** Male (1), Female (2), Other (3), Prefer not to say (4).

### 4.3 Tipo de indicador — `cat_type_indicator`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (255) | Nombre del indicador |
| measurement_unit | Texto (255) | Unidad de medida |

**Valores semilla:**

| id | name | Unidad |
|---|---|---|
| 1 | Blood pressure (presión arterial) | mmHg |
| 2 | Glucose (glucosa) | mg/dL |
| 3 | Weight (peso) | kg |
| 4 | Temperature (temperatura) | °C |

### 4.4 Estado de cita — `cat_appointment_state`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (50) | Nombre del estado |

**Valores semilla:** Scheduled (1) [programada], Cancelled (2) [cancelada], Completed (3) [completada], No show (4) [no asistió].

### 4.5 Estado de notificación — `cat_notification_state`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (50) | Nombre del estado |

**Valores semilla:** Pending (1) [pendiente], Sent (2) [enviado], Confirmed (3) [confirmado], Failed (4) [fallido].

### 4.6 Vía de administración — `cat_route_administration`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (50) | Vía de administración |

**Valores semilla:** Oral (1), Intravenous (2) [intravenosa], Subcutaneous (3) [subcutánea], Topical (4) [tópica], Inhaled (5) [inhalada].

### 4.7 Tipo de relación paciente-cuidador — `cat_relationship_type`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (50) | Tipo de parentesco |

**Valores semilla:** Parent (1) [padre/madre], Child (2) [hijo/a], Spouse (3) [cónyuge], Professional caregiver (4) [cuidador profesional], Other family member (5) [otro familiar].

### 4.8 Especialidad médica — `cat_major`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (100) | Especialidad |

**Valores semilla:** General medicine (1), Nursing (2) [enfermería], Cardiology (3), Endocrinology (4), Other (5).

### 4.9 Tipo de centro de salud — `cat_health_center_type`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (50) | Tipo de centro |

**Valores semilla:** Hospital (1), Health center (2) [centro de salud], Private clinic (3) [clínica privada], Health post (4) [puesto de salud].

### 4.10 Tipo de cita — `cat_appointment_type`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (50) | Tipo de cita |

**Valores semilla:** First visit (1) [primera consulta], Follow-up (2) [seguimiento], Check-up (3) [control], Other (4) [otro].

### 4.11 Departamento — `cat_department`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (100) | Nombre del departamento |

**Valores semilla:**

| id | name |
|---|---|
| 1 | Boaco |
| 2 | Carazo |
| 3 | Chinandega |
| 4 | Chontales |
| 5 | Estelí |
| 6 | Granada |
| 7 | Jinotega |
| 8 | León |
| 9 | Madriz |
| 10 | Managua |
| 11 | Masaya |
| 12 | Matagalpa |
| 13 | Nueva Segovia |
| 14 | Rivas |
| 15 | Río San Juan |
| 16 | Costa Caribe Norte |
| 17 | Costa Caribe Sur |

### 4.12 Municipio — `cat_municipality`

| Campo | Tipo | Descripción |
|---|---|---|
| id | Número pequeño | Identificador |
| name | Texto (100) | Nombre del municipio |
| department_id | Número pequeño | Departamento al que pertenece (FK a `cat_department`) |

**Relaciones:**
- Cada municipio pertenece a **un departamento** (`cat_department`). La jerarquía es estricta: un municipio pertenece a un único departamento.

**Valores semilla** (municipios agrupados por departamento, según la división administrativa oficial):

| Departamento | Municipios |
|---|---|
| Boaco | Boaco, Camoapa, San José de los Remates, San Lorenzo, Santa Lucía, Teustepe |
| Carazo | Diriamba, Dolores, El Rosario, Jinotepe, La Conquista, La Paz de Carazo, San Marcos, Santa Teresa |
| Chinandega | Chichigalpa, Chinandega, Cinco Pinos, Corinto, El Realejo, El Viejo, Posoltega, Puerto Morazán, San Francisco del Norte, San Pedro del Norte, Santo Tomás del Norte, Somotillo, Villanueva |
| Chontales | Acoyapa, Comalapa, El Coral, Juigalpa, La Libertad, San Francisco de Cuapa, San Pedro de Lóvago, Santo Domingo, Santo Tomás |
| Estelí | Condega, Estelí, La Trinidad, Pueblo Nuevo, San Juan de Limay, San Nicolás |
| Granada | Diriá, Diriomo, Granada, Nandaime |
| Jinotega | El Cuá, Jinotega, La Concordia, San José de Bocay, San Rafael del Norte, San Sebastián de Yalí, Santa María de Pantasma, Wiwilí de Jinotega |
| León | Achuapa, El Jicaral, El Sauce, La Paz Centro, Larreynaga (Malpaisillo), León, Nagarote, Quezalguaque, Santa Rosa del Peñón, Telica |
| Madriz | Las Sabanas, Palacagüina, San José de Cusmapa, San Juan de Río Coco, San Lucas, Somoto, Telpaneca, Totogalpa, Yalagüina |
| Managua | Ciudad Sandino, El Crucero, Managua, Mateare, San Francisco Libre, San Rafael del Sur, Ticuantepe, Tipitapa, Villa El Carmen |
| Masaya | Catarina, La Concepción, Masatepe, Masaya, Nandasmo, Nindirí, Niquinohomo, San Juan de Oriente, Tisma |
| Matagalpa | Ciudad Darío, Esquipulas, Matagalpa, Matiguás, Muy Muy, Rancho Grande, Río Blanco, San Dionisio, San Isidro, San Ramón, Sébaco, Terrabona, Tuma-La Dalia |
| Nueva Segovia | Ciudad Antigua, Dipilto, El Jícaro, Jalapa, Macuelizo, Mozonte, Murra, Ocotal, Quilalí, San Fernando, Santa María, Wiwilí de Nueva Segovia |
| Rivas | Altagracia, Belén, Buenos Aires, Cárdenas, Moyogalpa, Potosí, Rivas, San Jorge, San Juan del Sur, Tola |
| Río San Juan | El Almendro, El Castillo, Morrito, San Carlos |
| Costa Caribe Norte | Bonanza, Mulukukú, Prinzapolka, Puerto Cabezas, Rosita, Siuna, Waslala, Waspán |
| Costa Caribe Sur | Bluefields, Corn Island, Desembocadura de la Cruz de Río Grande, El Ayote, El Rama, El Tortuguero, Kukra Hill, La Cruz de Río Grande, Laguna de Perlas, Muelle de los Bueyes, Nueva Guinea, Paiwas |

**Nota:** El municipio de El Ayote pertenece al departamento Costa Caribe Sur (antes RAAS). Se ubicó únicamente en este departamento en el semillero para evitar registros contradictorios.

---

## 5. Entidades principales

### 5.1 Usuario — `user`

**Propósito:** cuenta de acceso de cualquier persona en la plataforma (paciente, cuidador, personal de salud o administrador). Cada tipo de perfil extiende esta tabla mediante la misma clave primaria.

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (generado automáticamente) |
| name | Texto (255) | Nombre completo del usuario |
| email | Texto (255) | Correo electrónico, único. Se almacena en minúsculas |
| username | Texto (255) | Nombre de usuario para el inicio de sesión, único |
| password_hash | Texto (255) | Contraseña cifrada (hash) |
| phone_number | Texto (255) | Teléfono de contacto |
| dni | Texto (255) (nulo) | Cédula de identidad o NIE, único cuando se registra |
| address | Texto (255) | Dirección de residencia |
| municipality_id | Número pequeño | Municipio de residencia (FK a `cat_municipality`) |
| role_id | Número pequeño | Rol del usuario (FK a `cat_role`) |
| signup_date | Fecha y hora | Fecha de registro (por defecto, momento actual) |
| email_verified_at | Fecha y hora (nula) | Fecha en que se verificó el correo electrónico |
| last_login_at | Fecha y hora (nula) | Fecha del último inicio de sesión |
| is_active | Booleano | Indica si la cuenta está activa (por defecto, verdadero) |
| created_at | Fecha y hora | Fecha de creación del registro |
| updated_at | Fecha y hora | Fecha de última modificación |
| deleted_at | Fecha y hora (nula) | Borrado lógico de la cuenta (nula si la cuenta existe) |

**Relaciones:**
- Cada usuario tiene **un rol** (`cat_role`).
- Cada usuario referencia **un municipio** de residencia (`cat_municipality`); el departamento se obtiene a través de la relación del municipio (modelo normalizado, sin campo duplicado).
- Un usuario puede tener **como máximo un perfil** de tipo paciente, cuidador o personal de salud (extensión en las tablas `patient`, `caregiver` y `healthcare_worker` respectivamente).
- Un usuario puede tener **varios tokens de restablecimiento de contraseña** (`password_reset`).

**Reglas:**
- El correo electrónico y el nombre de usuario (`username`) deben ser únicos.
- La cédula (`dni`) debe ser única cuando se registra.
- La contraseña nunca se almacena en texto plano.
- La desactivación se hace con el campo `is_active`, no borrando el registro.

### 5.2 Paciente — `patient`

**Propósito:** información clínica básica del paciente. Hereda el identificador de `user` (misma clave primaria).

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (clave primaria y a la vez FK a `user.id`) |
| date_of_birth | Fecha | Fecha de nacimiento |
| genre_id | Número pequeño | Género (FK a `cat_genre`) |
| health_center_id | UUID | Centro de salud al que está asignado (FK a `health_center`) |
| emergency_contact_name | Texto (255) | Nombre del contacto de emergencia |
| emergency_contact_phone_number | Texto (255) | Teléfono del contacto de emergencia |
| deleted_at | Fecha y hora (nula) | Borrado lógico del perfil (nula si el registro existe) |

**Nota:** la dirección, el municipio, el departamento y la cédula se heredan de `user` (no se duplican aquí).

**Relaciones:**
- Cada paciente es **un usuario** (`user`).
- Pertenece a **un centro de salud** (`health_center`) al que está asignado.
- Tiene **un expediente clínico** (`medical_record`, relación 1:1).
- Tiene **muchos indicadores** (`health_indicator`).
- Tiene **muchos medicamentos** (`medication`).
- Tiene **muchas citas** (`appointment`).
- Se vincula a **uno o varios cuidadores** mediante `patient_caregiver`.

### 5.3 Cuidador — `caregiver`

**Propósito:** perfil del familiar o cuidador que da seguimiento a uno o más pacientes. Hereda el identificador de `user`.

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (clave primaria y a la vez FK a `user.id`) |
| deleted_at | Fecha y hora (nula) | Borrado lógico del perfil (nula si el registro existe) |

**Relaciones:**
- Cada cuidador es **un usuario** (`user`).
- Se vincula a **uno o varios pacientes** mediante `patient_caregiver` (HU-05: un cuidador puede seguir a varios pacientes).

### 5.4 Personal de salud — `healthcare_worker`

**Propósito:** perfil del personal médico que atiende pacientes. Hereda el identificador de `user`.

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (clave primaria y a la vez FK a `user.id`) |
| major_id | Número pequeño | Especialidad (FK a `cat_major`) |
| license_number | Texto (255) | Número de licencia médica |
| employee_id | Texto (255) | Identificación o carnet del personal en el centro de salud (código de empleado) |
| health_center_id | UUID | Centro de salud donde labora (FK a `health_center`) |
| deleted_at | Fecha y hora (nula) | Borrado lógico del perfil (nula si el registro existe) |

**Relaciones:**
- Cada personal de salud es **un usuario** (`user`). La cédula, dirección y municipio se heredan de `user`.
- Pertenece a **un centro de salud** (`health_center`).
- Atiende **muchas citas** (`appointment`).
- Registra **muchas consultas** (`medical_visit`).

### 5.5 Vínculo paciente-cuidador — `patient_caregiver`

**Propósito:** relaciona a un cuidador con un paciente e indica el parentesco (HU-02 y HU-05).

| Campo | Tipo | Descripción |
|---|---|---|
| patient_id | UUID | Paciente (FK a `patient.id`) |
| caregiver_id | UUID | Cuidador (FK a `caregiver.id`) |
| relationship_type_id | Número pequeño | Tipo de parentesco (FK a `cat_relationship_type`) |
| date_link | Fecha | Fecha en que se estableció el vínculo (por defecto, día actual) |
| is_primary | Booleano | Indica si este cuidador es el principal (por defecto, falso) |
| created_at | Fecha y hora | Fecha de creación del registro |
| deleted_at | Fecha y hora (nula) | Borrado lógico del vínculo (nula si el registro existe) |

**Relaciones:**
- Muchos a muchos entre `patient` y `caregiver`, con atributo propio (parentesco y fecha).
- La clave primaria es la combinación de paciente y cuidador.

**Reglas:**
- Un cuidador puede vincularse a varios pacientes (HU-05).
- Un paciente puede tener varios cuidadores.

### 5.6 Centro de salud — `health_center`

**Propósito:** unidad de salud donde trabaja el personal médico.

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (generado automáticamente) |
| name | Texto (255) | Nombre del centro |
| address | Texto (255) | Dirección |
| phone_number | Texto (255) | Teléfono |
| health_center_type_id | Número pequeño | Tipo de centro (FK a `cat_health_center_type`) |
| municipality_id | Número pequeño | Municipio donde se ubica el centro (FK a `cat_municipality`) |
| created_at | Fecha y hora | Fecha de creación del registro |
| updated_at | Fecha y hora | Fecha de última modificación |
| deleted_at | Fecha y hora (nula) | Borrado lógico del centro (nula si el registro existe) |

**Relaciones:**
- Cada centro es de **un tipo** (`cat_health_center_type`).
- Cada centro se ubica en **un municipio** (`cat_municipality`); el departamento se obtiene a través de esta relación.
- Emplea a **muchos** integrantes del personal de salud (`healthcare_worker`).

### 5.7 Expediente clínico — `medical_record`

**Propósito:** registro maestro del expediente del paciente: diagnóstico principal, historial y alergias. **Existe un único expediente por paciente.**

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (generado automáticamente) |
| patient_id | UUID | Paciente al que pertenece (FK a `patient.id`) |
| primary_diagnosis | Texto (255) | Diagnóstico principal |
| medical_history | Texto largo | Historial médico del paciente |
| allergies | Texto largo | Alergias conocidas |
| blood_type | Texto (10) (nulo) | Grupo sanguíneo (ej. "A+", "O−") |
| created_by | UUID (nulo) | Usuario que creó el expediente (FK a `user.id`) |
| create_date | Fecha y hora | Fecha de creación (por defecto, momento actual) |
| update_date | Fecha y hora | Fecha de última modificación (por defecto, momento actual) |
| deleted_at | Fecha y hora (nula) | Borrado lógico del expediente (nula si el registro existe) |

**Relaciones:**
- Un paciente tiene **un único expediente** (relación 1:1).
- El expediente contiene **muchas consultas** (`medical_visit`).

**Reglas:**
- El campo `patient_id` debe ser único (no pueden existir dos expedientes para el mismo paciente).
- No se borra físicamente: se elimina en cascada si el paciente se elimina.

### 5.8 Consulta médica — `medical_visit` *(tabla nueva)*

**Propósito:** cada consulta médica realizada al paciente dentro de su expediente (HU-10: registrar consultas con diagnóstico, observaciones y fecha). El historial clínico se construye ordenando estas consultas cronológicamente (HU-11).

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (generado automáticamente) |
| medical_record_id | UUID | Expediente al que pertenece (FK a `medical_record.id`) |
| healthcare_worker_id | UUID | Personal que atendió la consulta (FK a `healthcare_worker.id`) |
| visit_date | Fecha y hora | Fecha y hora de la consulta |
| diagnosis | Texto (255) | Diagnóstico de la consulta |
| observations | Texto largo | Observaciones del médico |
| treatment | Texto largo | Tratamiento indicado en la consulta |
| next_visit_date | Fecha (nula) | Fecha sugerida para el próximo control |
| created_at | Fecha y hora | Fecha de creación del registro |
| deleted_at | Fecha y hora (nula) | Borrado lógico de la consulta (nula si el registro existe) |

**Relaciones:**
- Cada consulta pertenece a **un expediente** (`medical_record`).
- Cada consulta es atendida por **un integrante** del personal de salud (`healthcare_worker`).

**Reglas:**
- El paciente puede consultar su propio expediente y sus visitas (HU-12); el personal de salud, las de los pacientes de su centro de salud.

### 5.9 Indicador de salud — `health_indicator`

**Propósito:** registro de un valor de salud del paciente (presión arterial, glucosa, peso o temperatura) con fecha y hora (HU-13).

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (generado automáticamente) |
| patient_id | UUID | Paciente (FK a `patient.id`) |
| type_indicator_id | Número pequeño | Tipo de indicador (FK a `cat_type_indicator`) |
| value | Decimal | Valor principal del indicador. Para presión arterial corresponde a la sistólica |
| value_secondary | Decimal (nulo) | Valor secundario, **solo para presión arterial**: la diastólica |
| date_hour | Fecha y hora | Fecha y hora del registro |
| registered_by | UUID | Usuario que registró el valor (FK a `user.id`) |
| notes | Texto (nulo) | Observaciones del registro |
| created_at | Fecha y hora | Fecha de creación del registro |
| deleted_at | Fecha y hora (nula) | Borrado lógico del indicador (nula si el registro existe) |

**Relaciones:**
- Cada indicador pertenece a **un paciente** (`patient`).
- Cada indicador es de **un tipo** (`cat_type_indicator`).
- Cada indicador fue registrado por **un usuario** (`user`).

**Reglas por tipo de indicador:**

| Tipo | Campo usado |
|---|---|
| Presión arterial (1) | `value` = sistólica, `value_secondary` = diastólica |
| Glucosa (2) | `value` = concentración en mg/dL |
| Peso (3) | `value` = peso en kg |
| Temperatura (4) | `value` = temperatura en °C |

**Reglas de integridad:**
- `value` debe ser mayor que cero.
- `value_secondary`, cuando existe, debe ser mayor que cero.
- La serie histórica se consulta por paciente, tipo y fecha (HU-14, HU-15 y HU-16).

### 5.10 Medicamento — `medication`

**Propósito:** tratamiento farmacológico prescrito a un paciente (HU-23).

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (generado automáticamente) |
| patient_id | UUID | Paciente (FK a `patient.id`) |
| drug_name | Texto (255) | Nombre del medicamento |
| dose | Texto (255) | Dosis (ej. "1 tableta") |
| route_administration_id | Número pequeño | Vía de administración (FK a `cat_route_administration`) |
| instructions | Texto (255) (nulo) | Indicaciones de administración (ej. "tomar con alimentos") |
| prescribed_by | UUID (nulo) | Personal que recetó el tratamiento (FK a `user.id`) |
| start_date | Fecha | Fecha de inicio del tratamiento |
| end_date | Fecha (nulo) | Fecha de fin del tratamiento (nula si es indefinido) |
| active | Booleano | Si el tratamiento está activo (por defecto, verdadero) |
| created_at | Fecha y hora | Fecha de creación del registro |
| updated_at | Fecha y hora | Fecha de última modificación |
| deleted_at | Fecha y hora (nula) | Borrado lógico del medicamento (nula si el registro existe) |

**Relaciones:**
- Cada medicamento pertenece a **un paciente** (`patient`).
- Cada medicamento usa **una vía** de administración (`cat_route_administration`).
- Cada medicamento tiene **uno o varios horarios** (`medication_schedule`).

**Reglas:**
- La fecha de fin, si existe, debe ser posterior o igual a la fecha de inicio.
- Los medicamentos finalizados se marcan como inactivos en lugar de eliminarse.

### 5.11 Horario de medicamento — `medication_schedule`

**Propósito:** define **una hora de toma** de un medicamento. Para dosis múltiples al día se crea una fila por hora (HU-23 y HU-24).

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (generado automáticamente) |
| medicine_id | UUID | Medicamento (FK a `medication.id`) |
| hour | Hora (sin zona horaria) | Hora de la toma |
| times_per_day | Número pequeño | Número descriptivo de tomas diarias (ej. 3 para "cada 8 horas") |
| created_at | Fecha y hora | Fecha de creación del registro |
| deleted_at | Fecha y hora (nula) | Borrado lógico del horario (nula si el registro existe) |

**Relaciones:**
- Cada horario pertenece a **un medicamento** (`medication`).
- Cada horario puede tener **días de semana** específicos (`medication_schedule_day`).

**Reglas de interpretación:**
- Una fila = una hora de toma por día.
- "Cada 8 horas" se modela con **tres filas** (una por cada toma del día) y `times_per_day = 3`.
- Si el horario aplica todos los días, no se crean filas en `medication_schedule_day`; si aplica solo algunos días, se crean las filas correspondientes.

### 5.12 Día de horario — `medication_schedule_day`

**Propósito:** restringe un horario a días específicos de la semana.

| Campo | Tipo | Descripción |
|---|---|---|
| schedule_id | UUID | Horario (FK a `medication_schedule.id`) |
| week_day | Número pequeño | Día de la semana (1 = lunes, …, 7 = domingo) |
| deleted_at | Fecha y hora (nula) | Borrado lógico del día de horario (nula si el registro existe) |

**Relaciones:**
- Cada fila pertenece a **un horario** (`medication_schedule`).

**Reglas:**
- `week_day` debe estar entre 1 y 7.
- La clave primaria es la combinación de horario y día.

### 5.13 Recordatorio de medicamento — `medication_reminder`

**Propósito:** registra cada recordatorio programado/envido para una hora de toma (HU-25 y HU-26).

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (generado automáticamente) |
| schedule_id | UUID | Horario de donde proviene (FK a `medication_schedule.id`) |
| date_hour_scheduled | Fecha y hora | Fecha y hora programada de la toma |
| notification_state_id | Número pequeño | Estado de la notificación (FK a `cat_notification_state`) |
| confirmation_date | Fecha y hora (nula) | Fecha en que el paciente confirmó la toma |
| created_at | Fecha y hora | Fecha de creación del registro |
| deleted_at | Fecha y hora (nula) | Borrado lógico del recordatorio (nula si el registro existe) |

**Relaciones:**
- Cada recordatorio pertenece a **un horario** (`medication_schedule`).
- Cada recordatorio tiene **un estado** (`cat_notification_state`).

### 5.14 Cita médica — `appointment`

**Propósito:** cita médica programada entre un paciente y el personal de salud (HU-18).

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (generado automáticamente) |
| patient_id | UUID | Paciente (FK a `patient.id`) |
| healthcare_worker_id | UUID | Personal de salud que atiende (FK a `healthcare_worker.id`) |
| date_hour | Fecha y hora | Fecha y hora de la cita |
| reason | Texto (255) | Motivo de la consulta |
| appointment_state_id | Número pequeño | Estado de la cita (FK a `cat_appointment_state`) |
| appointment_type_id | Número pequeño | Tipo de cita (FK a `cat_appointment_type`) |
| duration_minutes | Número pequeño (nulo) | Duración estimada de la cita en minutos |
| created_by | UUID (nulo) | Usuario que creó o modificó la cita (FK a `user.id`) |
| cancel_reason | Texto (255) (nulo) | Motivo de cancelación si el estado es cancelada |
| cancelled_at | Fecha y hora (nula) | Fecha y hora de cancelación |
| created_at | Fecha y hora | Fecha de creación del registro |
| updated_at | Fecha y hora | Fecha de última modificación |
| deleted_at | Fecha y hora (nula) | Borrado lógico de la cita (nula si el registro existe) |

**Relaciones:**
- Cada cita involucra **un paciente** (`patient`).
- Cada cita es atendida por **un integrante** del personal de salud (`healthcare_worker`).
- Cada cita tiene **un estado** (`cat_appointment_state`).
- Cada cita es de **un tipo** (`cat_appointment_type`).
- Cada cita puede generar **varios recordatorios** (`appointment_reminder`).

**Reglas:**
- Las citas pueden programarse, modificarse y cancelarse (HU-19 y HU-20). La modificación/cancelación queda reflejada en `updated_at` y, si aplica, en `cancel_reason`, `cancelled_at` y el estado.
- Las próximas citas del paciente se consultan por fecha ascendente (HU-21).

### 5.15 Recordatorio de cita — `appointment_reminder`

**Propósito:** registra el recordatorio programado antes de una cita (HU-27).

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (generado automáticamente) |
| appointment_id | UUID | Cita (FK a `appointment.id`) |
| date_hour_send | Fecha y hora | Fecha y hora en que se envía el recordatorio |
| notification_state_id | Número pequeño | Estado de la notificación (FK a `cat_notification_state`) |
| created_at | Fecha y hora | Fecha de creación del registro |
| deleted_at | Fecha y hora (nula) | Borrado lógico del recordatorio (nula si el registro existe) |

**Relaciones:**
- Cada recordatorio pertenece a **una cita** (`appointment`).
- Cada recordatorio tiene **un estado** (`cat_notification_state`).

### 5.16 Token de restablecimiento de contraseña — `password_reset`

**Propósito:** guarda el token de restablecimiento de contraseña generado en el flujo "olvidé mi contraseña" (HU-04). Solo se almacena el **hash SHA-256** del token (nunca el token en texto plano); el token en claro se devuelve al solicitante únicamente en el desarrollo para poder probar el flujo sin servidor de correo.

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador (generado automáticamente) |
| user_id | UUID | Usuario que solicita el restablecimiento (FK a `user.id`) |
| token_hash | Texto (64) | Hash SHA-256 del token, único |
| expires_at | Fecha y hora | Fecha y hora de expiración del token |
| used_at | Fecha y hora (nula) | Fecha y hora en que se utilizó el token (nula si no se ha usado) |
| created_at | Fecha y hora | Fecha de creación del registro |

**Relaciones:**
- Cada token pertenece a **un usuario** (`user`).

**Reglas:**
- El `token_hash` es único.
- Un token solo es válido si no ha expirado (`expires_at` futuro) y no ha sido utilizado (`used_at` nulo). Al usarse se marca `used_at` y el hash queda invalidado.

---

## 6. Reglas de integridad y restricciones

### 6.1 Claves foráneas y borrado

| Origen | Destino | Comportamiento al borrar destino |
|---|---|---|
| patient.id | user.id | Cascada (al borrar el usuario se borra el perfil de paciente) |
| caregiver.id | user.id | Cascada |
| healthcare_worker.id | user.id | Cascada |
| patient_caregiver.patient_id | patient.id | Cascada |
| patient_caregiver.caregiver_id | caregiver.id | Cascada |
| medical_record.patient_id | patient.id | Cascada |
| medical_visit.medical_record_id | medical_record.id | Cascada |
| medical_visit.healthcare_worker_id | healthcare_worker.id | Restringido |
| health_indicator.patient_id | patient.id | Cascada |
| medication.patient_id | patient.id | Cascada |
| medication_schedule.medicine_id | medication.id | Cascada |
| medication_schedule_day.schedule_id | medication_schedule.id | Cascada |
| medication_reminder.schedule_id | medication_schedule.id | Cascada |
| appointment.patient_id | patient.id | Cascada |
| appointment_reminder.appointment_id | appointment.id | Cascada |
| password_reset.user_id | user.id | Cascada |
| patient_caregiver.relationship_type_id | cat_relationship_type.id | Restringido |
| health_center.health_center_type_id | cat_health_center_type.id | Restringido |
| health_indicator.type_indicator_id | cat_type_indicator.id | Restringido |
| health_indicator.registered_by | user.id | Restringido |
| appointment.healthcare_worker_id | healthcare_worker.id | Restringido |
| appointment.created_by | user.id | Restringido |
| appointment.appointment_state_id | cat_appointment_state.id | Restringido |
| appointment.appointment_type_id | cat_appointment_type.id | Restringido |
| appointment_reminder.notification_state_id | cat_notification_state.id | Restringido |
| user.municipality_id | cat_municipality.id | Restringido |
| cat_municipality.department_id | cat_department.id | Restringido |
| patient.health_center_id | health_center.id | Restringido |
| health_center.municipality_id | cat_municipality.id | Restringido |
| medical_record.created_by | user.id | Restringido |
| medication.prescribed_by | user.id | Restringido |

**Nota:** los comportamientos de esta tabla aplican a los **borrados físicos** (definidos a nivel de base de datos). El borrado lógico (soft delete) se propaga mediante la **cascada de aplicación** descrita en la sección 2 (soft-remove de TypeORM), que no afecta estas restricciones físicas.

### 6.2 Restricciones de valor (CHECK)

| Tabla | Restricción |
|---|---|
| medication | `end_date` debe ser posterior o igual a `start_date` (cuando existe) |
| health_indicator | `value` mayor que cero |
| health_indicator | `value_secondary` mayor que cero cuando no es nulo |
| medication_schedule_day | `week_day` entre 1 y 7 |

### 6.3 Unicidad

| Tabla | Campo(s) únicos |
|---|---|
| user | email |
| user | username |
| user | dni (cuando se registra) |
| medical_record | patient_id (un expediente por paciente) |
| patient_caregiver | Combinación (patient_id, caregiver_id) |
| medication_schedule_day | Combinación (schedule_id, week_day) |
| password_reset | token_hash |

**Nota:** las restricciones de unicidad son **totales** (incluyen las filas con borrado lógico). Por lo tanto, un usuario con `deleted_at` definido sigue ocupando su `email`, `username` y `dni`; si se requiere reutilizar esos valores, será necesario eliminarlos físicamente o migrar a índices únicos parciales (`WHERE deleted_at IS NULL`).

---

## 7. Índices propuestos

Los índices agilizan las consultas más frecuentes de la aplicación:

| Tabla | Índice | Justificación |
|---|---|---|
| health_indicator | (patient_id, type_indicator_id, date_hour) | Historial de indicadores por paciente y tipo, ordenado por fecha (HU-14, HU-15 y HU-16) |
| appointment | (patient_id, date_hour) | Próximas citas del paciente (HU-21) |
| appointment | (healthcare_worker_id, date_hour) | Agenda del personal de salud |
| medical_visit | (medical_record_id, visit_date) | Historial clínico cronológico (HU-11) |
| medication | (patient_id) | Medicamentos de un paciente (HU-23) |
| medication_schedule | (medicine_id) | Horarios de un medicamento (HU-23) |
| patient_caregiver | (caregiver_id) | Pacientes vinculados a un cuidador (HU-05) |
| patient | (health_center_id) | Pacientes asignados a un centro de salud (panel médico) |

---

## 8. Mapeo de roles RBAC

La tabla `cat_role` alimenta el control de acceso basado en roles del backend:

| Rol en BD | Código interno | Acceso principal |
|---|---|---|
| Patient (1) | `patient` | Registra indicadores, consulta su expediente, próximas citas, recibe recordatorios |
| Caregiver (2) | `caregiver` | Consulta el historial de sus pacientes vinculados, registra indicadores |
| Healthcare_Worker (3) | `health_staff` | Registra pacientes, consultas y citas; consulta indicadores y expedientes de los pacientes de su centro de salud |
| Administrator (4) | `admin` | Asigna pacientes a un centro de salud, administra usuarios y centros |

---

## 9. Cambios aplicados respecto al DDL original

| # | Cambio | Motivo |
|---|---|---|
| 1 | Se añade la tabla **`medical_visit`** | Permitir registrar cada consulta médica (HU-10) y construir el historial cronológico (HU-11). El expediente maestro (`medical_record`) se mantiene 1:1 por paciente |
| 2 | Se añade **`value_secondary`** a `health_indicator` | Almacenar la presión arterial diastólica (HU-13); la sistólica va en `value` |
| 3 | Se elimina `frequency_id` de `medication_schedule` y la tabla **`cat_frequency`** | El modelo mezclaba una hora única con frecuencias "cada N horas", lo cual era ambiguo. Ahora cada fila es una hora de toma y `times_per_day` describe cuántas tomas hay al día |
| 4 | Se añade `times_per_day` a `medication_schedule` | Describir de forma clara la frecuencia de tomas diarias |
| 5 | Se añaden **`created_at` y `updated_at`** a las tablas principales | Trazabilidad de creación y modificación de registros |
| 6 | Se añaden `created_by`, `cancel_reason` y `updated_at` a `appointment` | Soporte a modificación y cancelación de citas (HU-19 y HU-20) con registro del responsable y motivo |
| 7 | Se añade **`created_at`** a `patient_caregiver`, `medication_reminder` y `appointment_reminder` | Trazabilidad de vínculos y recordatorios |
| 8 | Se añaden **restricciones CHECK** | Garantizar valores coherentes (fechas de tratamiento y valores de indicadores positivos) |
| 9 | Se añaden **índices compuestos** | Rendimiento de las consultas más frecuentes por paciente, tipo y fecha |
| 10 | Se documenta el **mapeo de roles** a códigos RBAC | Consistencia entre la BD y los guards del backend |
| 11 | `user.name` es un único campo | Alineación con el DDL; la entidad del backend (NestJS) se ajustará a un solo nombre |
| 12 | Se añaden a `user`: `dni`, `username`, `address`, `municipality_id`, `email_verified_at`, `last_login_at` y `deleted_at`; `active` pasa a `is_active` | Perfiles completos con dirección y ubicación (municipio normalizado), cédula e identificación de cuenta y trazabilidad de la cuenta |
| 13 | Se traslada `address` de `patient` a `user` y se añade `health_center_id` a `patient` | La dirección aplica a todos los perfiles; el centro de salud asigna al paciente a una unidad y permite filtrar en el panel médico |
| 14 | Se añade `employee_id` a `healthcare_worker` | Identificación/carnet del personal en el centro de salud, además de la licencia médica |
| 15 | Se añaden `blood_type` y `created_by` a `medical_record`; `treatment` y `next_visit_date` a `medical_visit` | Enriquecer el expediente y las consultas con datos clínicos útiles para el seguimiento de enfermedades crónicas |
| 16 | Se añaden `instructions` y `prescribed_by` a `medication`; `notes` a `health_indicator` | Completar los datos de tratamiento y de registro de indicadores |
| 17 | Se añaden a `appointment`: `appointment_type_id`, `duration_minutes` y `cancelled_at`; a `patient_caregiver`: `is_primary` | Agenda con tipo y duración, trazabilidad de cancelación y cuidador principal |
| 18 | Se añaden los catálogos `cat_appointment_type`, `cat_department` y `cat_municipality` | Tipos de cita y ubicación geográfica normalizada; el departamento se deriva del municipio (3NF) |
| 19 | Se implementa el **borrado lógico (soft delete)** en todas las tablas principales: `deleted_at` (marca temporal) y cascada de aplicación (soft-remove) por jerarquía de agregados | Evitar la pérdida de información clínica; implementa la mejora futura prevista en la sección 10. Los catálogos y los estados de negocio (`is_active`, `active`) se conservan |
| 20 | Se añade la tabla **`password_reset`** | Guardar el token de restablecimiento de contraseña (HU-04): se almacena el hash SHA-256 del token, con expiración y marca de uso |

**No aplicados en esta versión** (mejoras futuras, ver sección 10).

---

## 10. Mejoras futuras (fuera del MVP)

- **Token de dispositivo**: campo `device_push_token` en `user` para envío remoto de notificaciones vía Firebase Cloud Messaging (FCM), en sustitución o complemento de la notificación local del MVP.
- **Modo offline**: mecanismo de sincronización para registrar indicadores sin conexión en zonas de baja conectividad.
- **Fotos o adjuntos**: en consultas médicas (`medical_visit`) para recetas o documentos clínicos.
- **Auditoría de cambios**: tabla de auditoría para registrar quién modificó datos clínicos.

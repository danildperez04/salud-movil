**Backlog del Proyecto**

El backlog del proyecto organiza las funcionalidades principales de Salud Móvil en seis épicas, las cuales representan los módulos que serán desarrollados durante la ejecución del proyecto. Cada historia de usuario (HU) describe una necesidad del usuario final y fue estimada utilizando Story Points, siguiendo la secuencia de Fibonacci simplificada (2, 3, 5 y 8 puntos), con el propósito de estimar el esfuerzo relativo de desarrollo. En conjunto, el backlog está conformado por **31 historias de usuario**, con una estimación total de **127 Story Points**.

La prioridad de cada historia sigue la metodología **MoSCoW**:

- **Must Have** — imprescindibles para el MVP (23 historias, 97 puntos).
- **Should Have** — importantes; se implementan si el avance del cronograma lo permite (6 historias, 20 puntos).
- **Could Have** — deseables; no bloquean la entrega del MVP (2 historias, 10 puntos).

**Tabla 1.**

**Épica 1: Autenticación, usuarios y gestión de pacientes**

| **Código** | **Prioridad** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - | - |
| **HU-01** | Must Have | Como administrador, quiero crear cuentas de usuario para el personal de salud (con rol y centro de salud) para que puedan acceder al sistema y atender pacientes. | El administrador puede crear la cuenta con nombre, correo, rol, especialidad y centro de salud; se validan los campos obligatorios y se asignan las credenciales de acceso. | 5 |
| **HU-02** | Must Have | Como cuidador, quiero registrarme en la aplicación con mis datos personales para crear mi cuenta y acceder según mi rol. | El cuidador se registra con nombre, correo, teléfono, dirección y contraseña; el correo es único y se asigna el rol de cuidador. La cuenta del paciente la crea el personal de salud al registrarlo (HU-06). | 5 |
| **HU-03** | Must Have | Como usuario, quiero iniciar sesión con mi correo y contraseña para acceder a la aplicación según mi rol. | El sistema autentica mediante JWT y restringe el acceso según el rol (RBAC). | 3 |
| **HU-04** | Should Have | Como usuario, quiero restablecer mi contraseña para recuperar el acceso a mi cuenta cuando la olvide. | El sistema permite solicitar un enlace de recuperación y cambiar la contraseña. | 3 |
| **HU-05** | Must Have | Como cuidador, quiero vincularme a uno o varios pacientes con su tipo de parentesco para dar seguimiento a sus tratamientos. | El personal de salud registra el vínculo entre el cuidador y uno o más pacientes, indicando el parentesco y si es cuidador principal. | 5 |
| **HU-06** | Must Have | Como personal de salud, quiero registrar un nuevo paciente con sus datos básicos y su centro de salud para iniciar su expediente clínico. | El sistema almacena nombre, fecha de nacimiento, diagnóstico principal, teléfono, dirección y centro de salud, validando los campos obligatorios. | 5 |
| **HU-07** | Must Have | Como personal de salud, quiero buscar y editar los datos de un paciente para mantener su información actualizada. | El sistema permite buscar pacientes por nombre y actualizar sus datos. | 3 |
| **HU-08** | Should Have | Como usuario, quiero consultar y editar mi perfil y cerrar sesión para administrar mis datos de acceso. | El usuario puede ver y editar sus datos personales y cerrar sesión de forma segura. | 3 |

**Tabla 2.**

**Épica 2: Expediente clínico**

| **Código** | **Prioridad** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - | - |
| **HU-09** | Must Have | Como personal de salud, quiero crear y actualizar el expediente clínico del paciente (diagnóstico principal, historial, alergias y grupo sanguíneo) para contar con un registro único. | Existe un único expediente por paciente y el personal de salud puede crearlo y actualizarlo. | 5 |
| **HU-10** | Must Have | Como personal de salud, quiero registrar cada consulta médica (diagnóstico, observaciones, tratamiento y fecha) dentro del expediente para mantenerlo actualizado. | Cada consulta queda almacenada con su diagnóstico, observaciones, tratamiento y fecha. | 5 |
| **HU-11** | Must Have | Como personal de salud, quiero consultar el historial clínico cronológico de un paciente para tomar decisiones médicas informadas. | El sistema muestra todas las consultas ordenadas cronológicamente. | 3 |
| **HU-12** | Must Have | Como paciente, quiero consultar mi propio historial clínico para conocer mi evolución médica. | El paciente únicamente visualiza su propia información clínica. | 3 |

**Tabla 3.**

**Épica 3: Monitoreo de indicadores de salud**

| **Código** | **Prioridad** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - | - |
| **HU-13** | Must Have | Como paciente o cuidador, quiero registrar mis indicadores de salud (presión arterial, glucosa, peso y temperatura) con fecha y hora para llevar un control de mi condición. | El sistema registra los indicadores con valor, unidad y fecha y hora; la presión arterial incluye sistólica y diastólica. | 5 |
| **HU-14** | Must Have | Como paciente, quiero visualizar el historial de mis indicadores en forma de lista para conocer su evolución. | La aplicación muestra los registros ordenados por fecha. | 3 |
| **HU-15** | Should Have | Como paciente, quiero visualizar mi evolución mediante gráficas para identificar tendencias en mi condición. | La aplicación presenta los registros mediante gráficas por tipo de indicador. | 5 |
| **HU-16** | Must Have | Como personal de salud, quiero visualizar los indicadores más recientes de los pacientes de mi centro de salud para identificar oportunamente cambios en su estado de salud. | El sistema muestra los últimos registros de cada paciente del centro de salud del personal. | 5 |
| **HU-17** | Should Have | Como paciente o cuidador, quiero corregir un registro de indicador mal ingresado para mantener la confiabilidad de mis datos. | El sistema permite editar o eliminar un registro propio y conserva la trazabilidad. | 3 |

**Tabla 4.**

**Épica 4: Gestión de citas médicas**

| **Código** | **Prioridad** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - | - |
| **HU-18** | Must Have | Como personal de salud, quiero programar citas médicas (fecha, hora, motivo y tipo) para organizar la atención de mis pacientes. | Las citas se registran indicando fecha, hora, motivo y tipo. | 5 |
| **HU-19** | Must Have | Como personal de salud, quiero modificar una cita cuando sea necesario para ajustarla a la agenda. | El sistema actualiza los datos de la cita. | 3 |
| **HU-20** | Must Have | Como personal de salud, quiero cancelar una cita y notificar al paciente para evitar su desplazamiento innecesario. | La cancelación queda registrada con motivo y se notifica al paciente. | 3 |
| **HU-21** | Must Have | Como paciente, quiero consultar mis próximas citas ordenadas por fecha para organizar mis controles médicos. | Las citas futuras se muestran ordenadas por fecha. | 2 |
| **HU-22** | Should Have | Como personal de salud, quiero marcar una cita como completada o registrar la inasistencia para mantener el estado real de la agenda. | El estado de la cita se actualiza (completada o no asistió). | 3 |

**Tabla 5.**

**Épica 5: Recordatorios y medicación**

| **Código** | **Prioridad** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - | - |
| **HU-23** | Must Have | Como paciente, quiero registrar un medicamento (nombre, dosis, vía y fechas de inicio y fin) para llevar mi tratamiento. | El sistema permite registrar el medicamento con sus datos y lo asocia al paciente. | 5 |
| **HU-24** | Must Have | Como paciente, quiero configurar horarios y días de toma de cada medicamento para recibir recordatorios diarios. | El sistema permite configurar una o más horas de toma por día y los días de la semana. | 8 |
| **HU-25** | Must Have | Como paciente, quiero recibir una notificación local en la hora de toma de cada medicamento para no olvidarlo. | La aplicación envía una notificación local según la programación configurada. | 5 |
| **HU-26** | Should Have | Como paciente, quiero confirmar la toma de cada medicamento para registrar mi adherencia al tratamiento. | El sistema registra la confirmación de cada toma. | 3 |
| **HU-27** | Must Have | Como paciente, quiero recibir una notificación local antes de mi cita médica para no olvidarla. | La aplicación envía una notificación local antes de la cita programada. | 5 |

**Tabla 6.**

**Épica 6: Panel web del personal de salud**

| **Código** | **Prioridad** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - | - |
| **HU-28** | Must Have | Como administrador, quiero asignar cada paciente a su centro de salud para que el personal pueda atenderlo y darle seguimiento. | El paciente queda asignado a un centro de salud al momento de su registro; el administrador puede modificar su centro. | 3 |
| **HU-29** | Must Have | Como personal de salud, quiero visualizar el listado de los pacientes de mi centro de salud con su información principal y última consulta para dar seguimiento. | El panel muestra la información principal y la última consulta registrada de cada paciente del centro de salud del personal. | 3 |
| **HU-30** | Could Have | Como personal de salud, quiero consultar el expediente clínico de un paciente asignado desde el panel web para revisar su historial sin depender de la app móvil. | El panel muestra el expediente del paciente seleccionado. | 5 |
| **HU-31** | Could Have | Como personal de salud, quiero visualizar un resumen de los indicadores recientes de mis pacientes en el panel web para priorizar la atención. | El panel muestra un resumen de indicadores recientes por paciente. | 5 |

**Resumen del backlog**

| **Épica** | **Historias** | **Story Points** |
| - | - | - |
| Épica 1: Autenticación, usuarios y gestión de pacientes | 8 | 32 |
| Épica 2: Expediente clínico | 4 | 16 |
| Épica 3: Monitoreo de indicadores de salud | 5 | 21 |
| Épica 4: Gestión de citas médicas | 5 | 16 |
| Épica 5: Recordatorios y medicación | 5 | 26 |
| Épica 6: Panel web del personal de salud | 4 | 16 |
| **Total** | **31** | **127** |

**Plan de desarrollo del proyecto**

El desarrollo de **Salud Móvil** se llevará a cabo siguiendo la planificación establecida en Trello, organizando las actividades de manera progresiva hasta la fecha de entrega del proyecto. El cronograma fue replanificado el 6 de agosto según el estado real del código (el Sprint 1, de configuración, se completó; el Sprint 2 original quedó pendiente de funcionalidad).

**Tabla 7.**

**Plan de desarrollo**

| **Sprint** | **Período** | **Actividades relacionadas** | **Historias de usuario** |
| - | - | - | - |
| **Sprint 1** | 20 al 27 de julio | Control de versiones, configuración del repositorio, README técnico y diagramación de la base de datos. | — |
| **Sprint 2** | 28 de julio al 10 de agosto | Autenticación, usuarios, registro de pacientes y expediente clínico. | HU-01, HU-02, HU-03, HU-04, HU-05, HU-06, HU-07, HU-08, HU-09, HU-10, HU-11, HU-12 |
| **Sprint 3** | 11 al 17 de agosto | Monitoreo de indicadores, historial clínico y gestión de citas. | HU-13, HU-14, HU-15, HU-16, HU-17, HU-18, HU-19, HU-20, HU-21, HU-22 |
| **Sprint 4** | 18 al 24 de agosto | Registro de medicamentos, recordatorios y pruebas funcionales. | HU-23, HU-24, HU-25, HU-26, HU-27 |
| **Sprint 5** | 25 de agosto al 1 de septiembre | Panel web del personal de salud, integración del sistema, corrección de errores, documentación y pruebas finales. | HU-28, HU-29, HU-30, HU-31 |
| **Entrega** | **2 de septiembre** | Presentación y demostración del funcionamiento de la aplicación. | Proyecto finalizado |

**Nota.** Presten atención a las fechas.

**Definición de Terminado (Definition of Done)**

Una historia de usuario se considerará terminada cuando:

1. Cumpla con todos los criterios de aceptación establecidos.

2. La funcionalidad esté completamente integrada con el resto del sistema.

3. Se hayan realizado pruebas funcionales y no existan errores críticos.

4. El código haya sido revisado por otro integrante del equipo antes de integrarse al repositorio principal.

5. La documentación correspondiente se encuentre actualizada.

6. La funcionalidad esté lista para ser presentada durante la demostración final del proyecto.

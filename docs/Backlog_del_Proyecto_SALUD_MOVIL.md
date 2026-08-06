**Backlog del Proyecto**

El backlog del proyecto organiza las funcionalidades principales de Salud Móvil en seis épicas, las cuales representan los módulos que serán desarrollados durante la ejecución del proyecto. Cada historia de usuario (HU) describe una necesidad del usuario final y fue estimada utilizando Story Points, siguiendo la secuencia de Fibonacci simplificada (2, 3, 5 y 8 puntos), con el propósito de estimar el esfuerzo relativo de desarrollo. En conjunto, el backlog está conformado por 17 historias de usuario, con una estimación total de 71 Story Points.

**Tabla 1. **

**Épica 1: Registro y gestión de pacientes**

| **Código** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - |
| **HU-01** | Como personal de salud, quiero registrar un nuevo paciente con sus datos básicos para iniciar su expediente clínico. | El sistema almacena correctamente el nombre, fecha de nacimiento, diagnóstico principal, teléfono y dirección, validando los campos obligatorios. | 3 |
| **HU-02** | Como paciente o cuidador, quiero crear una cuenta y vincularla a un paciente para acceder a la aplicación. | El usuario puede registrarse e iniciar sesión correctamente, asignándose el rol correspondiente. | 5 |
| **HU-03** | Como cuidador, quiero vincularme a más de un paciente para dar seguimiento a varios familiares. | El sistema permite asociar un cuidador con varios pacientes y registrar el parentesco. | 3 |




**Tabla 2.**

**Épica 2: Expediente clínico**

| **Código** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - |
| **HU-04** | Como personal de salud, quiero registrar las consultas médicas realizadas para mantener actualizado el expediente clínico. | Cada consulta queda almacenada con el diagnóstico, observaciones y fecha correspondiente. | 5 |
| **HU-05** | Como personal de salud, quiero consultar el historial clínico completo de un paciente para facilitar la toma de decisiones. | El sistema muestra todas las consultas ordenadas cronológicamente. | 5 |
| **HU-06** | Como paciente, quiero consultar mi historial clínico para conocer mi evolución médica. | El paciente únicamente puede visualizar su propia información clínica. | 3 |


**Tabla 3.**

**Épica 3: Monitoreo de indicadores de salud**

| **Código** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - |
| **HU-07** | Como paciente, quiero registrar mis indicadores de salud para llevar un control de mi condición médica. | El sistema registra presión arterial, glucosa, peso y temperatura con fecha y hora. | 5 |
| **HU-08** | Como paciente, quiero visualizar el historial de mis indicadores para conocer su evolución. | La aplicación presenta los registros mediante listas o gráficas. | 5 |
| **HU-09** | Como personal de salud, quiero visualizar los indicadores recientes de mis pacientes para identificar oportunamente cambios en su estado de salud. | El sistema muestra los registros más recientes de cada paciente. | 3 |


**Tabla 4.**

**Épica 4: Gestión de citas médicas**

| **Código** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - |
| **HU-10** | Como personal de salud, quiero programar citas médicas para organizar la atención de los pacientes. | Las citas se registran indicando fecha, hora y motivo. | 5 |
| **HU-11** | Como personal de salud, quiero modificar o cancelar citas cuando sea necesario. | El sistema actualiza la información y notifica al paciente. | 3 |
| **HU-12** | Como paciente, quiero consultar mis próximas citas para organizar mis controles médicos. | Las citas futuras se muestran ordenadas por fecha. | 2 |


**Tabla 5.**

**Épica 5: Recordatorios**

| **Código** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - |
| **HU-13** | Como paciente, quiero recibir recordatorios de mis citas médicas para evitar olvidarlas. | La aplicación envía una notificación antes de la cita programada. | 5 |
| **HU-14** | Como paciente, quiero registrar mis medicamentos para recibir recordatorios diarios. | El sistema permite configurar horarios, dosis y frecuencia del tratamiento. | 5 |
| **HU-15** | Como paciente, quiero recibir recordatorios para tomar mis medicamentos según el horario establecido. | La aplicación envía notificaciones de acuerdo con la programación realizada. | 8 |


**Tabla 6.**

**Épica 6: Panel para personal de salud**

| **Código** | **Historia de usuario** | **Criterio de aceptación** | **Story Points** |
| - | - | - | - |
| **HU-16** | Como personal de salud, quiero visualizar el listado de pacientes asignados para facilitar su seguimiento. | Se muestra la información principal y la última consulta registrada de cada paciente. | 3 |
| **HU-17** | Como administrador, quiero asignar pacientes al personal de salud para distribuir la atención médica. | La asignación queda registrada correctamente en el sistema. | 3 |


**Plan de desarrollo del proyecto**

El desarrollo de **Salud Móvil** se llevará a cabo siguiendo la planificación establecida en Trello, organizando las actividades de manera progresiva hasta la fecha de entrega del proyecto.

**Tabla 7.**

**Plan de desarrollo **

| **Sprint** | **Período** | **Actividades relacionadas** | **Historias de usuario** |
| - | - | - | - |
| **Sprint 1** | 20 al 27 de julio | Control de versiones, configuración del repositorio, README técnico y diagramación de la base de datos. | HU-01, HU-02 |
| **Sprint 2** | 28 de julio al 10 de agosto | Desarrollo de la interfaz, autenticación, registro de pacientes y expediente clínico. | HU-03, HU-04, HU-05, HU-06 |
| **Sprint 3** | 11 al 17 de agosto | Desarrollo del monitoreo de indicadores, gestión de citas y panel del personal de salud. | HU-07, HU-08, HU-09, HU-10, HU-11, HU-12 |
| **Sprint 4** | 18 al 24 de agosto | Implementación de recordatorios, seguridad, buenas prácticas y pruebas funcionales. | HU-13, HU-14, HU-15 |
| **Sprint 5** | 25 al 31 de agosto | Integración del sistema, asignación de pacientes, corrección de errores, documentación y pruebas finales. | HU-16, HU-17 |
| **Entrega** | **1 de septiembre** | Presentación y demostración del funcionamiento de la aplicación. | Proyecto finalizado |

**Nota. **Prestan atención a las fechas 



**Definición de Terminado (Definition of Done)**

Una historia de usuario se considerará terminada cuando:

1. Cumpla con todos los criterios de aceptación establecidos. 

2. La funcionalidad esté completamente integrada con el resto del sistema. 

3. Se hayan realizado pruebas funcionales y no existan errores críticos. 

4. El código haya sido revisado por otro integrante del equipo antes de integrarse al repositorio principal. 

5. La documentación correspondiente se encuentre actualizada. 

6. La funcionalidad esté lista para ser presentada durante la demostración final del proyecto.


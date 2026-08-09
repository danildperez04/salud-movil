**Plan SCRUM y estrategia de versionado**

**Tabla 1.**

**Equipo Scrum. **

| **Integrante** | **Rol Scrum** | **Responsabilidades** |
| - | - | - |
| **Freddy Mairena** | Product Owner y Comunicador | Define las prioridades del backlog, coordina el proyecto, verifica el cumplimiento del cronograma, organiza reuniones, supervisa la documentación y representa al equipo durante la presentación del proyecto. |
| **Danild Pérez** | Scrum Master y Desarrollador Backend | Organiza las ceremonias Scrum, da seguimiento al tablero de Trello, elimina impedimentos y desarrolla el backend, la base de datos, las API y la seguridad del sistema. |
| **Julio Reyes** | Desarrollador Frontend, UX y Analista de Datos | Diseña la experiencia de usuario, desarrolla las interfaces de la aplicación, integra el frontend con el backend y analiza la información generada por el sistema. |
| **Joshua Ochoa** | Diseñador UI y Diseñador de Marca | Diseña la identidad visual del proyecto, crea los wireframes, prototipos, logotipo, manual de identidad y garantiza la coherencia gráfica de la aplicación. |
| **Eliva Lovo** | Mercadóloga | Realiza el estudio de mercado, desarrolla la propuesta de valor, define la estrategia de difusión, analiza aplicaciones similares y valida la aceptación del producto. |




**2. Reuniones Scrum**

**Tabla 2.**

**Definición de Reuniones **

| **Reunión ** | **Frecuencia** | **Duración** | **Participantes** | **Objetivo** |
| - | - | - | - | - |
| **Sprint Planning** | Inicio de cada sprint | 1 hora | Todo el equipo | Definir las historias de usuario que se desarrollarán durante el sprint y distribuir las tareas. |
| **Daily Scrum** | Lunes, miércoles y viernes | 15 minutos | Equipo de desarrollo | Compartir avances, dificultades y actividades pendientes. |
| **Backlog Refinement** | Mitad del sprint | 30 minutos | Product Owner y equipo | Revisar y actualizar el backlog antes del siguiente sprint. |
| **Sprint Review** | Final del sprint | 45 minutos | Todo el equipo | Presentar los avances y validar que las historias cumplan con los criterios de aceptación. |
| **Sprint Retrospective** | Final del sprint | 30 minutos | Todo el equipo | Analizar los resultados obtenidos e identificar oportunidades de mejora. |


**3. Planificación de Sprints**

**Tabla 3.**

**Entrega de Sprint – SALUD MOVIL **

| **Sprint** | **Fechas** | **Actividades principales** | **Responsables** |
| - | - | - | - |
| **Sprint 1** | **20 de julio – 27 de julio** | Configuración del proyecto, Git/GitHub, README técnico, diagramación de la base de datos y planificación inicial. | Freddy, Danild y Julio |
| **Sprint 2** | **28 de julio – 10 de agosto** | Desarrollo de la propuesta de valor, estrategia de canales, reglas de identidad visual, wireframes, autenticación, gestión de usuarios, registro de pacientes y expediente clínico. | Eliva, Joshua, Danild y Julio |
| **Sprint 3** | **11 de agosto – 17 de agosto** | Desarrollo de UX/UI, monitoreo de indicadores de salud, historial clínico y gestión de citas. | Joshua, Julio y Danild |
| **Sprint 4** | **18 de agosto – 24 de agosto** | Seguridad, buenas prácticas, plan financiero, objetivos SMART, recordatorios de medicamentos y citas, integración del sistema. | Todo el equipo |
| **Sprint 5** | **25 de agosto – 1 de septiembre** | Pruebas finales, corrección de errores, documentación, ejecución de la solución, push a main, preparación del pitch y presentación final. | Todo el equipo |
| **Entrega** | **2 de septiembre** | Presentación oficial del proyecto. | Todo el equipo |


**4. Estrategia de Versionado**

**Tabla 4. **

**Versiones de SALUD MOVIL **

| **Rama** | **Propósito** |
| - | - |
| **main** | Contiene la versión estable del proyecto lista para su presentación. |
| **develop** | Rama principal de integración donde se unen todas las funcionalidades desarrolladas. |
| **feature/HU-XX** | Rama creada para desarrollar cada historia de usuario individualmente. |
| **release/v0.X.0** | Preparación de una versión estable antes de la entrega de cada sprint importante. |
| **hotfix/** | Corrección de errores críticos detectados después de una integración. |





**Tabla 5.**

**Convención de Commits**

| **Prefijo** | **Uso** |
| - | - |
| **feat** | Nueva funcionalidad |
| **fix** | Corrección de errores |
| **docs** | Documentación |
| **refactor** | Mejoras internas del código |
| **test** | Pruebas |
| **chore** | Configuración o mantenimiento |


**Versionado Semántico**

Durante el desarrollo del MVP se utilizará la nomenclatura **MAJOR.MINOR.PATCH**, iniciando con la versión **0.1.0** hasta alcanzar la versión **1.0.0**, correspondiente al MVP completamente funcional.

**Tabla 6.**

**Versionado semántico según MVP **

| **Versión** | **Fecha estimada** | **Contenido** |
| - | - | - |
| **v0.1.0** | 27 de julio | Configuración inicial, repositorio, README técnico y base de datos. |
| **v0.2.0** | 9 de agosto | Autenticación y gestión de usuarios. |
| **v0.3.0** | 16 de agosto | Registro de pacientes, expediente clínico y monitoreo de indicadores. |
| **v0.4.0** | 24 de agosto | Gestión de citas, recordatorios y medicación. |
| **v0.5.0** | 28 de agosto | Panel web del personal de salud: registro de cuentas y asignación de pacientes a su centro de salud. |
| **v1.0.0** | **1 de septiembre** | MVP completo, pruebas finales y versión lista para la presentación del proyecto (2 de septiembre). |



**5. Flujo de trabajo por historia de usuario y funcionalidades futuras**

Con el propósito de mantener un desarrollo organizado, colaborativo y alineado con la metodología Scrum, cada historia de usuario seguirá un flujo de trabajo definido que facilitará la integración del código, el control de versiones y la validación de las funcionalidades antes de incorporarlas a la versión principal del sistema.

**Flujo de trabajo por historia de usuario**

1. Crear una rama **feature/HU-XX-descripción** a partir de la rama **develop**. 

2. Desarrollar la funcionalidad asignada realizando los commits siguiendo la convención **Conventional Commits**. 

3. Al finalizar el desarrollo, crear un **Pull Request** hacia la rama **develop**. 

4. El código será revisado por al menos un integrante del equipo antes de aprobar la integración. 

5. Una vez aprobado el Pull Request, la rama **feature** será fusionada con **develop** y posteriormente eliminada. 

6. Al finalizar cada sprint o conjunto de funcionalidades importantes, se creará una rama **release/vX.Y.0** para realizar pruebas de integración y corregir posibles errores. 

7. Cuando la versión sea considerada estable, la rama **release** será fusionada con **main** y se asignará la etiqueta correspondiente según el versionado semántico. 

Una vez completadas las funcionalidades definidas para el **Producto Mínimo Viable (MVP)**, y siempre que el equipo logre avanzar más rápido de lo planificado antes de la fecha de entrega (**2 de septiembre**), se contempla incorporar nuevas funcionalidades que incrementen el valor de la solución y fortalezcan la propuesta presentada.





**6. Funcionalidades futuras (Valor agregado)**

**Tabla 7.**

**Extras que generan valor agregado más allá del reto **

| **No.** | **Funcionalidad** | **Descripción** | **Condición de implementación** |
| - | - | - | - |
| **1** | Índice de Prioridad de Control del Paciente (IPCP) | Incorporación de un modelo basado en inteligencia artificial que analice el cumplimiento del tratamiento y los indicadores de salud para clasificar automáticamente el nivel de riesgo del paciente mediante un sistema de semáforo (verde, amarillo y rojo). | Se implementará únicamente si el MVP se completa antes de lo previsto. |
| **2** | Sistema de alertas inteligentes | Generación automática de alertas cuando los indicadores registrados se encuentren fuera de los rangos normales o cuando exista incumplimiento de medicamentos o citas médicas. | Se implementará únicamente si el MVP se completa antes de lo previsto. |
| **3** | Sistema de recompensas o gamificación | Implementación de un sistema de puntos, insignias y reconocimientos que incentive el cumplimiento del tratamiento, la asistencia a citas médicas y el registro constante de indicadores de salud. | Se implementará únicamente si el MVP se completa antes de lo previsto. |

**Nota:** Estas funcionalidades no forman parte del alcance del **Producto Mínimo Viable (MVP)** establecido para el proyecto. Su desarrollo dependerá del avance del equipo durante la ejecución del cronograma. En caso de finalizar las funcionalidades planificadas antes del 2 de septiembre, estas mejoras serán incorporadas como un valor agregado, incrementando el nivel de innovación, funcionalidad e impacto de la aplicación Salud Movil.


**1. PRD (Product Requirements Document)**

**Documento de Requisitos del Producto (PRD)**

**Nombre del producto:** Salud Móvil

**Objetivo del producto**  
Desarrollar una aplicación móvil que facilite el seguimiento de pacientes con enfermedades crónicas o discapacidad mediante el registro de información médica, monitoreo de indicadores de salud, gestión de citas y recordatorios de medicamentos.

**Usuarios**

- Pacientes. 

- Familiares o cuidadores. 

- Personal médico. 

- Administrador. 

**Funcionalidades principales**

- Registro de pacientes. 

- Historial clínico digital. 

- Registro de signos vitales. 

- Recordatorios de medicamentos. 

- Gestión de citas médicas. 

- Recordatorios de citas. 

- Integración del expediente clínico. 

- Panel para el personal médico. 

**Requisitos no funcionales**

- Interfaz sencilla. 

- Seguridad de los datos. 

- Disponibilidad 24/7. 

- Acceso desde dispositivos Android. 

- Buen rendimiento. 

**2. MVP (Minimum Viable Product)**

**Producto Mínimo Viable**

El MVP de **Salud Móvil** corresponde a la primera versión funcional de la aplicación, la cual incorpora únicamente las funciones esenciales para resolver el problema del seguimiento de pacientes.

Incluye:

- Autenticación y gestión de usuarios (registro de cuenta, inicio de sesión, perfil y creación de cuentas del personal de salud). 

- Registro y gestión de pacientes y vinculación de cuidadores. 

- Historial clínico y expediente digital. 

- Registro de presión arterial, glucosa, peso y temperatura. 

- Recordatorios de medicamentos. 

- Gestión de citas. 

- Recordatorios de citas. 

- Consulta del expediente clínico. 

- Panel web básico: registro de cuentas del personal de salud y asignación de pacientes a su centro de salud. 

Las funcionalidades avanzadas, como inteligencia artificial, alertas inteligentes, sistema de recompensas y las funciones avanzadas del panel web, pueden implementarse en versiones posteriores.

**Flujo de roles y creación de cuentas**

El sistema maneja cuatro roles: **administrador**, **personal de salud**, **paciente** y **cuidador**. Tanto pacientes como cuidadores y personal de salud requieren una cuenta de usuario para acceder a la aplicación. El flujo de creación y vinculación es el siguiente:

1. **El administrador crea las cuentas del personal de salud** (HU-01): registra al personal con su rol, especialidad, licencia y centro de salud, y le entrega las credenciales de acceso.
2. **El personal de salud registra al paciente** (HU-06): al registrar se crea la cuenta de usuario y el perfil clínico del paciente (fecha de nacimiento, género y centro de salud); se le entregan credenciales para que el paciente acceda a la app. El paciente no se registra por sí mismo.
3. **El cuidador se registra por su cuenta** (HU-02) y el personal de salud registra su vínculo con el paciente (HU-05), indicando el parentesco y si es cuidador principal. El vínculo se crea en el centro de salud para evitar accesos no autorizados a información clínica.
4. **La asignación de pacientes al personal es implícita por centro de salud** (HU-28 y HU-29): el personal de salud visualiza los pacientes registrados en su centro; el administrador asigna el paciente a un centro al momento de su registro.

**Reglas de acceso por rol:** el paciente únicamente consulta su propia información; el cuidador consulta la de los pacientes con los que está vinculado; el personal de salud consulta la de los pacientes de su centro de salud.

**3. Metodología MoSCoW**

**Priorización de requisitos mediante MoSCoW**

| **Categoría** | **Funcionalidades** |
| - | - |
| **Must Have (Debe tener)** | Autenticación (registro de cuenta e inicio de sesión), gestión de usuarios, registro y gestión de pacientes, expediente clínico, monitoreo de salud, gestión de citas, recordatorios de medicamentos y citas, panel web básico (registro de cuentas y asignación de pacientes a su centro). |
| **Should Have (Debería tener)** | Restablecimiento de contraseña, perfil y cierre de sesión, gráficas de indicadores, corrección de registros, estado de citas (completada/no asistió), confirmación de toma de medicamentos. |
| **Could Have (Podría tener)** | Panel web avanzado (consulta de expediente e indicadores en línea), sistema de recompensas, inteligencia artificial, recomendaciones personalizadas. |
| **Won't Have (No tendrá por ahora)** | Videoconsultas, integración con dispositivos médicos inteligentes, recetas electrónicas automáticas. |



**MVP (Producto Mínimo Viable)- Explicación **

El MVP de **Salud Móvil** estará conformado por las funcionalidades esenciales que permitan demostrar el funcionamiento de la solución y cumplir con los requisitos mínimos del reto.

**1. Autenticación y gestión de usuarios**

- Creación de cuentas del personal de salud por el administrador (HU-01). 

- Registro de cuenta de paciente o cuidador (HU-02). 

- Inicio de sesión seguro (HU-03). 

- Restablecimiento de contraseña (HU-04). 

- Perfil del usuario y cierre de sesión (HU-08). 

**2. Registro y gestión de pacientes**

- Registro de pacientes (HU-06). 

- Búsqueda y edición de pacientes (HU-07). 

- Vinculación de cuidadores a uno o varios pacientes (HU-05). 

**3. Historial clínico digital**

- Expediente clínico maestro (diagnóstico principal, historial, alergias) (HU-09). 

- Registro de consultas médicas (HU-10). 

- Consulta del historial clínico cronológico (HU-11). 

- Visualización del expediente clínico digital por el paciente (HU-12). 

**4. Monitoreo de la salud**

- Registro de presión arterial. 

- Registro de glucosa. 

- Registro de peso. 

- Registro de temperatura. 

- Visualización del historial de indicadores en lista y gráficas (HU-13 a HU-15). 

- Indicadores recientes visibles para el personal de salud (HU-16). 

**5. Gestión de medicamentos**

- Registro de medicamentos (HU-23). 

- Configuración de horarios y días de toma (HU-24). 

- Recordatorios automáticos locales para la toma de medicamentos (HU-25). 

- Confirmación de toma de medicamentos (HU-26). 

**6. Gestión de citas médicas**

- Registro de citas (HU-18). 

- Modificación y cancelación de citas (HU-19, HU-20). 

- Consulta de próximas citas (HU-21). 

- Estado de la cita: completada o no asistió (HU-22). 

- Recordatorios automáticos antes de cada consulta (HU-27). 

**7. Panel principal (Dashboard)**

- Resumen del estado del paciente. 

- Próximos medicamentos. 

- Próximas citas. 

- Últimos registros de salud. 

**8. Panel web del personal de salud (funciones básicas)**

- Registro de cuentas del personal de salud (admin). 

- Asignación de pacientes a su centro de salud (HU-28). 

- Listado de pacientes del centro de salud (HU-29). 

**Alcance**

**Tabla 1.**

**Incluido**

| **No.** | **Funcionalidad** | **Plataforma** | **Descripción** |
| - | - | - | - |
| **1** | Autenticación y gestión de usuarios | App móvil + Web | Registro de cuenta (paciente/cuidador), inicio de sesión, perfil y creación de cuentas del personal de salud por el administrador. |
| **2** | Registro y gestión de pacientes | App móvil | Registro, búsqueda y edición de pacientes; vinculación de cuidadores con tipo de parentesco. |
| **3** | Expediente clínico único | App móvil + Web | Consulta del historial clínico, diagnósticos e indicadores desde un único expediente digital. |
| **4** | Monitoreo de indicadores de salud | App móvil | Registro de presión arterial, glucosa, peso y temperatura, con historial y visualización mediante lista y gráficas. |
| **5** | Gestión de citas médicas | App móvil + Web | Creación, consulta y administración de citas por parte del personal de salud, visibles para el paciente. |
| **6** | Recordatorios de citas | App móvil | Envío de notificaciones locales antes de cada cita médica programada. |
| **7** | Recordatorios de medicamentos | App móvil | Envío de notificaciones locales configurables según el horario y frecuencia del tratamiento. |
| **8** | Panel para personal de salud | Web | Funciones básicas: registro de cuentas del personal de salud y asignación de pacientes a su centro de salud. |


**Funcionalidades futuras – Extra para la propuesta de Valor**

- Panel web avanzado (consulta de expediente clínico e indicadores en línea). 

- Índice de Prioridad de Control del Paciente (IPCP) mediante inteligencia artificial. 

- Sistema de alertas inteligentes basado en valores fuera de los rangos normales. 

- Sistema de recompensas o gamificación para incentivar la adherencia al tratamiento. 

- Integración con el expediente clínico nacional del MINSA. 

**Justificación**: Estas funcionalidades requieren contar previamente con un flujo estable de datos clínicos, citas y tratamientos. Implementarlas en una etapa posterior permitirá garantizar el correcto funcionamiento de las funciones esenciales antes de incorporar herramientas avanzadas.

**Tabla 2.**

**Requisitos funcionales**

| **No.** | **Requisito** | **Prioridad** |
| :-: | :-: | :-: |
| **1** | El sistema debe permitir al administrador crear cuentas de usuario para el personal de salud con su rol y centro de salud. | Alta |
| **2** | El sistema debe permitir el registro de cuentas de paciente o cuidador y el inicio de sesión seguro. | Alta |
| **3** | El sistema debe permitir al usuario restablecer su contraseña. | Media |
| **4** | El sistema debe permitir vincular uno o más cuidadores o familiares a un paciente, registrando el parentesco. | Media |
| **5** | El sistema debe permitir registrar pacientes con datos básicos (nombre, fecha de nacimiento, diagnóstico principal, teléfono, dirección y centro de salud). | Alta |
| **6** | El sistema debe permitir buscar y editar los datos de un paciente. | Media |
| **7** | El sistema debe permitir registrar y consultar el expediente clínico del paciente (diagnóstico principal, historial, alergias y grupo sanguíneo). | Alta |
| **8** | El sistema debe permitir registrar consultas médicas (diagnóstico, observaciones, tratamiento y fecha) y mostrarlas en orden cronológico. | Alta |
| **9** | El paciente únicamente puede consultar su propia información clínica. | Alta |
| **10** | El sistema debe permitir registrar indicadores de salud (presión arterial, glucosa, peso y temperatura) con fecha y hora. | Alta |
| **11** | El sistema debe mostrar el historial de indicadores en formato de lista o gráfica. | Media |
| **12** | El sistema debe mostrar al personal de salud los indicadores más recientes de los pacientes de su centro de salud. | Alta |
| **13** | El sistema debe permitir crear, editar, cancelar y actualizar el estado de las citas médicas. | Alta |
| **14** | El sistema debe mostrar al paciente sus próximas citas ordenadas por fecha. | Media |
| **15** | El sistema debe enviar recordatorios de citas y de medicamentos mediante notificaciones locales según el horario configurado. | Alta |
| **16** | El sistema debe permitir configurar horarios y días de toma de cada medicamento y registrar la confirmación de la toma. | Alta |
| **17** | El sistema debe mostrar al personal de salud el listado de pacientes de su centro de salud. | Alta |
| **18** | El administrador debe poder asignar cada paciente a su centro de salud. | Alta |

**Nota.** Estos requisitos son aquellas acciones que hace la App. 




**Tabla 3.**

**Requisitos no funcionales**

| **No.** | **Requisito** |
| - | - |
| **1** | La aplicación móvil debe funcionar en Android e iOS mediante Expo y React Native. |
| **2** | Las contraseñas se almacenan cifradas (hash) y la información sensible se protege mediante autenticación y control de acceso basado en roles. |
| **3** | El sistema debe garantizar el acceso a la información según el rol del usuario (paciente, cuidador, personal de salud o administrador). |
| **4** | Las notificaciones locales deben dispararse de acuerdo con la hora programada (margen de error menor a cinco minutos). |
| **5** | El portal web debe ser responsivo y adaptable a computadoras y tabletas utilizadas en centros de salud. |
| **6** | La API debe implementar autenticación mediante JWT y control de acceso basado en roles (RBAC). |

**Nota.** Estos requisitos describen como debe funcionar la App. 

**Historias de usuario**

- Como paciente, quiero recibir un recordatorio antes de mi cita médica para no olvidarla. 

- Como paciente, quiero registrar diariamente mi presión arterial para llevar un control de mi salud. 

- Como cuidador, quiero consultar el historial de indicadores de mi familiar para darle seguimiento a su tratamiento. 

- Como personal de salud, quiero visualizar el listado de pacientes con sus indicadores más recientes para priorizar la atención. 

- Como personal de salud, quiero consultar el expediente clínico completo de un paciente para tomar mejores decisiones médicas. 

- Como administrador, quiero crear cuentas de usuario para el personal de salud para que puedan acceder al sistema y atender pacientes. 

**Tabla 4.**

**Arquitectura y stack tecnológico**

| **No.** | **Componente** | **Tecnología** |
| - | - | - |
| **1** | Aplicación móvil | Expo + React Native |
| **2** | Portal web | React + TypeScript |
| **3** | Backend / API | NestJS + TypeORM |
| **4** | Base de datos | PostgreSQL |
| **5** | Notificaciones | Expo Notifications (local en el MVP); Firebase Cloud Messaging (mejora futura) |
| **6** | Autenticación | JWT con control de acceso basado en roles (RBAC) |


**Riesgos y supuestos**

**Supuestos**

1. Se contará con la colaboración de al menos un centro de salud piloto para validar el funcionamiento de la aplicación con usuarios reales. Esto permitirá realizar pruebas, recopilar retroalimentación y efectuar mejoras antes de su implementación a mayor escala. 

**Riesgos**

1. La limitada conectividad a Internet en zonas rurales puede afectar el registro y la sincronización de la información de los pacientes en tiempo real. Como medida de mitigación, se contempla incorporar en futuras versiones un modo de funcionamiento sin conexión (offline), que permita almacenar los datos localmente y sincronizarlos cuando exista acceso a Internet. 

2. La información médica que gestionará el sistema es altamente sensible, por lo que existe el riesgo de accesos no autorizados o vulneración de datos. Para reducir este riesgo, desde la primera versión se implementarán mecanismos de seguridad, como el cifrado de la información, la autenticación de usuarios y el control de acceso basado en roles, garantizando la confidencialidad, integridad y disponibilidad de los datos. 


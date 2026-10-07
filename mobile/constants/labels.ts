// constants/labels.ts

// ⚠️ PENDIENTE DE CONFIRMAR: el Figma muestra "Confirmada"/"Pendiente",
// pero cat_appointment_state en la BD tiene Scheduled/Cancelled/Completed/No show.
// No existe un estado "Pendiente" en el catálogo real. Mapeo tentativo abajo —
// confirmar con el equipo antes de usar esto en la pantalla de citas real.
export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  Scheduled: 'Confirmada',
  Cancelled: 'Cancelada',
  Completed: 'Completada',
  'No show': 'No asistió',
  // ⚠️ "Pending" NO existe en cat_appointment_state real — clave usada
  // únicamente en datos mock, hasta que el equipo confirme el estado real.
  Pending: 'Pendiente',
};

// cat_frequency de la BD → label en español para mostrar en ReminderCard
export const FREQUENCY_LABELS: Record<string, string> = {
  Daily: 'Todos los días',
  'Every 8 hours': 'Cada 8 horas',
  'Every 12 hours': 'Cada 12 horas',
  Weekly: 'Semanal',
  'As needed': 'Según necesidad',
};

// cat_type_indicator.name viene en inglés de la BD real, pero el Figma
// muestra los nombres en español. Traducción centralizada acá.
export const INDICATOR_TYPE_LABELS: Record<string, string> = {
  'Blood pressure': 'Presión arterial',
  Glucose: 'Glucosa',
  Weight: 'Peso',
  Temperature: 'Temperatura',
};

// Estados de indicadores de salud (normal/bajo/alto). No viene de un catálogo
// de la BD — es lógica de rango que definimos en frontend (o futuro backend).
export const INDICATOR_STATUS_LABELS = {
  normal: 'Normal',
  low: 'Bajo',
  high: 'Alto',
} as const;

// Labels de los 4 tabs del Bottom Navigation Bar
export const TAB_LABELS = {
  home: 'Home',
  appointments: 'Citas',
  medications: 'Medicamentos',
  more: 'Más',
} as const;

// Títulos de header de las pantallas internas (las que se abren en Stack
// por encima de los tabs). Toda pantalla nueva debe sumar su título acá,
// no hardcodearlo directo en el componente.
export const SCREEN_TITLES = {
  healthIndicators: 'Indicadores de Salud',
  indicatorHistory: 'Historial de Indicadores',
  indicatorEvolution: 'Evolución',
  appointments: 'Citas Médicas',
  appointmentDetail: 'Detalle de cita',
  appointmentForm: 'Agendar Cita',
  medications: 'Medicamentos',
  medicationForm: 'Agregar Medicamento',
  reminders: 'Recordatorios',
  medicalRecord: 'Expediente clinico',
} as const;

// Pantalla de bienvenida — TODO: falta el texto real del Figma de onboarding
// (no se compartió esa pantalla todavía), esto es placeholder.
export const ONBOARDING_LABELS = {
  brand: 'Salud Móvil',
  description: 'La forma mas fácil de cuidar tu salud y la de los que amas.',
  cta: 'Comenzar',
  welcomePrefix: 'Bienvenido a',
} as const;

// Texto exacto del Figma (pantalla "Inicio de Sesión")
export const LOGIN_LABELS = {
  brand: 'Salud Móvil',
  tagline: 'Tu salud, en tus manos',
  title: 'Inicio de Sesión',
  subtitle: 'Ingresa tus datos para continuar',
  emailLabel: 'Correo electrónico',
  emailPlaceholder: 'tu@email.com',
  passwordLabel: 'Contraseña',
  forgotPassword: '¿Olvidaste tu contraseña?',
  submit: 'Iniciar Sesión',
  emailRequired: 'Ingresá tu correo',
  emailInvalid: 'Correo inválido',
  passwordRequired: 'Ingresá tu contraseña',
  invalidCredentials: 'Correo o contraseña incorrectos',
} as const;

// Texto exacto del Figma (pantalla Home)
export const HOME_LABELS = {
  greetingPrefix: 'Hola,',
  statusTitle: 'Tu estado de hoy',
  statusHeadline: '¡Vas por buen camino!',
  statusSubtitle: 'Sigue así, mantén tus hábitos saludables',
  quickActions: {
    appointments: { title: 'Citas', subtitle: 'Agenda y gestión' },
    medications: { title: 'Medicamentos', subtitle: 'Control y recetas' },
    indicators: { title: 'Indicadores', subtitle: 'Métricas de salud' },
    medicalRecord: { title: 'Expediente', subtitle: 'Historial clínico' },
  },
} as const;

// Tabs "Resumen"/"Historial" — se repite en Indicadores, Citas y Medicamentos
export const SUMMARY_TABS_LABELS = {
  summary: 'Resumen',
  history: 'Historial',
  historyPlaceholder: 'El historial estará disponible próximamente',
} as const;

export const HEALTH_INDICATORS_LABELS = {
  registerButton: 'Registrar nuevo indicador',
  currentStatus: 'Estado actual',
  noReferenceRange: 'Sin rango de referencia',
  editButton: 'Editar',
  hint: 'Toca un indicador para ver cómo ha evolucionado.',
  updatedPrefix: 'Actualizado',
} as const;

export const INDICATOR_HISTORY_LABELS = {
  ranges: { '7d': '7 días', '30d': '30 días', '3m': '3 meses' },
  trends: { stable: 'Estable', rising: 'En aumento', falling: 'En descenso' },
  stats: { average: 'Promedio', min: 'Mínimo', max: 'Máximo' },
  // el gráfico usa un solo valor por medición; se aclara cuando el indicador tiene más de uno
  seriesNotes: { 'Blood pressure': 'Se grafica la presión sistólica (el primer valor).' } as Record<
    string,
    string
  >,
  recentTitle: 'Mediciones recientes',
  register: '+ Registrar',
  noNotes: 'Sin observaciones',
  emptyRange: 'No hay mediciones en este período',
  notFound: 'No encontramos este indicador',
  chartSummary: (count: number, min: string, max: string) =>
    `${count} ${count === 1 ? 'medición' : 'mediciones'}, entre ${min} y ${max}`,
} as const;

export const INDICATOR_EVOLUTION_LABELS = {
  latestTitle: 'Última medición',
  statusDescriptions: {
    normal: 'Dentro del rango esperado.',
    low: 'Por debajo del rango esperado.',
    high: 'Por encima del rango esperado.',
  },
  trendTitle: 'Tendencia',
  trendPeriod: 'Últimos 30 días',
  viewHistory: 'Ver historial',
  interpretationTitle: 'Interpretación orientativa',
  interpretations: {
    stable: 'Los valores recientes se mantienen estables. Continúa registrando tus mediciones.',
    rising:
      'Los valores recientes van en aumento. Continúa registrando tus mediciones y coméntalo con tu médico si persiste.',
    falling:
      'Los valores recientes van en descenso. Continúa registrando tus mediciones y coméntalo con tu médico si persiste.',
    insufficient: 'Aún no hay suficientes mediciones para ver una tendencia. Sigue registrando.',
  },
  newMeasurement: 'Nueva medición',
  empty: 'Aún no tienes mediciones de este indicador',
} as const;

export const REGISTER_INDICATOR_LABELS = {
  title: 'Registrar Indicador',
  introTitle: 'Nueva medición',
  introDescription:
    'Selecciona el indicador y registra el valor. Puedes llevar un control más completo de tu salud desde un solo lugar.',
  typeLabel: 'Tipo de indicador',
  typePlaceholder: 'Indicador',
  valueLabel: 'Valor',
  systolicLabel: 'Sistólica',
  diastolicLabel: 'Diastólica',
  dateLabel: 'Fecha',
  timeLabel: 'Hora',
  notesLabel: 'Notas (opcional)',
  submitButton: 'Nuevo indicador',
} as const;

export const APPOINTMENTS_LABELS = {
  bookButton: 'Agendar cita',
  formTitle: 'Agendar Cita',
  specialtyLabel: 'Especialidad',
  specialtyPlaceholder: 'Seleccione una especialidad',
  professionalLabel: 'Profesional',
  professionalPlaceholder: 'Seleccione un profesional',
  dateLabel: 'Fecha',
  datePlaceholder: 'Seleccione una fecha',
  timeLabel: 'Hora',
  timePlaceholder: 'Seleccione una hora',
  reasonLabel: 'Motivo de la consulta',
  reasonPlaceholder: 'Describe brevemente el motivo',
  submit: 'Confirmar cita',
  stepperSteps: ['Especialidad', 'Profesional', 'Fecha', 'Confirmar'],
  infoTitle: 'Información',
  placeLabel: 'Lugar',
  reminderTitle: 'Recordatorio',
  reminderSubtitle: 'Notificarme antes de esta cita',
  directionsButton: 'Cómo llegar',
  cancelButton: 'Cancelar cita',
  cancelConfirmTitle: '¿Cancelar cita?',
  cancelConfirmMessage: 'Esta acción no se puede deshacer.',
  cancelConfirmKeep: 'Mantener cita',
  cancelError: 'No se pudo cancelar la cita. Intentá de nuevo.',
  notFound: 'No encontramos esta cita',
} as const;

export const MEDICATIONS_LABELS = {
  tipTitle: 'Toma tus medicamentos',
  tipSubtitle: '¡No olvides tomar tus medicamentos a tiempo!',
  addButton: 'Agregar medicamento',
  empty: 'Aún no tienes medicamentos registrados',
  nameLabel: 'Nombre del medicamento',
  namePlaceholder: 'Ej: Losartán',
  doseLabel: 'Dosis',
  dosePlaceholder: 'Ej: 50mg',
  quantityLabel: 'Cantidad por toma',
  quantityPlaceholder: 'Ej: 1 tableta',
  timeLabel: 'Hora de la toma',
  submit: 'Guardar medicamento',
  createError: 'No se pudo guardar el medicamento. Intentá de nuevo.',
} as const;

// Roles de `user.role` (types/auth.ts) -> texto visible
export const ROLE_LABELS: Record<string, string> = {
  patient: 'Paciente',
  caregiver: 'Cuidador/a',
  health_staff: 'Personal de salud',
  admin: 'Administrador',
};

// Pantalla "Más". Las entradas sin ruta todavía se muestran con la etiqueta `comingSoon`.
export const MORE_LABELS = {
  title: 'Más',
  fallbackName: 'Usuario',
  comingSoon: 'Pronto',
  logout: 'Cerrar sesión',
  ipcp: {
    title: 'IPCP · Mi prioridad',
    description: 'Evaluación ampliada de síntomas, evolución y señales de alerta.',
    cta: 'Evaluación IPCP',
  },
  sections: {
    health: 'Salud y seguimiento',
    services: 'Servicios complementarios',
    accessibility: 'Accesibilidad e inclusión',
    preferences: 'Preferencias',
    help: 'Ayuda y seguridad',
  },
  items: {
    reminders: { title: 'Recordatorios', subtitle: 'Medicamentos y citas' },
    medicalRecord: { title: 'Expediente clínico', subtitle: 'Diagnósticos, alergias y documentos' },
    indicators: { title: 'Indicadores de salud', subtitle: 'Presión, glucosa, peso y más' },
    activity: { title: 'Actividad física', subtitle: 'Registra tu ejercicio para el seguimiento' },
    scanner: { title: 'Escáner de medicamentos', subtitle: 'Identifica caja, uso y advertencias' },
    voice: { title: 'Asistente por voz', subtitle: 'Habla en lugar de escribir' },
    referral: {
      title: 'Sistema de referencia',
      subtitle: 'Te orienta al centro con el servicio que necesitas',
    },
    waitTimes: { title: 'Estimación de espera', subtitle: 'Compara tiempos de atención' },
    healthMap: {
      title: 'Mapa de recursos sanitarios',
      subtitle: 'Hospitales, farmacias y laboratorios',
    },
    accessibilityCenter: {
      title: 'Centro de accesibilidad',
      subtitle: 'Texto, contraste, movimiento y lectura',
    },
    language: { title: 'Idioma', subtitle: 'Español y lenguas de la Costa Caribe' },
    notifications: { title: 'Notificaciones', subtitle: 'Medicamentos, citas y salud' },
    privacy: { title: 'Privacidad y seguridad', subtitle: 'Acceso y protección de datos' },
    emergency: { title: 'Modo emergencia', subtitle: 'Información médica, contactos y ubicación' },
    support: { title: 'Ayuda y soporte', subtitle: 'Preguntas frecuentes y contacto' },
  },
} as const;

// Textos generales reutilizables en toda la app
export const COMMON_LABELS = {
  loading: 'Cargando...',
  retry: 'Reintentar',
  save: 'Guardar',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  noData: 'No hay datos para mostrar',
  networkError: 'No se pudo conectar. Revisá tu conexión e intentá de nuevo',
} as const;

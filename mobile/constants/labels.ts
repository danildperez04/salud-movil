// constants/labels.ts

// ⚠️ PENDIENTE DE CONFIRMAR: el Figma muestra "Confirmada"/"Pendiente",
// pero cat_appointment_state en la BD tiene Scheduled/Cancelled/Completed/No show.
// No existe un estado "Pendiente" en el catálogo real. Mapeo tentativo abajo —
// confirmar con el equipo antes de usar esto en la pantalla de citas real.
export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  Scheduled: 'Confirmada', // ⚠️ mapeo tentativo, revisar
  Cancelled: 'Cancelada',
  Completed: 'Completada',
  'No show': 'No asistió',
  // ⚠️ "Pending" NO existe en cat_appointment_state real — clave usada
  // únicamente en datos mock, hasta que el equipo confirme el estado real.
  Pending: 'Pendiente',
};

export const APPOINTMENT_STATUS_VARIANT: Record<string, 'secondary' | 'destructive' | 'outline'> = {
  Scheduled: 'secondary',
  Cancelled: 'destructive',
  Completed: 'outline',
  'No show': 'destructive',
  Pending: 'outline',
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

export const INDICATOR_STATUS_VARIANT = {
  normal: 'secondary',
  low: 'outline',
  high: 'destructive',
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
  appointments: 'Citas Medicas',
  appointmentForm: 'Agendar Cita',
  medications: 'Medicamentos',
  reminders: 'Recordatorios',
  medicalRecord: 'Expediente clinico',
} as const;

// Pantalla de bienvenida — TODO: falta el texto real del Figma de onboarding
// (no se compartió esa pantalla todavía), esto es placeholder.
export const ONBOARDING_LABELS = {
  brand: 'Salud Móvil',
  description: 'Seguimiento de pacientes, indicadores de salud y recordatorios de medicamentos',
  cta: 'Comenzar',
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
} as const;

export const HEALTH_INDICATORS_LABELS = {
  registerButton: 'Registrar nuevo indicador',
  historyPlaceholder: 'El historial estará disponible próximamente',
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
} as const;

export const MEDICATIONS_LABELS = {
  tipTitle: 'Toma tus medicamentos',
  tipSubtitle: '¡No olvides tomar tus medicamentos a tiempo!',
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

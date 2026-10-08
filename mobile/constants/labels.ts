// constants/labels.ts
import type { LanguageCode } from '@/types/preferences';

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
  medicationScanner: 'Escáner de medicamentos',
  reminders: 'Recordatorios',
  medicationReminder: 'Recordatorio de medicamento',
  appointmentReminder: 'Recordatorio de cita',
  // expediente clínico
  medicalRecord: 'Expediente clínico',
  clinicalSummary: 'Resumen clínico',
  diagnosis: 'Diagnóstico',
  diagnosisForm: 'Agregar diagnóstico',
  history: 'Antecedentes',
  historyForm: 'Agregar antecedente',
  allergies: 'Alergias',
  allergyForm: 'Agregar alergia',
  documents: 'Documentos',
  documentDetail: 'Documento',
  documentUpload: 'Subir documento',
  labs: 'Laboratorios',
  labScan: 'Escanear laboratorio',
  labDetail: 'Examen escaneado',
  // cuenta y preferencias
  register: 'Crear usuario',
  profile: 'Mi cuenta',
  notifications: 'Notificaciones',
  notificationSettings: 'Notificaciones',
  security: 'Privacidad y seguridad',
  changePassword: 'Cambiar contraseña',
  biometric: 'Acceso biométrico',
  devices: 'Dispositivos vinculados',
  accessibility: 'Accesibilidad',
  language: 'Idioma y multilenguaje',
  // servicios complementarios
  activity: 'Actividad física',
  voiceAssistant: 'Asistente por voz',
  ipcp: 'IPCP · Mi prioridad',
  referral: 'Sistema de referencia',
  hospitalGuide: 'Guía dentro del hospital',
  waitTimes: 'Estimación de espera',
  healthMap: 'Recursos sanitarios',
  healthResource: 'Recurso sanitario',
  // ayuda y seguridad
  emergency: 'Modo emergencia',
  emergencyContactForm: 'Agregar contacto',
  help: 'Ayuda y soporte',
  faq: 'Preguntas frecuentes',
  supportChat: 'Soporte',
  reportProblem: 'Reportar problema',
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
  errors: {
    specialtyRequired: 'Seleccioná una especialidad',
    professionalRequired: 'Seleccioná un profesional',
    dateRequired: 'Seleccioná una fecha',
    timeRequired: 'Seleccioná una hora',
    timeInPast: 'Elegí una hora posterior a la actual',
    reasonRequired: 'Describí el motivo de la consulta',
    reasonTooLong: 'El motivo no puede superar los 300 caracteres',
  },
  createError: 'No se pudo agendar la cita. Intentá de nuevo.',
  noProfessionals: 'No hay profesionales disponibles para esta especialidad',
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
  listTitle: 'Mis medicamentos',
  treatment: { active: 'Tratamiento activo', inactive: 'Tratamiento inactivo' },
  activeCount: (active: number, total: number) =>
    `${active} ${active === 1 ? 'activo' : 'activos'} de ${total}`,
  addButton: 'Agregar medicamento',
  empty: 'Aún no tienes medicamentos registrados',
  scan: {
    title: 'Identificar con la cámara',
    description:
      'Fotografía la caja y Salud Móvil completa los datos detectados para que los revises antes de guardar.',
    comingSoon: 'Pronto',
  },
  nameLabel: 'Nombre del medicamento',
  namePlaceholder: 'Ej. Losartán',
  doseLabel: 'Dosis',
  dosePlaceholder: '50',
  unitLabel: 'Unidad',
  activeIngredientLabel: 'Principio activo (opcional)',
  activeIngredientPlaceholder: 'Ej. Losartán potásico',
  frequencyLabel: 'Frecuencia',
  frequencyPlaceholder: 'Ej. Cada 12 horas',
  quantityLabel: 'Cantidad por toma',
  quantityPlaceholder: 'Ej. 1 tableta',
  timeLabel: 'Hora de la toma',
  startLabel: 'Inicio',
  endLabel: 'Fin (opcional)',
  expiryLabel: 'Fecha de vencimiento del medicamento (opcional)',
  datePlaceholder: 'Fecha',
  submit: 'Guardar medicamento',
  createError: 'No se pudo guardar el medicamento. Intentá de nuevo.',
  errors: {
    nameRequired: 'Ingresá el nombre del medicamento',
    doseRequired: 'Ingresá la dosis',
    doseInvalid: 'Ingresá una dosis válida',
    frequencyRequired: 'Seleccioná la frecuencia',
    quantityRequired: 'Ingresá la cantidad por toma',
    timeRequired: 'Seleccioná la hora de la toma',
    startRequired: 'Seleccioná la fecha de inicio',
    endBeforeStart: 'La fecha de fin no puede ser anterior al inicio',
    expired: 'Este medicamento ya está vencido',
  },
} as const;

export const REMINDERS_LABELS = {
  tabs: { medications: 'Medicamentos', appointments: 'Citas' },
  helper: {
    medications: 'Gestiona tus recordatorios de medicación',
    appointments: 'Gestiona los avisos de tus citas médicas',
  },
  addButton: 'Agregar recordatorio',
  emptyMedications: 'Aún no tienes recordatorios de medicamentos',
  emptyAppointments: 'Aún no tienes recordatorios de citas',
  active: 'Activo',
  paused: 'Pausado',
  save: 'Guardar recordatorio',
  saveError: 'No se pudo guardar el recordatorio. Intentá de nuevo.',
  deleteButton: 'Eliminar recordatorio',
  deleteConfirmTitle: '¿Eliminar recordatorio?',
  deleteConfirmMessage: 'Dejarás de recibir este aviso.',
  notFound: 'No encontramos este recordatorio',
  // lunes primero, como en el diseño
  weekdays: [
    { short: 'L', name: 'Lunes' },
    { short: 'M', name: 'Martes' },
    { short: 'M', name: 'Miércoles' },
    { short: 'J', name: 'Jueves' },
    { short: 'V', name: 'Viernes' },
    { short: 'S', name: 'Sábado' },
    { short: 'D', name: 'Domingo' },
  ],
  presets: {
    daily: 'Todos los días',
    weekdays: 'Entre semana',
    weekend: 'Fines de semana',
    custom: 'Días específicos',
  },
  medication: {
    medicationLabel: 'Medicamento',
    medicationPlaceholder: 'Seleccione un medicamento',
    timeLabel: 'Hora del recordatorio',
    frequencyLabel: 'Frecuencia',
    enableTitle: 'Activar recordatorio',
    enableSubtitle: 'Recibirás una notificación a la hora indicada',
    repeatTitle: 'Repetir si no confirmo',
    repeatSubtitle: 'Repite el aviso 10 minutos después',
    noMedications: 'Primero agrega un medicamento para poder crear su recordatorio.',
    addMedication: 'Agregar medicamento',
    errors: {
      medicationRequired: 'Seleccioná un medicamento',
      timeRequired: 'Seleccioná la hora del recordatorio',
      daysRequired: 'Seleccioná al menos un día',
    },
  },
  appointment: {
    introTitle: 'Recuerda tu próxima consulta',
    introDescription: 'Selecciona la cita y cuándo deseas recibir el aviso.',
    appointmentLabel: 'Cita',
    appointmentPlaceholder: 'Seleccione una cita',
    whenLabel: '¿Cuándo avisarme?',
    pushTitle: 'Notificación en el teléfono',
    pushSubtitle: 'Recibir aviso aunque la app esté cerrada',
    secondTitle: 'Segundo aviso',
    secondSubtitle: 'Recordar nuevamente 30 minutos antes',
    noAppointments: 'No tienes citas próximas para recordar.',
    bookAppointment: 'Agendar cita',
    notifyBefore: {
      'same-day': 'El mismo día',
      '24h': '24 horas antes',
      '12h': '12 horas antes',
      '2h': '2 horas antes',
      '1h': '1 hora antes',
      '30m': '30 minutos antes',
    },
    errors: {
      appointmentRequired: 'Seleccioná una cita',
      triggerPassed: 'Ese aviso ya pasó para esta cita. Elegí uno más cercano.',
    },
  },
} as const;

// ===== Expediente clínico =====
// Catálogos: la clave es el valor que se guarda; el texto, lo que se muestra.
export const ALLERGY_TYPE_LABELS = {
  medication: 'Medicamento',
  food: 'Alimento',
  environmental: 'Ambiental',
  material: 'Material',
  other: 'Otra',
} as const;

export const ALLERGY_SEVERITY_LABELS = {
  mild: 'Leve',
  moderate: 'Moderada',
  severe: 'Severa',
} as const;

export const HISTORY_KIND_LABELS = { personal: 'Personal', family: 'Familiar' } as const;

export const HISTORY_CATEGORY_LABELS = {
  disease: 'Enfermedad',
  surgery: 'Cirugía',
  hospitalization: 'Hospitalización',
  habits: 'Hábitos',
  hereditary: 'Condición hereditaria',
  other: 'Otro',
} as const;

export const DIAGNOSIS_STATUS_LABELS = {
  active: 'Activo',
  'follow-up': 'En seguimiento',
  resolved: 'Resuelto',
  history: 'Antecedente',
} as const;

// La clave coincide con el segmento de la ruta: /medical-record/documents/category/[category]
export const DOCUMENT_CATEGORIES = {
  prescriptions: { title: 'Recetas', singular: 'Receta', subtitle: 'Medicamentos e indicaciones' },
  certificates: {
    title: 'Constancias',
    singular: 'Constancia',
    subtitle: 'Reposo, asistencia y certificados',
  },
  studies: { title: 'Estudios', singular: 'Estudio', subtitle: 'Ultrasonidos e imágenes' },
  notes: { title: 'Notas médicas', singular: 'Nota médica', subtitle: 'Consultas y seguimiento' },
} as const;

export const LAB_STATUS_LABELS = {
  normal: 'Normal',
  review: 'Revisar',
  'out-of-range': 'Fuera de rango',
} as const;

export const MEDICAL_RECORD_LABELS = {
  menu: {
    summary: { title: 'Resumen clínico', subtitle: 'Ver información general' },
    diagnosis: { title: 'Diagnóstico', empty: 'Sin diagnósticos registrados' },
    history: { title: 'Antecedentes', subtitle: 'Personales y familiares' },
    allergies: {
      title: 'Alergias',
      none: 'Ninguna registrada',
      some: (count: number) => `${count} ${count === 1 ? 'registrada' : 'registradas'}`,
    },
    documents: { title: 'Documentos', subtitle: 'Recetas, estudios, notas' },
    labs: { title: 'Laboratorios', subtitle: 'Ver resultados' },
  },
  summary: {
    patient: 'Paciente',
    updated: 'Última actualización',
    generalInfo: 'Información general',
    age: 'Edad',
    years: (age: number) => `${age} ${age === 1 ? 'año' : 'años'}`,
    bloodType: 'Tipo de sangre',
    conditions: 'Condiciones activas',
    noConditions: 'Ninguna registrada',
    medications: 'Medicamentos activos',
    medicationsCount: (count: number) =>
      count === 0 ? 'Ninguno' : `${count} ${count === 1 ? 'registrado' : 'registrados'}`,
    notRegistered: 'No registrado',
    emergencyContact: 'Contacto de emergencia',
    noEmergencyContact: 'Aún no tienes un contacto de emergencia',
  },
  diagnosis: {
    add: 'Agregar diagnóstico',
    emptyTitle: 'No hay diagnósticos registrados',
    emptyDescription: 'Registra los diagnósticos indicados por un profesional de salud.',
    introTitle: 'Nuevo diagnóstico',
    introDescription: 'Registra la condición tal como fue indicada por un profesional de salud.',
    nameLabel: 'Diagnóstico',
    namePlaceholder: 'Ej. Asma bronquial',
    statusLabel: 'Estado',
    dateLabel: 'Fecha de diagnóstico (opcional)',
    datePlaceholder: 'Fecha',
    providerLabel: 'Profesional o especialidad (opcional)',
    providerPlaceholder: 'Ej. Medicina Interna',
    notesLabel: 'Observaciones (opcional)',
    notesPlaceholder: 'Tratamiento, controles o indicaciones relevantes',
    save: 'Guardar diagnóstico',
    saveError: 'No se pudo guardar el diagnóstico. Intentá de nuevo.',
    errors: {
      nameRequired: 'Escribí el diagnóstico',
      dateFuture: 'La fecha no puede ser posterior a hoy',
    },
  },
  history: {
    personal: 'Personales',
    family: 'Familiares',
    emptyPersonal: 'Sin antecedentes personales registrados',
    emptyFamily: 'Sin antecedentes familiares registrados',
    add: 'Agregar',
    introTitle: 'Información clínica previa',
    introDescription:
      'Registra antecedentes personales o familiares para mantener el expediente actualizado.',
    kindLabel: 'Tipo',
    categoryLabel: 'Categoría',
    titleLabel: 'Antecedente',
    titlePlaceholder: 'Ej. Asma, cirugía de rodilla',
    dateLabel: 'Fecha o año (opcional)',
    datePlaceholder: 'Ej. 2022',
    detailLabel: 'Detalle (opcional)',
    detailPlaceholder: 'Agrega información relevante',
    save: 'Guardar',
    saveError: 'No se pudo guardar el antecedente. Intentá de nuevo.',
    errors: {
      titleRequired: 'Escribí el antecedente',
      periodTooLong: 'Usa hasta 30 caracteres',
    },
  },
  allergies: {
    add: 'Agregar alergia',
    emptyTitle: 'No hay alergias registradas',
    emptyDescription:
      'Agrega alergias a medicamentos, alimentos u otras sustancias para mantener tu expediente completo.',
    noticeTitle: 'Importante',
    noticeMessage: 'Esta información puede ser útil en una atención médica de emergencia.',
    unspecifiedReaction: 'Reacción no especificada',
    typeLabel: 'Tipo de alergia',
    nameLabel: 'Nombre o sustancia',
    namePlaceholder: 'Ej. Penicilina, maní',
    reactionLabel: 'Reacción (opcional)',
    reactionPlaceholder: 'Ej. Urticaria, dificultad respiratoria',
    severityLabel: 'Severidad',
    notesLabel: 'Notas (opcional)',
    notesPlaceholder: 'Detalles adicionales',
    save: 'Guardar',
    saveError: 'No se pudo guardar la alergia. Intentá de nuevo.',
    errors: { nameRequired: 'Escribí la sustancia o alergia' },
  },
  documents: {
    introTitle: 'Documentos del expediente',
    introDescription:
      'Consulta recetas, constancias, estudios y notas médicas guardadas en tu cuenta.',
    recent: 'Recientes',
    emptyRecent: 'Aún no hay documentos guardados',
    emptyCategory: 'No hay documentos en esta categoría',
    upload: 'Subir documento',
    formatPdf: 'PDF',
    formatImage: 'Imagen',
    notFoundCategory: 'No encontramos esta categoría',
    notFound: 'No encontramos este documento',
    share: 'Guardar copia',
    typeLabel: 'Tipo',
    nameLabel: 'Nombre',
    namePlaceholder: 'Ej. Receta de Cardiología',
    providerLabel: 'Profesional o centro (opcional)',
    providerPlaceholder: 'Ej. Dra. Ana Gómez',
    dateLabel: 'Fecha del documento',
    fileEmptyTitle: 'Sin archivo todavía',
    fileEmptyDescription: 'Fotografía el documento o elige un PDF guardado en tu teléfono.',
    datePlaceholder: 'Fecha',
    takePhoto: 'Tomar foto',
    chooseImage: 'Elegir de la galería',
    chooseFile: 'Elegir archivo (PDF)',
    notesLabel: 'Notas (opcional)',
    notesPlaceholder: 'Información adicional',
    save: 'Guardar en expediente',
    saveError: 'No se pudo guardar el documento. Intentá de nuevo.',
    errors: {
      nameRequired: 'Escribí el nombre del documento',
      fileRequired: 'Adjuntá un archivo o una fotografía',
      dateRequired: 'Seleccioná la fecha del documento',
      dateFuture: 'La fecha no puede ser posterior a hoy',
    },
  },
  labs: {
    scanTitle: 'Escanear examen',
    scanDescription: 'Usa la cámara para guardar el resultado original dentro de tu expediente.',
    openCamera: 'Abrir cámara',
    listTitle: 'Exámenes escaneados',
    listSubtitle: 'Los resultados se guardan en tu expediente junto con una copia del original.',
    scanned: 'Documento escaneado',
    empty: 'Aún no tienes exámenes escaneados',
    scan: {
      introTitle: 'Fotografía el examen',
      introDescription:
        '“Abrir cámara” usa la cámara del teléfono. También puedes elegir una foto existente.',
      emptyTitle: 'Sin imagen todavía',
      emptyDescription: 'Coloca el documento completo dentro del encuadre.',
      takePhoto: 'Abrir cámara',
      chooseImage: 'Elegir de la galería',
      nameLabel: 'Nombre del examen',
      namePlaceholder: 'Ej. Hemograma completo',
      dateLabel: 'Fecha',
      datePlaceholder: 'Fecha',
      statusLabel: 'Estado',
      valueLabel: 'Resultado principal (opcional)',
      valuePlaceholder: 'Ej. 13.8 g/dL',
      notesLabel: 'Notas (opcional)',
      notesPlaceholder: 'Observaciones del documento',
      save: 'Guardar examen en expediente',
      saveError: 'No se pudo guardar el examen. Intentá de nuevo.',
      errors: {
        imageRequired: 'Tomá o elegí una foto del examen',
        nameRequired: 'Escribí el nombre del examen',
        dateRequired: 'Seleccioná la fecha del examen',
        dateFuture: 'La fecha no puede ser posterior a hoy',
      },
    },
    detail: {
      eyebrow: 'Laboratorio · Expediente personal',
      noImageTitle: 'Sin imagen escaneada',
      noImageDescription: 'Este examen se guardó solo con sus datos.',
      resultLabel: 'Resultado principal',
      notesLabel: 'Notas',
      noticeTitle: 'Información del expediente',
      noticeMessage:
        'La imagen escaneada y los valores registrados se muestran juntos para facilitar la consulta personal.',
      share: 'Guardar copia',
      notFound: 'No encontramos este examen',
    },
  },
  media: {
    permissionTitle: 'Permiso necesario',
    cameraDenied: 'Activa el permiso de la cámara en los ajustes del teléfono para tomar la foto.',
    openSettings: 'Abrir ajustes',
    errorTitle: 'No se pudo continuar',
    pickError: 'No se pudo abrir el archivo. Intentá de nuevo.',
    shareError: 'No se pudo compartir el archivo. Intentá de nuevo.',
  },
} as const;

// ===== Cuenta, preferencias y ayuda =====
export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  es: 'Español',
  bzk: 'Inglés Creole (Kriol)',
  miq: 'Mískito',
  yan: 'Mayangna (Sumu)',
  ulw: 'Ulwa',
  cab: 'Garífuna',
  rma: 'Rama',
};

export const LANGUAGE_SCREEN_LABELS = {
  introTitle: 'Selecciona tu idioma',
  introDescription: 'Elige tu idioma de preferencia.',
  save: 'Guardar',
} as const;

export const NOTIFICATION_SETTINGS_LABELS = {
  medications: { title: 'Medicamentos', subtitle: 'Recordatorios de dosis y horarios' },
  appointments: { title: 'Citas médicas', subtitle: 'Avisos de próximas citas' },
  indicators: { title: 'Indicadores de salud', subtitle: 'Recordatorios de medición' },
  news: { title: 'Novedades', subtitle: 'Consejos y novedades de la app' },
  save: 'Guardar',
} as const;

export const ACCESSIBILITY_LABELS = {
  textSizeTitle: 'Tamaño del texto',
  textSizes: { normal: 'A', large: 'A+', xlarge: 'A++' },
  textSizeDescriptions: {
    normal: 'Texto normal',
    large: 'Texto grande',
    xlarge: 'Texto muy grande',
  },
  highContrast: {
    title: 'Alto contraste',
    subtitle: 'Mayor diferencia entre texto, bordes y fondos',
  },
  reduceMotion: { title: 'Reducir movimiento', subtitle: 'Evita animaciones y efectos visuales' },
  simpleMode: {
    title: 'Modo lectura simple',
    subtitle: 'Reduce información secundaria y distracciones',
  },
  readAloud: {
    title: 'Lectura en voz alta',
    subtitle: 'Lee instrucciones importantes cuando lo solicites',
  },
  testReading: 'Probar lectura en voz alta',
  testReadingText:
    'Centro de accesibilidad. Puedes aumentar el texto, activar alto contraste, reducir movimiento o usar lectura simple.',
  reset: 'Restablecer ajustes',
} as const;

export const SECURITY_LABELS = {
  menu: {
    password: { title: 'Cambiar contraseña', subtitle: 'Actualiza tu clave de acceso' },
    biometric: { title: 'Acceso biométrico', subtitle: 'Huella o reconocimiento facial' },
    devices: { title: 'Dispositivos vinculados', subtitle: 'Revisa y cierra sesiones activas' },
  },
  password: {
    introTitle: 'Protege tu cuenta',
    introDescription:
      'Utiliza una contraseña distinta a las anteriores y fácil de recordar para ti.',
    currentLabel: 'Contraseña actual',
    newLabel: 'Nueva contraseña',
    confirmLabel: 'Confirmar nueva contraseña',
    save: 'Guardar contraseña',
    saveError: 'No se pudo actualizar la contraseña. Intentá de nuevo.',
    successTitle: 'Contraseña actualizada',
    successMessage: 'Usa tu nueva contraseña la próxima vez que inicies sesión.',
    ok: 'Aceptar',
    errors: {
      currentRequired: 'Ingresá tu contraseña actual',
      tooShort: 'Usá al menos 8 caracteres',
      needsLetterAndNumber: 'Combiná letras y números',
      confirmRequired: 'Confirmá la nueva contraseña',
      mismatch: 'Las contraseñas no coinciden',
      sameAsCurrent: 'La nueva contraseña debe ser distinta a la actual',
    },
  },
  biometric: {
    heroTitle: 'Inicio rápido y seguro',
    heroSubtitle: 'Configura los métodos disponibles en el dispositivo.',
    fingerprint: { title: 'Huella digital', subtitle: 'Usar huella para ingresar' },
    face: { title: 'Reconocimiento facial', subtitle: 'Usar rostro para ingresar' },
    pin: { title: 'Pedir PIN alternativo', subtitle: 'Opción de respaldo accesible' },
    save: 'Guardar',
  },
  devices: {
    current: 'Actual',
    close: 'Cerrar',
    closeA11y: (name: string) => `Cerrar sesión en ${name}`,
    closeOthers: 'Cerrar otras sesiones',
    closeOthersTitle: '¿Cerrar otras sesiones?',
    closeOthersMessage: 'Se cerrará la sesión en todos tus demás dispositivos.',
    currentSession: 'Sesión actual',
    lastAccess: (when: string) => `Último acceso: ${when}`,
    today: 'hoy',
    yesterday: 'ayer',
    error: 'No se pudo cerrar la sesión. Intentá de nuevo.',
  },
} as const;

export const PROFILE_LABELS = {
  subtitle: (role: string) => `${role} · Perfil de salud personal`,
  sectionTitle: 'Información personal',
  fields: {
    name: 'Nombre',
    nup: 'Número único de persona',
    birthDate: 'Fecha de nacimiento',
    bloodType: 'Tipo de sangre',
    phone: 'Teléfono',
    email: 'Correo',
    caregiver: 'Cuidador',
    disability: 'Discapacidad',
  },
  notRegistered: 'No registrado',
  noDisability: 'Ninguna registrada',
} as const;

export const EMERGENCY_RELATION_LABELS = {
  mother: 'Madre',
  father: 'Padre',
  sibling: 'Hermano/a',
  partner: 'Pareja',
  friend: 'Amigo/a',
  other: 'Otro',
} as const;

export const EMERGENCY_LABELS = {
  introTitle: 'Información esencial en un solo lugar',
  introDescription:
    'Muestra rápidamente datos importantes cuando la persona necesita ayuda o tiene dificultad para comunicarse.',
  bloodType: 'Tipo de sangre',
  allergies: 'Alergias',
  conditions: 'Condiciones',
  medications: 'Medicamentos',
  none: 'Ninguna registrada',
  noMedications: 'Ninguno registrado',
  notRegistered: 'No registrado',
  contactsTitle: 'Contactos de emergencia',
  addContact: '+ Agregar',
  noContacts: 'Aún no tienes contactos de emergencia.',
  callContact: (name: string) => `Llamar a ${name}`,
  shareLocation: 'Compartir ubicación',
  locationOff: 'Desactivado · no se comparte ninguna ubicación',
  locationOn: 'Activado para esta emergencia',
  sos: 'SOS · Solicitar ayuda',
  sosTitle: 'Solicitud de ayuda',
  sosMessage:
    'Esta función todavía no contacta a los servicios de emergencia. Si estás en peligro, llama de inmediato al número de emergencias de tu zona.',
  sosOk: 'Entendido',
  nearbyResources: 'Ver recursos sanitarios cercanos',
  form: {
    nameLabel: 'Nombre',
    namePlaceholder: 'Nombre completo',
    relationLabel: 'Relación',
    phoneLabel: 'Teléfono',
    primaryTitle: 'Contacto principal',
    primarySubtitle: 'Mostrar primero en modo emergencia',
    save: 'Guardar contacto',
    saveError: 'No se pudo guardar el contacto. Intentá de nuevo.',
    errors: {
      nameRequired: 'Escribí el nombre del contacto',
      phoneInvalid: 'Ingresá un teléfono válido (mínimo 8 dígitos)',
    },
  },
} as const;

export const VOICE_ASSISTANT_LABELS = {
  idleTitle: 'Toca el micrófono para hablar',
  listeningTitle: 'Escuchando…',
  doneTitle: 'Esto es lo que entendí',
  description: 'Puedes describir síntomas o pedir ayuda sin usar el teclado.',
  micStart: 'Empezar a escuchar',
  micStop: 'Dejar de escuchar',
  transcriptLabel: 'Lo que entendí',
  transcriptPlaceholder: 'Aquí aparecerá la transcripción de tu voz.',
  transcriptListening: 'Procesando tu voz…',
  prompts: [
    { label: '“Tengo dolor de cabeza”', text: 'Tengo dolor de cabeza desde esta mañana.' },
    { label: '“¿Cuándo tomo mi medicamento?”', text: '¿Cuándo debo tomar mi medicamento?' },
    { label: '“Buscar centro de salud”', text: 'Necesito encontrar un centro de salud cercano.' },
  ],
  actionsTitle: 'Acciones sugeridas',
  priorityAction: { title: 'Evaluar prioridad', subtitle: 'Responder IPCP con apoyo de voz' },
  careAction: { title: 'Buscar atención', subtitle: 'Explorar recursos sanitarios' },
} as const;

export const RESOURCE_TYPE_LABELS = {
  pharmacy: 'Farmacia',
  'health-center': 'Centro de salud',
  hospital: 'Hospital',
  laboratory: 'Laboratorio',
  'blood-bank': 'Banco de sangre',
  vaccination: 'Vacunación',
  ambulance: 'Ambulancias',
  psychology: 'Atención psicológica',
} as const;

export const RESOURCE_FILTER_LABELS = {
  all: 'Todos',
  pharmacy: 'Farmacias',
  health: 'Centros de salud',
  laboratory: 'Laboratorios',
  vaccination: 'Vacunación',
  'blood-bank': 'Bancos de sangre',
  ambulance: 'Ambulancias',
  psychology: 'Atención psicológica',
} as const;

export const HEALTH_MAP_LABELS = {
  legendAll: 'Mostrando: Todos los recursos',
  legend: (filter: string) => `Mostrando: ${filter}`,
  listTitle: 'Lista accesible',
  listHint: 'Toca para ver detalles',
  empty: 'No hay recursos de este tipo registrados.',
  open: 'Abierta',
  pinA11y: (name: string) => `Ver detalles de ${name}`,
  distance: (km: number) => `${km} km`,
  waitApprox: (minutes: number) => `~${minutes} min`,
  detail: {
    servicesTitle: 'Servicios y orientación',
    timeTitle: 'Tiempo estimado',
    timeDescription: 'El tiempo mostrado es orientativo.',
    accessTitle: 'Accesibilidad',
    accessDescription: 'Consulta disponibilidad de acceso físico, apoyo y señalización.',
    directions: 'Cómo llegar',
    googleMaps: 'Abrir Google Maps',
    waze: 'Abrir Waze',
    call: 'Llamar al establecimiento',
    whatsapp: 'WhatsApp',
    whatsappMessage: (name: string) => `Hola, deseo solicitar información de atención en ${name}.`,
    hospitalGuide: 'Guía dentro del hospital',
    notFound: 'No encontramos este recurso',
  },
} as const;

export const REFERRAL_LABELS = {
  introTitle: 'Encuentra un establecimiento adecuado',
  introDescription:
    'Selecciona el servicio y revisa opciones. Al abrir una opción podrás usar “Cómo llegar” con Google Maps o Waze.',
  serviceLabel: 'Especialidad o servicio requerido',
  servicePlaceholder: 'Seleccione un servicio',
  priorityLabel: 'Prioridad',
  priorities: {
    scheduled: 'Consulta programable',
    'same-day': 'Atención el mismo día',
    urgent: 'Urgente',
  },
  search: 'Buscar',
  resultsTitle: 'Opciones sugeridas',
  resultsCount: (count: number) => `${count} ${count === 1 ? 'resultado' : 'resultados'}`,
  noResults: 'No encontramos establecimientos para este servicio. Prueba con otro.',
  compareWaitTimes: 'Comparar tiempos de espera',
  urgentTitle: 'Si es una emergencia',
  urgentMessage: 'Acude de inmediato al hospital más cercano o usa el Modo emergencia.',
} as const;

export const WAIT_TIMES_LABELS = {
  introTitle: 'Tiempos aproximados',
  introDescription:
    'Compara la espera estimada antes de decidir a dónde acudir. Los datos reales dependerán de la disponibilidad de cada centro.',
  minutes: 'MIN',
  tiers: {
    fast: { label: 'Rápido', flow: 'Flujo ligero' },
    medium: { label: 'Medio', flow: 'Flujo moderado' },
    busy: { label: 'Alta', flow: 'Demanda alta' },
  },
  viewOnMap: 'Ver estos centros en el mapa',
  updatedAt: (time: string) => `Actualizado a las ${time} · desliza hacia abajo para actualizar`,
  waitA11y: (name: string, minutes: number) => `${name}, espera aproximada de ${minutes} minutos`,
} as const;

export const HOSPITAL_GUIDE_LABELS = {
  introTitle: 'Encuentra el área que necesitas',
  introDescription:
    'Selecciona tu especialidad. La app resalta el área y te muestra una ruta accesible desde la entrada principal.',
  serviceLabel: 'Especialidad o servicio',
  defaultHospital: 'Hospital Regional',
  mapTitle: (hospital: string) => `${hospital} · mapa interno`,
  destination: (service: string) => `Destino: ${service}`,
  zones: {
    entrance: 'Entrada\nprincipal',
    reception: 'Recepción\ny orientación',
    consulting: 'Consultorios',
    emergency: 'Emergencias',
    laboratory: 'Laboratorio',
    imaging: 'Imagenología',
  },
  steps: {
    enterTitle: 'Entra por acceso principal',
    enterText: 'Dirígete al módulo de recepción y orientación.',
    confirmTitle: (service: string) => `Confirma ${service}`,
    confirmText: (service: string) => `Muestra tu cita o solicita orientación para ${service}.`,
    followTitle: (area: string) => `Sigue la señalización a ${area}`,
    accessible: 'La ruta accesible evita escaleras y prioriza rampas o elevador.',
  },
  start: 'Iniciar guía paso a paso',
  spoken: (service: string, area: string, hint: string) =>
    `Destino: ${service}. Área: ${area}. Desde la entrada principal ve a recepción y orientación. ${hint}`,
} as const;

export const HELP_LABELS = {
  menu: {
    faq: { title: 'Preguntas frecuentes', subtitle: 'Respuestas rápidas sobre la aplicación' },
    chat: { title: 'Contactar soporte', subtitle: 'Chatea con el equipo de soporte' },
    report: {
      title: 'Reportar un problema',
      subtitle: 'Describe qué está fallando y adjunta contexto',
    },
  },
  faq: {
    searchPlaceholder: 'Buscar una pregunta',
    empty: 'No encontramos preguntas con esas palabras.',
  },
  chat: {
    greeting: 'Hola 👋 Soy el asistente de soporte. ¿En qué puedo ayudarte?',
    topics: 'Puedes preguntarme sobre citas, medicamentos, indicadores, seguridad o accesibilidad.',
    reply: 'Gracias por escribirnos. Revisaremos tu consulta y te responderemos lo antes posible.',
    placeholder: 'Escribe tu mensaje',
    send: 'Enviar mensaje',
  },
  report: {
    categoryLabel: '¿Qué está fallando?',
    categories: {
      navigation: 'Navegación o botones',
      medications: 'Medicamentos',
      appointments: 'Citas',
      notifications: 'Notificaciones',
      accessibility: 'Accesibilidad',
      other: 'Otro',
    },
    descriptionLabel: 'Descripción',
    descriptionPlaceholder: 'Describe qué pasó y qué esperabas que ocurriera',
    emailLabel: 'Correo para seguimiento',
    emailPlaceholder: 'tu@email.com',
    attach: 'Adjuntar captura',
    changeAttachment: 'Cambiar captura',
    attached: (name: string) => `Captura adjunta: ${name}`,
    send: 'Enviar reporte',
    sendError: 'No se pudo enviar el reporte. Intentá de nuevo.',
    successTitle: 'Reporte enviado',
    successMessage:
      'Gracias por avisarnos. Revisaremos el problema y te escribiremos si necesitamos más información.',
    ok: 'Aceptar',
    errors: {
      descriptionRequired: 'Describe el problema para poder ayudarte',
      descriptionShort: 'Cuéntanos un poco más (mínimo 10 caracteres)',
      emailRequired: 'Ingresá tu correo',
      emailInvalid: 'Correo inválido',
    },
  },
} as const;

export const ACTIVITY_TYPE_LABELS = {
  walk: 'Caminata',
  bike: 'Bicicleta',
  dance: 'Baile',
  gym: 'Gimnasio',
  sport: 'Deporte',
  other: 'Otra',
} as const;

export const ACTIVITY_INTENSITY_LABELS = {
  light: 'Suave',
  moderate: 'Moderada',
  intense: 'Intensa',
} as const;

export const ACTIVITY_LABELS = {
  introTitle: 'Seguimiento de hábitos',
  introDescription:
    'Este registro ayuda a complementar el seguimiento de nutrición, peso y hábitos saludables.',
  stats: { activeDays: 'días activos', minutes: 'minutos', goal: 'meta semanal' },
  questionTitle: '¿Hiciste ejercicio hoy?',
  yes: 'Sí',
  no: 'No',
  minutesLabel: 'Minutos',
  minutesPlaceholder: '30',
  intensityLabel: 'Intensidad',
  typeLabel: 'Actividad',
  noteLabel: 'Nota opcional',
  notePlaceholder: 'Ej. Caminé por el parque después de almorzar',
  save: 'Guardar',
  saveError: 'No se pudo guardar el registro. Intentá de nuevo.',
  historyTitle: 'Últimos días',
  emptyHistory: 'Aún no hay registros de actividad.',
  today: 'Hoy',
  yesterday: 'Ayer',
  rest: 'Descanso',
  done: 'Hecho',
  noExercise: 'No se registró ejercicio',
  intensity: (label: string) => `Intensidad ${label.toLowerCase()}`,
  minutesShort: (minutes: number) => `${minutes} min`,
  errors: {
    doneRequired: 'Seleccioná si hiciste ejercicio hoy',
    minutesRequired: 'Ingresá cuántos minutos hiciste',
    minutesInvalid: 'Ingresá entre 1 y 600 minutos',
  },
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
    cta: 'Realizar evaluación',
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

// IPCP · Mi prioridad: evaluación de 10 preguntas y resultado
export const IPCP_LABELS = {
  assessment: {
    introTitle: 'Evaluación ampliada de prioridad',
    introDescription:
      'Responde 10 preguntas sobre intensidad, evolución, respiración, dolor, fiebre, hidratación y condiciones previas. Es una herramienta de priorización: no diagnostica ni sustituye la valoración de un profesional de salud.',
    progress: (answered: number, total: number) => `${answered} de ${total} respondidas`,
    progressDone: 'Listo: ya puedes ver tu prioridad',
    redFlag: 'Señal de alerta',
    noticeTitle: 'Señales importantes',
    noticeMessage:
      'Si tienes una emergencia real, no dependas de esta evaluación: busca atención inmediata por los canales disponibles en tu zona.',
    submit: 'Ver mi prioridad',
    submitError: 'No se pudo calcular tu prioridad. Intenta de nuevo.',
    questionA11y: (position: number, total: number, title: string) =>
      `Pregunta ${position} de ${total}: ${title}`,
    optionA11y: (value: number, meaning?: string) =>
      meaning ? `${value} de 5, ${meaning}` : `${value} de 5`,
    questions: {
      intensity: {
        title: '¿Qué tan intensos son tus síntomas?',
        low: 'Muy leves',
        high: 'Muy intensos',
      },
      worsening: {
        title: '¿Tus síntomas han empeorado rápidamente?',
        low: 'No han cambiado',
        high: 'Empeoran con rapidez',
      },
      breathing: {
        title: '¿Tienes dificultad para respirar?',
        low: 'Ninguna',
        high: 'Dificultad severa',
      },
      chestPain: {
        title: '¿Tienes dolor fuerte en el pecho, desmayo o confusión?',
        low: 'Nada',
        high: 'Presente o muy marcado',
      },
      pain: {
        title: '¿Qué tan fuerte es tu dolor o malestar general?',
        low: 'Mínimo',
        high: 'Muy fuerte',
      },
      fever: {
        title: '¿Tienes fiebre o escalofríos persistentes?',
        low: 'No',
        high: 'Fiebre alta o persistente',
      },
      hydration: {
        title: '¿Puedes comer, beber líquidos y mantenerte hidratado?',
        low: 'Sin problema',
        high: 'Casi no puedo hacerlo',
      },
      activities: {
        title: '¿Los síntomas te impiden caminar, dormir o hacer actividades normales?',
        low: 'Nada',
        high: 'Completamente',
      },
      chronic: {
        title: '¿Tienes una condición crónica que pueda complicar el cuadro?',
        low: 'No',
        high: 'Sí y está descompensada',
      },
      concern: {
        title: '¿Te preocupa que algo sea diferente a lo habitual en tu salud?',
        low: 'Poco',
        high: 'Mucho',
      },
    },
  },
  result: {
    riskTitle: 'Nivel de riesgo',
    outOf: '/100',
    scoreA11y: (score: number, level: string) => `Puntaje ${score} de 100, ${level}`,
    takenAt: (date: string, time: string) => `Evaluación del ${date} · ${time}`,
    alertSent: 'Ya se mandó una alerta a tu hospital de confianza y cuidador.',
    meaningTitle: '¿Qué significa?',
    recommendationsTitle: 'Recomendaciones para ti',
    disclaimer:
      'El IPCP es una herramienta de priorización y apoyo al seguimiento: no diagnostica ni sustituye la valoración de tu médico.',
    repeat: 'Repetir evaluación',
    empty: {
      title: 'Aún no tienes una evaluación',
      description: 'Responde las 10 preguntas para conocer tu nivel de prioridad.',
      action: 'Realizar evaluación',
    },
    levels: {
      low: {
        badge: 'Riesgo bajo',
        summary: 'Tu resultado indica un bajo nivel de riesgo. ¡Sigue así con tus buenos hábitos!',
        bannerTitle: 'Todo en orden',
        bannerText:
          'Tu nivel de riesgo es bajo. Continúa con tus hábitos saludables y asiste a tus controles de rutina para mantenerte así.',
        meaning:
          'Tus indicadores están en buen rango. Mantén tus hábitos saludables y acude a tus controles de rutina.',
        recommendations: [
          'Mantén una rutina de ejercicio regular y alimentación equilibrada.',
          'Acude a tus controles médicos de rutina según el calendario.',
          'Consulta a tu médico si notas algún cambio inusual en tu salud.',
        ],
      },
      moderate: {
        badge: 'Riesgo moderado',
        summary:
          'Tu resultado indica un riesgo moderado. Es importante mantener tus controles médicos al día.',
        bannerTitle: 'Atención moderada',
        bannerText:
          'Tu nivel de riesgo es moderado. Mantén un seguimiento regular con tu médico y sigue las recomendaciones para evitar que aumente.',
        meaning:
          'Algunos indicadores muestran valores que requieren atención. Con los cuidados adecuados puedes mejorar tu estado de salud.',
        recommendations: [
          'Agenda tu próxima cita médica y no la pospongas.',
          'Sigue una alimentación balanceada y mantente activo.',
          'Toma tus medicamentos según las indicaciones de tu médico.',
        ],
      },
      high: {
        badge: 'Riesgo alto',
        summary:
          'Tu resultado indica una prioridad inmediata para revisión médica y seguimiento cercano.',
        bannerTitle: 'Atención inmediata',
        bannerText:
          'Tu nivel de riesgo es muy alto, requiere atención inmediata y seguimiento médico cercano.',
        meaning:
          'Presenta varios factores que pueden afectar tu salud. Es muy importante que sigas las recomendaciones y acudas a tus controles médicos lo antes posible.',
        recommendations: [
          'Mantente a la espera de tu cuidador y sigue sus instrucciones.',
          'Monitorea tus indicadores y estate al pendiente de cualquier cambio.',
          'No faltes a tus citas médicas y sigue el tratamiento al pie de la letra.',
        ],
      },
    },
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
  back: 'Volver',
  externalLinkErrorTitle: 'No se pudo abrir',
  externalLinkErrorMessage: 'Tu teléfono no tiene una aplicación disponible para esta acción.',
  comingSoonTitle: 'Disponible próximamente',
  comingSoonDescription: 'Estamos trabajando en esta sección. Pronto podrás usarla desde aquí.',
  networkError: 'No se pudo conectar. Revisá tu conexión e intentá de nuevo',
} as const;

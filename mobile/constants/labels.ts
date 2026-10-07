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
  notificationSettings: 'Preferencias de notificación',
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
  back: 'Volver',
  comingSoonTitle: 'Disponible próximamente',
  comingSoonDescription: 'Estamos trabajando en esta sección. Pronto podrás usarla desde aquí.',
  networkError: 'No se pudo conectar. Revisá tu conexión e intentá de nuevo',
} as const;

// lib/i18n/locales/es/common.ts
// Textos generales reutilizables en toda la app.
export const common = {
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
  // Roles de `user.role` (types/auth.ts) -> texto visible
  roles: {
    patient: 'Paciente',
    caregiver: 'Cuidador/a',
    health_staff: 'Personal de salud',
    admin: 'Administrador',
  },
  // Mensajes de fallos que no son de un formulario concreto (ver lib/error-messages.ts).
  // Nunca llevan códigos ni texto del backend: la persona solo necesita saber qué hacer.
  errors: {
    network: 'No pudimos conectarnos. Revisá tu conexión a internet e intentá de nuevo.',
    timeout: 'Está tardando más de lo normal. Intentá de nuevo en unos segundos.',
    unexpected: 'Algo salió mal. Intentá de nuevo.',
    invalidData: 'Revisá los datos e intentá de nuevo.',
    unauthorized: 'No pudimos confirmar tu identidad. Iniciá sesión de nuevo.',
    forbidden: 'No tenés permiso para hacer esto.',
    notFound: 'No encontramos lo que buscabas.',
    conflict: 'La información cambió y no se pudo completar. Actualizá e intentá de nuevo.',
    tooLarge: 'El archivo es demasiado pesado. Elegí uno más liviano.',
    tooManyRequests: 'Hiciste demasiados intentos. Esperá un momento y probá de nuevo.',
    unavailable: 'Tuvimos un problema de nuestro lado. Intentá de nuevo en unos minutos.',
    screenCrash: {
      title: 'Algo salió mal',
      description: 'No pudimos mostrar esta pantalla. Intentá de nuevo.',
    },
  },
};

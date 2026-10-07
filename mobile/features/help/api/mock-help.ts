// features/help/api/mock-help.ts
//
// Mock temporal — el backend no expone preguntas frecuentes, chat de soporte ni
// reportes todavía. Cuando existan, reemplazar estas funciones por apiClient sin
// tocar las pantallas.
import { HELP_LABELS } from '@/constants/labels';

export type FaqItem = { id: string; question: string; answer: string };

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'indicator',
    question: '¿Cómo registro un indicador?',
    answer:
      'Ve a Indicadores, toca “Registrar nuevo indicador”, selecciona el tipo de medición y guarda los datos.',
  },
  {
    id: 'medication',
    question: '¿Cómo agrego un medicamento?',
    answer:
      'En Medicamentos usa “Agregar medicamento”, completa nombre, dosis, frecuencia y hora de la toma, y guárdalo.',
  },
  {
    id: 'reminder',
    question: '¿Cómo creo un recordatorio?',
    answer:
      'Entra a Más → Recordatorios y toca “Agregar recordatorio”. Elige si es de un medicamento o de una cita y define cuándo quieres el aviso.',
  },
  {
    id: 'appointment',
    question: '¿Cómo agendo o cancelo una cita?',
    answer: 'En Citas toca “Agendar cita”. Para cancelarla, abre la cita y usa “Cancelar cita”.',
  },
  {
    id: 'ipcp',
    question: '¿Dónde está el IPCP?',
    answer: 'Puedes abrirlo desde Inicio o desde Más → IPCP · Mi prioridad.',
  },
  {
    id: 'emergency',
    question: '¿Qué hace el modo emergencia?',
    answer:
      'Reúne tu tipo de sangre, alergias, condiciones, medicamentos y contactos para mostrarlos rápido si necesitas ayuda.',
  },
  {
    id: 'accessibility',
    question: '¿Cómo cambio el idioma o la accesibilidad?',
    answer: 'En Más encontrarás Idioma y multilenguaje y el Centro de accesibilidad.',
  },
  {
    id: 'password',
    question: '¿Cómo cambio mi contraseña?',
    answer: 'Ve a Más → Privacidad y seguridad → Cambiar contraseña.',
  },
];

export type ProblemReport = {
  category: string;
  description: string;
  email: string;
  /** URI local de la captura de pantalla, si se adjuntó */
  screenshotUri?: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockFaq(): Promise<FaqItem[]> {
  await delay(200);
  return FAQ_ITEMS;
}

/**
 * Respuesta del soporte a un mensaje del chat.
 * TODO: reemplazar por la conversación real con el equipo de soporte.
 */
export async function fetchMockSupportReply(): Promise<string> {
  await delay(900);
  return HELP_LABELS.chat.reply;
}

export async function submitMockProblemReport(report: ProblemReport): Promise<void> {
  // TODO: POST /support/reports (subir también la captura adjunta)
  void report;
  await delay(500);
}

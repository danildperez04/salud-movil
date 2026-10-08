// features/ipcp/domain/ipcp-questions.ts
// Catálogo de preguntas de la evaluación IPCP. Los textos viven en IPCP_LABELS;
// aquí solo el orden y cuáles son "señales de alerta" (pesan más en el puntaje).

export const IPCP_QUESTION_IDS = [
  'intensity',
  'worsening',
  'breathing',
  'chestPain',
  'pain',
  'fever',
  'hydration',
  'activities',
  'chronic',
  'concern',
] as const;

export type IpcpQuestionId = (typeof IPCP_QUESTION_IDS)[number];

/** Cada respuesta es una escala de 1 (mínimo) a 5 (máximo). */
export const IPCP_SCALE = [1, 2, 3, 4, 5] as const;
export type IpcpAnswer = (typeof IPCP_SCALE)[number];

export type IpcpAnswers = Record<IpcpQuestionId, IpcpAnswer>;

/** Preguntas cuya respuesta alta eleva el puntaje aunque el resto esté bien. */
export const IPCP_RED_FLAGS: readonly IpcpQuestionId[] = ['breathing', 'chestPain'];

export const isRedFlag = (id: IpcpQuestionId) => IPCP_RED_FLAGS.includes(id);

/** true cuando ya se respondieron todas las preguntas. */
export function isCompleteAnswers(answers: Partial<IpcpAnswers>): answers is IpcpAnswers {
  return IPCP_QUESTION_IDS.every((id) => answers[id] !== undefined);
}

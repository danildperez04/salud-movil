// features/ipcp/domain/ipcp-score.ts
// Cálculo del puntaje IPCP (0-100) y su nivel de riesgo. Lógica pura, sin React.
// TODO: el cálculo definitivo lo hará el backend; esta es la fórmula del prototipo.
import { IPCP_QUESTION_IDS, IPCP_RED_FLAGS, type IpcpAnswers } from './ipcp-questions';

export type IpcpLevel = 'low' | 'moderate' | 'high';

/** Puntaje mínimo de cada nivel (de mayor a menor). */
const LEVEL_THRESHOLDS: readonly { level: IpcpLevel; min: number }[] = [
  { level: 'high', min: 70 },
  { level: 'moderate', min: 40 },
  { level: 'low', min: 0 },
];

export const MAX_SCORE = 100;
const SCALE_MAX = 5;
/** Una señal de alerta por encima de este valor suma puntos extra. */
const RED_FLAG_FLOOR = 3;
const RED_FLAG_WEIGHT = 8;

export function getIpcpLevel(score: number): IpcpLevel {
  return LEVEL_THRESHOLDS.find(({ min }) => score >= min)?.level ?? 'low';
}

/**
 * Promedio de las respuestas llevado a 0-100, más un extra por la señal de
 * alerta más alta (dificultad para respirar, dolor de pecho, desmayo).
 */
export function calculateIpcpScore(answers: IpcpAnswers): number {
  const total = IPCP_QUESTION_IDS.reduce((sum, id) => sum + answers[id], 0);
  const average = total / IPCP_QUESTION_IDS.length;

  const worstRedFlag = Math.max(...IPCP_RED_FLAGS.map((id) => answers[id]));
  const boost = Math.max(0, worstRedFlag - RED_FLAG_FLOOR) * RED_FLAG_WEIGHT;

  return Math.min(MAX_SCORE, Math.round((average / SCALE_MAX) * MAX_SCORE + boost));
}

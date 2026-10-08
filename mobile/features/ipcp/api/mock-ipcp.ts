// features/ipcp/api/mock-ipcp.ts
//
// Mock temporal — el backend no calcula ni guarda el IPCP todavía. Cuando exista,
// reemplazar estas funciones por apiClient sin tocar las pantallas.
import { calculateIpcpScore, getIpcpLevel, type IpcpLevel } from '../domain/ipcp-score';
import type { IpcpAnswers } from '../domain/ipcp-questions';

export type IpcpResult = {
  score: number;
  level: IpcpLevel;
  /** ISO 8601 */
  takenAt: string;
  /** el backend avisa al hospital de confianza y al cuidador cuando el riesgo es alto */
  alertSent: boolean;
};

let latest: IpcpResult | null = null;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitMockIpcpAssessment(answers: IpcpAnswers): Promise<IpcpResult> {
  await delay(600);
  const score = calculateIpcpScore(answers);
  const level = getIpcpLevel(score);
  // TODO: POST /ipcp/assessments; el backend decide si envía la alerta
  latest = { score, level, takenAt: new Date().toISOString(), alertSent: level === 'high' };
  return latest;
}

/** Última evaluación del paciente, o null si todavía no hizo ninguna. */
export async function fetchMockLatestIpcp(): Promise<IpcpResult | null> {
  await delay(200);
  return latest;
}

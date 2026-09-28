import { getMockIpcp } from "./ipcp";

export interface HealthIndicator {
  label: string;
  value: string;
  /** 0 = extremo seguro (verde), 100 = extremo de riesgo (rojo). */
  riskPosition: number;
}

/**
 * MOCK TEMPORAL: el backend todavía no expone signos vitales / indicadores
 * de salud reales. Se generan de forma determinística a partir del id del
 * paciente (mismo id -> mismos valores siempre), reutilizando el mismo hash
 * de lib/ipcp.ts (con un sufijo distinto por indicador) para no duplicar
 * lógica de generación de números pseudo-aleatorios estables.
 *
 * Cuando exista el endpoint real, borra este archivo y en
 * HealthIndicatorsCard.tsx consume los indicadores reales del paciente,
 * calculando tú mismo el `riskPosition` (0-100) según los rangos clínicos
 * que defina el equipo médico.
 */
export function getMockHealthIndicators(patientId: string): HealthIndicator[] {
  const bpRisk = getMockIpcp(`${patientId}:bp`).score;
  const glucoseRisk = getMockIpcp(`${patientId}:glucose`).score;
  const satRisk = getMockIpcp(`${patientId}:sat`).score;
  const tempRisk = getMockIpcp(`${patientId}:temp`).score;

  const systolic = 100 + Math.round((bpRisk / 100) * 70); // 100–170
  const diastolic = 65 + Math.round((bpRisk / 100) * 45); // 65–110
  const glucose = 80 + Math.round((glucoseRisk / 100) * 140); // 80–220
  const saturation = 100 - Math.round((satRisk / 100) * 15); // 100–85
  const temperature = (36 + (tempRisk / 100) * 3).toFixed(1); // 36.0–39.0

  return [
    {
      label: "Presión arterial",
      value: `${systolic}/${diastolic} mmHg`,
      riskPosition: bpRisk,
    },
    { label: "Glucosa", value: `${glucose} mg/dL`, riskPosition: glucoseRisk },
    { label: "SatO₂", value: `${saturation}%`, riskPosition: satRisk },
    {
      label: "Temperatura",
      value: `${temperature} °C`,
      riskPosition: tempRisk,
    },
  ];
}

// features/ipcp/domain/ipcp-model.ts
// Lo que muestra la pantalla del IPCP, ya convertido desde la respuesta de la API
// (ver ipcp-report.ts). El cálculo vive en el backend; aquí solo se presenta.
// Sin dependencias de React.

export type IpcpLevel = 'low' | 'moderate' | 'high';

export const MAX_SCORE = 100;

/** Indicadores con bandas de gravedad. El peso queda fuera: no tiene bandas en el backend. */
export type IndicatorType = 'bloodPressure' | 'glucose' | 'temperature';

export type IpcpComponentId = 'clinical' | 'adherence' | 'followUp' | 'trend';

export type IpcpComponent = {
  id: IpcpComponentId;
  /** Peso nominal sobre 100. */
  weight: number;
  /** 0-100, mayor es peor. null: no hay datos para calcularlo (no es lo mismo que 0). */
  points: number | null;
  /** Puntos que aporta al total, ya con los pesos repartidos entre los componentes con datos. */
  contribution: number;
};

/** Motivos legibles del puntaje. La UI los traduce a texto. */
export type IpcpDriver =
  | { code: 'criticalReading'; indicator: IndicatorType }
  | { code: 'elevatedReadings'; indicator: IndicatorType }
  /** `rate`: 0-1, parte de las tomas confirmadas. */
  | { code: 'lowAdherence'; rate: number }
  /** `rate`: 0-1, parte de las citas pasadas a las que no asistió o canceló. */
  | { code: 'missedAppointments'; rate: number }
  | { code: 'worseningTrend' };

export type IpcpTrend = 'worsening' | 'stable' | 'improving' | 'unknown';

type IpcpReportBase = {
  /** ISO 8601 */
  computedAt: string;
  /** 0-1: parte del peso total que tuvo datos. */
  coverage: number;
  components: IpcpComponent[];
};

export type IpcpReport =
  | (IpcpReportBase & { status: 'insufficient' })
  | (IpcpReportBase & {
      status: 'ready';
      /** 0-100 */
      score: number;
      level: IpcpLevel;
      /** De mayor a menor influencia. */
      drivers: IpcpDriver[];
      trend: IpcpTrend;
    });

export type ReadyIpcpReport = Extract<IpcpReport, { status: 'ready' }>;

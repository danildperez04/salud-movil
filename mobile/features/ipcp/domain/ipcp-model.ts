// features/ipcp/domain/ipcp-model.ts
// Tipos del IPCP: lo que entra al cálculo (IpcpSnapshot) y lo que sale (IpcpResult).
// Son independientes de React y de los mocks: el backend podrá reutilizarlos tal cual.

export type IpcpLevel = 'low' | 'moderate' | 'high';

/** Gravedad de una lectura según las bandas clínicas (clinical_range_band). */
export type Severity = 'normal' | 'alert' | 'critical';

/** Indicadores con bandas de gravedad. El peso queda fuera: necesita la estatura para el IMC. */
export const INDICATOR_TYPES = ['bloodPressure', 'glucose', 'temperature'] as const;
export type IndicatorType = (typeof INDICATOR_TYPES)[number];

export const CONDITIONS = ['hypertension', 'diabetes'] as const;
export type Condition = (typeof CONDITIONS)[number];

// --- Entrada ---------------------------------------------------------------

export type IpcpReading = {
  type: IndicatorType;
  severity: Severity;
  /** ISO 8601 */
  recordedAt: string;
};

/** `pending`: el paciente no respondió; pasada la gracia cuenta como dosis perdida. */
export type DoseStatus = 'taken' | 'skipped' | 'pending';

export type IpcpDose = {
  /** ISO 8601, hora programada de la toma */
  scheduledAt: string;
  status: DoseStatus;
};

export type AppointmentOutcome = 'upcoming' | 'completed' | 'noShow' | 'cancelled';

export type IpcpAppointment = {
  /** ISO 8601 */
  date: string;
  outcome: AppointmentOutcome;
};

export type IpcpBackground = {
  /** Diagnósticos crónicos activos. */
  conditions: Condition[];
  /** Antecedentes familiares de las mismas enfermedades. */
  familyHistory: Condition[];
  ageYears?: number;
};

/** Foto de los datos del paciente en un momento dado. `now` va dentro para que el cálculo sea determinista. */
export type IpcpSnapshot = {
  /** ISO 8601 */
  now: string;
  readings: IpcpReading[];
  doses: IpcpDose[];
  appointments: IpcpAppointment[];
  background: IpcpBackground;
};

// --- Salida ----------------------------------------------------------------

export type IpcpComponentId = 'clinical' | 'adherence' | 'trend' | 'followUp' | 'background';

export type IpcpComponent = {
  id: IpcpComponentId;
  /** Peso nominal sobre 100. */
  weight: number;
  /** 0-100. null: no hay datos para calcularlo (no es lo mismo que 0). */
  points: number | null;
  /** Puntos que aporta al total, ya con los pesos repartidos entre los componentes con datos. */
  contribution: number;
};

/** Motivos legibles del puntaje. La UI los traduce a texto. */
export type IpcpDriver =
  | { code: 'criticalReading'; indicator: IndicatorType }
  | { code: 'elevatedReadings'; indicator: IndicatorType }
  | { code: 'lowAdherence'; /** 0-1 */ rate: number }
  | { code: 'worseningTrend'; indicator: IndicatorType }
  /** `days`: días desde la última lectura; null si nunca se registró. */
  | { code: 'monitoringLapse'; indicator: IndicatorType; days: number | null }
  | { code: 'missedAppointments'; count: number };

export type IpcpTrend = 'worsening' | 'stable' | 'improving' | 'unknown';

type IpcpResultBase = {
  /** ISO 8601, igual a `snapshot.now` */
  computedAt: string;
  /** 0-1: parte del peso total que tuvo datos. */
  coverage: number;
  components: IpcpComponent[];
};

export type IpcpResult =
  | (IpcpResultBase & { status: 'insufficient' })
  | (IpcpResultBase & {
      status: 'ready';
      /** 0-100 */
      score: number;
      level: IpcpLevel;
      /** De mayor a menor influencia. */
      drivers: IpcpDriver[];
      trend: IpcpTrend;
      /** true cuando una lectura crítica reciente subió el puntaje por encima de lo que daba la suma. */
      floorApplied: boolean;
    });

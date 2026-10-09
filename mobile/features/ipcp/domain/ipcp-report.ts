// features/ipcp/domain/ipcp-report.ts
// Convierte la respuesta de `GET /patients/me/ipcp` (PublicIpcp) en lo que muestra la pantalla.
// Sin dependencias de React.
import type {
  IndicatorType,
  IpcpComponent,
  IpcpComponentId,
  IpcpDriver,
  IpcpLevel,
  IpcpReport,
  IpcpTrend,
} from './ipcp-model';

type ApiComponentKey = 'indicatorDeviation' | 'adherence' | 'appointmentControl' | 'trend';

export type ApiIpcp = {
  score: number;
  level: IpcpLevel;
  components: {
    key: ApiComponentKey;
    weight: number;
    effectiveWeight: number;
    score: number | null;
    indicators?: { typeIndicatorName: string; severity: 'normal' | 'alert' | 'critical' }[];
  }[];
  /** ISO 8601 */
  generatedAt: string;
};

const COMPONENT_ID: Record<ApiComponentKey, IpcpComponentId> = {
  indicatorDeviation: 'clinical',
  adherence: 'adherence',
  appointmentControl: 'followUp',
  trend: 'trend',
};

// cat_type_indicator.name -> indicador que sabe nombrar la pantalla
const INDICATOR_BY_TYPE_NAME: Record<string, IndicatorType> = {
  'Blood pressure': 'bloodPressure',
  Glucose: 'glucose',
  Temperature: 'temperature',
};

/** Puntaje (0-100, mayor es peor) desde el que una variable se señala como motivo. */
const ADHERENCE_DRIVER_FROM = 20;
const APPOINTMENTS_DRIVER_FROM = 1;
/** La tendencia puntúa 0 (mejora), 50 (estable) o 100 (empeora). */
const TREND_WORSENING_FROM = 75;
const TREND_IMPROVING_UP_TO = 25;

function trendOf(score: number | null | undefined): IpcpTrend {
  if (score === null || score === undefined) return 'unknown';
  if (score >= TREND_WORSENING_FROM) return 'worsening';
  if (score <= TREND_IMPROVING_UP_TO) return 'improving';
  return 'stable';
}

/** Motivos del puntaje, del más grave al menos grave. */
function driversOf(api: ApiIpcp): IpcpDriver[] {
  const scoreOf = (key: ApiComponentKey) => api.components.find((c) => c.key === key)?.score;
  const deviation = api.components.find((c) => c.key === 'indicatorDeviation');

  const readings = (deviation?.indicators ?? []).flatMap((reading) => {
    const indicator = INDICATOR_BY_TYPE_NAME[reading.typeIndicatorName];
    return indicator ? [{ indicator, severity: reading.severity }] : [];
  });

  const drivers: IpcpDriver[] = [
    ...readings
      .filter((r) => r.severity === 'critical')
      .map((r): IpcpDriver => ({ code: 'criticalReading', indicator: r.indicator })),
    ...readings
      .filter((r) => r.severity === 'alert')
      .map((r): IpcpDriver => ({ code: 'elevatedReadings', indicator: r.indicator })),
  ];

  const missedDoses = scoreOf('adherence');
  if (missedDoses != null && missedDoses >= ADHERENCE_DRIVER_FROM) {
    drivers.push({ code: 'lowAdherence', rate: 1 - missedDoses / 100 });
  }

  const missedAppointments = scoreOf('appointmentControl');
  if (missedAppointments != null && missedAppointments >= APPOINTMENTS_DRIVER_FROM) {
    drivers.push({ code: 'missedAppointments', rate: missedAppointments / 100 });
  }

  if (trendOf(scoreOf('trend')) === 'worsening') drivers.push({ code: 'worseningTrend' });

  return drivers;
}

export function toIpcpReport(api: ApiIpcp): IpcpReport {
  const components: IpcpComponent[] = api.components.map((component) => ({
    id: COMPONENT_ID[component.key],
    weight: component.weight,
    points: component.score,
    contribution:
      component.score === null ? 0 : (component.score * component.effectiveWeight) / 100,
  }));

  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
  const availableWeight = components
    .filter((c) => c.points !== null)
    .reduce((sum, c) => sum + c.weight, 0);

  const base = {
    computedAt: api.generatedAt,
    coverage: totalWeight === 0 ? 0 : availableWeight / totalWeight,
    components,
  };

  // sin ninguna variable con datos el backend responde 0: no es "riesgo bajo", es "sin datos"
  if (availableWeight === 0) return { ...base, status: 'insufficient' };

  return {
    ...base,
    status: 'ready',
    score: api.score,
    level: api.level,
    drivers: driversOf(api),
    trend: trendOf(api.components.find((c) => c.key === 'trend')?.score),
  };
}

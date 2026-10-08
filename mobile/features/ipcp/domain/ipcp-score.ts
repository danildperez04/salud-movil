// features/ipcp/domain/ipcp-score.ts
// Cálculo del IPCP (0-100) a partir de los datos que ya están en la app. Lógica pura, sin React.
//
// El puntaje combina cinco componentes (cada uno de 0 a 100) con pesos:
//   clinical   40  gravedad de las lecturas (presión, glucosa, temperatura)
//   adherence  25  dosis confirmadas / dosis que tocaban
//   trend      15  si las lecturas empeoran respecto a la semana anterior
//   followUp   12  días sin registrar lo que corresponde a su enfermedad + citas perdidas
//   background  8  diagnósticos activos, antecedentes familiares y edad
// Un componente sin datos no cuenta como "bien": se excluye y su peso se reparte entre los
// demás. Si queda muy poco peso con datos, no se calcula (`insufficient`) en vez de mostrar
// un verde sin base. Aparte, una lectura crítica reciente fija un mínimo de puntaje, igual
// que NEWS2: un solo valor extremo no puede quedar diluido por el resto.
//
// ⚠️ Los pesos y los cortes son PROVISIONALES: no están validados clínicamente. El IPCP prioriza
// el seguimiento, no diagnostica. Esta misma función es la que debe portarse al backend.
import type {
  Condition,
  IndicatorType,
  IpcpBackground,
  IpcpComponent,
  IpcpComponentId,
  IpcpDose,
  IpcpDriver,
  IpcpLevel,
  IpcpReading,
  IpcpResult,
  IpcpSnapshot,
  IpcpTrend,
  Severity,
} from './ipcp-model';
import { INDICATOR_TYPES } from './ipcp-model';

export const MAX_SCORE = 100;

/** Puntaje mínimo de cada nivel (de mayor a menor). */
const LEVEL_THRESHOLDS: readonly { level: IpcpLevel; min: number }[] = [
  { level: 'high', min: 70 },
  { level: 'moderate', min: 40 },
  { level: 'low', min: 0 },
];

export function getIpcpLevel(score: number): IpcpLevel {
  return LEVEL_THRESHOLDS.find(({ min }) => score >= min)?.level ?? 'low';
}

// --- Parámetros ------------------------------------------------------------

export const IPCP_WEIGHTS: Record<IpcpComponentId, number> = {
  clinical: 40,
  adherence: 25,
  trend: 15,
  followUp: 12,
  background: 8,
};
const COMPONENT_IDS = Object.keys(IPCP_WEIGHTS) as IpcpComponentId[];
const TOTAL_WEIGHT = COMPONENT_IDS.reduce((sum, id) => sum + IPCP_WEIGHTS[id], 0);

/** Peso mínimo con datos (de 100) para calcular el puntaje. */
const MIN_WEIGHT_WITH_DATA = 40;

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** Días hacia atrás de las lecturas y de las dosis que se evalúan. */
export const IPCP_WINDOW_DAYS = 14;

// Componente clínico
const SEVERITY_POINTS: Record<Severity, number> = { normal: 0, alert: 50, critical: 100 };
/** "Cómo estás ahora": la peor lectura de los últimos días pesa más que el promedio de la ventana. */
const RECENT_DAYS = 3;
const RECENT_WEIGHT = 0.6;
/** Desde este puntaje por indicador se lista como motivo. */
const ELEVATED_MIN_POINTS = 20;

// Piso por lectura crítica
const CRITICAL_FLOOR_HOURS = 48;
const CRITICAL_FLOOR_SCORE = 70;

// Adherencia
/** Una dosis sin respuesta cuenta como perdida solo pasado este tiempo. */
const DOSE_GRACE_HOURS = 2;
const MIN_DOSES = 3;
/** Convención de calidad (PDC): desde 80 % se considera adherente. */
const ADHERENT_RATE = 0.8;
/** [tasa de adherencia, puntos de riesgo] */
const ADHERENCE_CURVE: readonly (readonly [number, number])[] = [
  [0, 100],
  [0.5, 75],
  [ADHERENT_RATE, 25],
  [0.9, 0],
  [1, 0],
];

// Tendencia: semana actual contra la anterior, en puntos de gravedad
const TREND_WINDOW_DAYS = 7;
const MIN_READINGS_PER_WEEK = 2;
const TREND_DEADBAND = 10;
const TREND_GAIN = 2;

// Seguimiento
const MONITORING_GRACE_DAYS = 3;
const MONITORING_LAPSE_DAYS = 10;
const MONITORING_MAX_POINTS = 60;
const NO_SHOW_WINDOW_DAYS = 90;
const NO_SHOW_POINTS_EACH = 20;
const NO_SHOW_MAX_POINTS = 40;
/** Qué indicador debe registrar un paciente según su enfermedad. */
const EXPECTED_INDICATORS: Record<Condition, readonly IndicatorType[]> = {
  hypertension: ['bloodPressure'],
  diabetes: ['glucose'],
};

// Antecedentes
const CONDITION_POINTS = 30;
const CONDITIONS_MAX_POINTS = 60;
const FAMILY_HISTORY_POINTS = 10;
const AGE_POINTS: readonly { minAge: number; points: number }[] = [
  { minAge: 65, points: 20 },
  { minAge: 50, points: 10 },
];

// --- Utilidades ------------------------------------------------------------

const mean = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** true si `age` está en [from, to). Una fecha inválida (NaN) nunca entra. */
const within = (age: number, from: number, to: number) => age >= from && age < to;

/** Interpolación lineal entre puntos [x, y] ordenados por x; fuera de los extremos se queda en el extremo. */
function interpolate(curve: readonly (readonly [number, number])[], x: number): number {
  if (x <= curve[0][0]) return curve[0][1];
  for (let i = 1; i < curve.length; i += 1) {
    const [x0, y0] = curve[i - 1];
    const [x1, y1] = curve[i];
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return curve[curve.length - 1][1];
}

type Outcome = { points: number | null; drivers: IpcpDriver[] };
const NO_DATA: Outcome = { points: null, drivers: [] };

// --- Componentes -----------------------------------------------------------

/** Gravedad de las lecturas: el peor indicador manda (una glucosa perfecta no compensa una presión crítica). */
function evaluateClinical(readings: IpcpReading[], now: number): Outcome {
  const drivers: IpcpDriver[] = [];
  let worst: number | null = null;

  for (const type of INDICATOR_TYPES) {
    const inWindow = readings.filter(
      (r) =>
        r.type === type && within(now - Date.parse(r.recordedAt), 0, IPCP_WINDOW_DAYS * DAY_MS),
    );
    if (inWindow.length === 0) continue;

    const sustained = mean(inWindow.map((r) => SEVERITY_POINTS[r.severity]));
    const recent = inWindow.filter((r) =>
      within(now - Date.parse(r.recordedAt), 0, RECENT_DAYS * DAY_MS),
    );
    const points =
      recent.length > 0
        ? RECENT_WEIGHT * Math.max(...recent.map((r) => SEVERITY_POINTS[r.severity])) +
          (1 - RECENT_WEIGHT) * sustained
        : sustained;
    worst = worst === null ? points : Math.max(worst, points);

    if (hasRecentCritical(inWindow, now))
      drivers.push({ code: 'criticalReading', indicator: type });
    else if (points >= ELEVATED_MIN_POINTS)
      drivers.push({ code: 'elevatedReadings', indicator: type });
  }

  return { points: worst, drivers };
}

function hasRecentCritical(readings: IpcpReading[], now: number): boolean {
  return readings.some(
    (r) =>
      r.severity === 'critical' &&
      within(now - Date.parse(r.recordedAt), 0, CRITICAL_FLOOR_HOURS * HOUR_MS),
  );
}

/** Dosis confirmadas sobre las que tocaban en los últimos 14 días. */
function evaluateAdherence(doses: IpcpDose[], now: number): Outcome {
  const counted = doses.filter((d) => {
    const age = now - Date.parse(d.scheduledAt);
    if (!(age < IPCP_WINDOW_DAYS * DAY_MS)) return false;
    return d.status !== 'pending' || age >= DOSE_GRACE_HOURS * HOUR_MS;
  });
  if (counted.length < MIN_DOSES) return NO_DATA;

  const rate = counted.filter((d) => d.status === 'taken').length / counted.length;
  return {
    points: interpolate(ADHERENCE_CURVE, rate),
    drivers: rate < ADHERENT_RATE ? [{ code: 'lowAdherence', rate }] : [],
  };
}

/** Semana actual contra la anterior. Solo suma si empeora; mejorar o mantenerse no resta. */
function evaluateTrend(readings: IpcpReading[], now: number): Outcome & { trend: IpcpTrend } {
  let maxDelta: number | null = null;
  let minDelta: number | null = null;
  let worstType: IndicatorType | null = null;
  const week = TREND_WINDOW_DAYS * DAY_MS;

  for (const type of INDICATOR_TYPES) {
    const ofType = readings.filter((r) => r.type === type);
    const pointsIn = (from: number, to: number) =>
      ofType
        .filter((r) => within(now - Date.parse(r.recordedAt), from, to))
        .map((r) => SEVERITY_POINTS[r.severity]);
    const current = pointsIn(0, week);
    const previous = pointsIn(week, 2 * week);
    if (current.length < MIN_READINGS_PER_WEEK || previous.length < MIN_READINGS_PER_WEEK) continue;

    const delta = mean(current) - mean(previous);
    if (maxDelta === null || delta > maxDelta) {
      maxDelta = delta;
      worstType = type;
    }
    minDelta = minDelta === null ? delta : Math.min(minDelta, delta);
  }

  if (maxDelta === null || minDelta === null || worstType === null) {
    return { ...NO_DATA, trend: 'unknown' };
  }
  if (maxDelta >= TREND_DEADBAND) {
    return {
      points: Math.min(MAX_SCORE, maxDelta * TREND_GAIN),
      drivers: [{ code: 'worseningTrend', indicator: worstType }],
      trend: 'worsening',
    };
  }
  return { points: 0, drivers: [], trend: minDelta <= -TREND_DEADBAND ? 'improving' : 'stable' };
}

function expectedIndicators(conditions: Condition[]): IndicatorType[] {
  return [...new Set(conditions.flatMap((c) => EXPECTED_INDICATORS[c]))];
}

/** Días sin registrar lo que corresponde a su enfermedad y citas a las que no asistió. */
function evaluateFollowUp(snapshot: IpcpSnapshot, now: number): Outcome {
  const expected = expectedIndicators(snapshot.background.conditions);
  if (expected.length === 0 && snapshot.appointments.length === 0) return NO_DATA;

  const drivers: IpcpDriver[] = [];
  let lapse = 0;
  for (const type of expected) {
    const times = snapshot.readings
      .filter((r) => r.type === type)
      .map((r) => Date.parse(r.recordedAt))
      .filter((t) => Number.isFinite(t) && t <= now);
    const days = times.length > 0 ? (now - Math.max(...times)) / DAY_MS : null;

    const fraction = interpolate(
      [
        [MONITORING_GRACE_DAYS, 0],
        [MONITORING_LAPSE_DAYS, 1],
      ],
      days ?? Infinity,
    );
    lapse = Math.max(lapse, fraction * MONITORING_MAX_POINTS);
    if (days === null || days > MONITORING_GRACE_DAYS) {
      drivers.push({ code: 'monitoringLapse', indicator: type, days: days && Math.floor(days) });
    }
  }

  const noShows = snapshot.appointments.filter(
    (a) =>
      a.outcome === 'noShow' && within(now - Date.parse(a.date), 0, NO_SHOW_WINDOW_DAYS * DAY_MS),
  ).length;
  if (noShows > 0) drivers.push({ code: 'missedAppointments', count: noShows });

  return {
    points: Math.min(
      MAX_SCORE,
      lapse + Math.min(NO_SHOW_MAX_POINTS, noShows * NO_SHOW_POINTS_EACH),
    ),
    drivers,
  };
}

/** Base casi fija: enfermedades activas, antecedentes familiares y edad. */
function evaluateBackground({ conditions, familyHistory, ageYears }: IpcpBackground): Outcome {
  if (conditions.length === 0 && familyHistory.length === 0 && ageYears === undefined) {
    return NO_DATA;
  }
  const fromConditions = Math.min(
    CONDITIONS_MAX_POINTS,
    new Set(conditions).size * CONDITION_POINTS,
  );
  const fromFamily = familyHistory.length > 0 ? FAMILY_HISTORY_POINTS : 0;
  const fromAge = AGE_POINTS.find(({ minAge }) => (ageYears ?? 0) >= minAge)?.points ?? 0;
  return { points: Math.min(MAX_SCORE, fromConditions + fromFamily + fromAge), drivers: [] };
}

// --- Cálculo ---------------------------------------------------------------

export function computeIpcp(snapshot: IpcpSnapshot): IpcpResult {
  const now = Date.parse(snapshot.now);

  const trend = evaluateTrend(snapshot.readings, now);
  const outcomes: Record<IpcpComponentId, Outcome> = {
    clinical: evaluateClinical(snapshot.readings, now),
    adherence: evaluateAdherence(snapshot.doses, now),
    trend,
    followUp: evaluateFollowUp(snapshot, now),
    background: evaluateBackground(snapshot.background),
  };

  const weightWithData = COMPONENT_IDS.reduce(
    (sum, id) => (outcomes[id].points === null ? sum : sum + IPCP_WEIGHTS[id]),
    0,
  );

  const components: IpcpComponent[] = COMPONENT_IDS.map((id) => {
    const { points } = outcomes[id];
    return {
      id,
      weight: IPCP_WEIGHTS[id],
      points,
      contribution: points === null ? 0 : (points * IPCP_WEIGHTS[id]) / weightWithData,
    };
  });

  const base = {
    computedAt: snapshot.now,
    coverage: weightWithData / TOTAL_WEIGHT,
    components,
  };
  if (weightWithData < MIN_WEIGHT_WITH_DATA) return { ...base, status: 'insufficient' };

  const sum = components.reduce((total, c) => total + c.contribution, 0);
  const summed = clamp(Math.round(sum), 0, MAX_SCORE);
  const floorApplied = hasRecentCritical(snapshot.readings, now) && summed < CRITICAL_FLOOR_SCORE;
  const score = floorApplied ? CRITICAL_FLOOR_SCORE : summed;

  // La lectura crítica va primero; el resto, por el peso real de su componente en el total.
  const contributionOf = (id: IpcpComponentId) =>
    components.find((c) => c.id === id)?.contribution ?? 0;
  const drivers = COMPONENT_IDS.flatMap((id) =>
    outcomes[id].drivers.map((driver) => ({
      driver,
      rank: driver.code === 'criticalReading' ? Infinity : contributionOf(id),
    })),
  )
    .sort((a, b) => b.rank - a.rank)
    .map(({ driver }) => driver);

  return {
    ...base,
    status: 'ready',
    score,
    level: getIpcpLevel(score),
    drivers,
    trend: trend.trend,
    floorApplied,
  };
}

// features/ipcp/domain/ipcp-score.test.ts
// Ejecutar con `npm test`. Los resultados esperados están calculados a mano (ver comentarios).
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type {
  IndicatorType,
  IpcpComponentId,
  IpcpDose,
  IpcpReading,
  IpcpResult,
  IpcpSnapshot,
  Severity,
} from './ipcp-model';
import { computeIpcp, getIpcpLevel } from './ipcp-score';

const NOW = '2026-10-08T12:00:00.000Z';
const DAY_MS = 86_400_000;
const ago = (days: number) => new Date(Date.parse(NOW) - days * DAY_MS).toISOString();

const reading = (type: IndicatorType, severity: Severity, daysAgo: number): IpcpReading => ({
  type,
  severity,
  recordedAt: ago(daysAgo),
});

/** Lecturas de un mismo indicador: [días atrás, gravedad]. */
const readings = (type: IndicatorType, ...entries: [number, Severity][]) =>
  entries.map(([daysAgo, severity]) => reading(type, severity, daysAgo));

/** Dosis cada 12 h hacia atrás (la más reciente hace medio día): primero tomadas, luego omitidas, luego sin respuesta. */
function doses(taken: number, skipped = 0, unanswered = 0): IpcpDose[] {
  const statuses = [
    ...Array<IpcpDose['status']>(taken).fill('taken'),
    ...Array<IpcpDose['status']>(skipped).fill('skipped'),
    ...Array<IpcpDose['status']>(unanswered).fill('pending'),
  ];
  return statuses.map((status, i) => ({ scheduledAt: ago((i + 1) * 0.5), status }));
}

const snapshot = (overrides: Partial<IpcpSnapshot> = {}): IpcpSnapshot => ({
  now: NOW,
  readings: [],
  doses: [],
  appointments: [],
  background: { conditions: [], familyHistory: [] },
  ...overrides,
});

function ready(result: IpcpResult) {
  assert.equal(result.status, 'ready');
  if (result.status !== 'ready') throw new Error('unreachable');
  return result;
}

const pointsOf = (result: IpcpResult, id: IpcpComponentId) =>
  result.components.find((c) => c.id === id)?.points;

const near = (actual: number | null | undefined, expected: number, epsilon = 0.01) =>
  assert.ok(
    actual !== null && actual !== undefined && Math.abs(actual - expected) < epsilon,
    `se esperaba ~${expected} y fue ${actual}`,
  );

describe('getIpcpLevel', () => {
  it('corta en 40 y 70', () => {
    assert.equal(getIpcpLevel(0), 'low');
    assert.equal(getIpcpLevel(39), 'low');
    assert.equal(getIpcpLevel(40), 'moderate');
    assert.equal(getIpcpLevel(69), 'moderate');
    assert.equal(getIpcpLevel(70), 'high');
    assert.equal(getIpcpLevel(100), 'high');
  });
});

describe('computeIpcp · datos insuficientes', () => {
  it('sin ningún dato no calcula puntaje', () => {
    const result = computeIpcp(snapshot());
    assert.equal(result.status, 'insufficient');
    assert.equal(result.coverage, 0);
  });

  it('con diagnóstico pero sin una sola lectura ni dosis tampoco (no es un verde)', () => {
    const result = computeIpcp(
      snapshot({ background: { conditions: ['hypertension'], familyHistory: [], ageYears: 40 } }),
    );
    // solo tienen datos seguimiento (12) y antecedentes (8)
    assert.equal(result.status, 'insufficient');
    near(result.coverage, 0.2);
  });
});

describe('computeIpcp · paciente estable', () => {
  const stable = snapshot({
    readings: [
      ...readings('bloodPressure', [13, 'normal'], [11, 'normal'], [9, 'normal'], [7.5, 'normal']),
      ...readings('bloodPressure', [5, 'normal'], [3, 'normal'], [1, 'normal']),
      ...readings('glucose', [12, 'normal'], [9, 'normal'], [6, 'normal'], [3, 'normal']),
      ...readings('glucose', [0.5, 'normal']),
    ],
    doses: doses(12),
    background: {
      conditions: ['hypertension', 'diabetes'],
      familyHistory: ['hypertension'],
      ageYears: 40,
    },
  });

  it('queda en verde: solo pesan sus antecedentes (70 puntos x 8 %)', () => {
    const result = ready(computeIpcp(stable));
    // antecedentes: 2 enfermedades (60) + familiar (10) = 70 -> 70 x 8 / 100 = 5.6
    assert.equal(result.score, 6);
    assert.equal(result.level, 'low');
    assert.equal(result.coverage, 1);
    assert.equal(result.trend, 'stable');
    assert.deepEqual(result.drivers, []);
    assert.equal(result.floorApplied, false);
  });

  it('sin dosis registradas, el peso de adherencia se reparte y no cuenta como "bien"', () => {
    const result = ready(computeIpcp({ ...stable, doses: [] }));
    assert.equal(pointsOf(result, 'adherence'), null);
    assert.equal(result.components.find((c) => c.id === 'adherence')?.contribution, 0);
    near(result.coverage, 0.75);
    // 70 x 8 / 75 = 7.47
    assert.equal(result.score, 7);
  });
});

describe('computeIpcp · presión subiendo y dosis olvidadas', () => {
  const worsening = snapshot({
    readings: readings(
      'bloodPressure',
      [13, 'normal'],
      [11, 'normal'],
      [9, 'normal'],
      [6, 'normal'],
      [4, 'alert'],
      [2, 'alert'],
      [0.5, 'alert'],
    ),
    // 6 tomadas de 12 -> 50 %
    doses: doses(6, 3, 3),
    background: { conditions: ['hypertension'], familyHistory: [], ageYears: 55 },
  });

  it('da amarillo con el desglose esperado', () => {
    const result = ready(computeIpcp(worsening));
    // clínico: 0.6 x 50 (peor lectura de 3 días) + 0.4 x (3 alertas / 7 lecturas x 50) = 38.57
    near(pointsOf(result, 'clinical'), 38.57);
    // adherencia 50 % -> 75
    near(pointsOf(result, 'adherence'), 75);
    // tendencia: semana actual 37.5 vs anterior 0 -> delta 37.5 x 2 = 75
    near(pointsOf(result, 'trend'), 75);
    assert.equal(pointsOf(result, 'followUp'), 0);
    // antecedentes: 1 enfermedad (30) + edad >= 50 (10)
    assert.equal(pointsOf(result, 'background'), 40);
    // (38.57x40 + 75x25 + 75x15 + 0x12 + 40x8) / 100 = 48.63
    assert.equal(result.score, 49);
    assert.equal(result.level, 'moderate');
    assert.equal(result.trend, 'worsening');
    assert.equal(result.floorApplied, false);
  });

  it('ordena los motivos por lo que más pesa en el puntaje', () => {
    const result = ready(computeIpcp(worsening));
    assert.deepEqual(
      result.drivers.map((d) => d.code),
      ['lowAdherence', 'elevatedReadings', 'worseningTrend'],
    );
  });
});

describe('computeIpcp · lectura crítica', () => {
  const critical = snapshot({
    readings: readings(
      'bloodPressure',
      [13, 'normal'],
      [11, 'normal'],
      [9, 'normal'],
      [6, 'normal'],
      [4, 'normal'],
      [2, 'normal'],
      [0.5, 'critical'],
    ),
    doses: doses(12),
    background: { conditions: ['hypertension'], familyHistory: [], ageYears: 55 },
  });

  it('sube a 70 (rojo) aunque la suma de componentes dé menos', () => {
    const result = ready(computeIpcp(critical));
    // sin el piso: clínico 65.71, tendencia 50, antecedentes 40 -> 36.99 = 37 (verde)
    const summed = Math.round(result.components.reduce((total, c) => total + c.contribution, 0));
    assert.equal(summed, 37);
    assert.equal(result.score, 70);
    assert.equal(result.level, 'high');
    assert.equal(result.floorApplied, true);
    assert.deepEqual(result.drivers[0], { code: 'criticalReading', indicator: 'bloodPressure' });
  });

  it('una lectura crítica de hace más de 48 h ya no activa el piso', () => {
    const old = snapshot({
      ...critical,
      readings: readings('bloodPressure', [5, 'critical'], [3, 'normal'], [1, 'normal']),
    });
    const result = ready(computeIpcp(old));
    assert.equal(result.floorApplied, false);
    assert.ok(result.score < 70);
  });

  it('con todo crítico no pasa de 100', () => {
    const worst = snapshot({
      readings: [
        ...readings(
          'bloodPressure',
          [13, 'normal'],
          [12, 'normal'],
          [2, 'critical'],
          [1, 'critical'],
        ),
        ...readings('glucose', [12, 'critical'], [1, 'critical']),
      ],
      doses: doses(0, 12),
      appointments: [{ date: ago(10), outcome: 'noShow' }],
      background: {
        conditions: ['hypertension', 'diabetes'],
        familyHistory: ['diabetes'],
        ageYears: 70,
      },
    });
    const result = ready(computeIpcp(worst));
    assert.ok(result.score <= 100);
    assert.equal(result.level, 'high');
  });
});

describe('computeIpcp · adherencia', () => {
  const withRate = (taken: number, skipped: number) =>
    pointsOf(
      computeIpcp(
        snapshot({
          doses: doses(taken, skipped),
          background: { conditions: ['diabetes'], familyHistory: [] },
        }),
      ),
      'adherence',
    );

  it('sigue la curva: 100 % y 90 % no suman; 85 % suma 12.5; 80 % suma 25; 50 % suma 75; 0 % suma 100', () => {
    near(withRate(20, 0), 0);
    near(withRate(18, 2), 0);
    near(withRate(17, 3), 12.5);
    near(withRate(16, 4), 25);
    near(withRate(10, 10), 75);
    near(withRate(0, 10), 100);
  });

  it('con menos de 3 dosis no se evalúa', () => {
    assert.equal(withRate(2, 0), null);
  });

  it('una dosis sin respuesta cuenta como perdida solo pasadas 2 horas', () => {
    const taken = doses(3);
    const pointsFor = (unansweredAgoDays: number) =>
      pointsOf(
        computeIpcp(
          snapshot({
            doses: [...taken, { scheduledAt: ago(unansweredAgoDays), status: 'pending' }],
          }),
        ),
        'adherence',
      );
    near(pointsFor(1 / 24), 0); // hace 1 h: todavía no cuenta
    near(pointsFor(3 / 24), 33.33); // hace 3 h: 3 de 4 = 75 %
  });

  it('ignora las dosis de hace más de 14 días', () => {
    const result = computeIpcp(
      snapshot({
        doses: [
          ...doses(3),
          ...[15, 16, 17].map((d) => ({ scheduledAt: ago(d), status: 'skipped' as const })),
        ],
      }),
    );
    near(pointsOf(result, 'adherence'), 0);
  });
});

describe('computeIpcp · tendencia', () => {
  const trendOf = (previous: Severity, current: Severity) =>
    computeIpcp(
      snapshot({
        readings: readings(
          'bloodPressure',
          [13, previous],
          [11, previous],
          [9, previous],
          [6, current],
          [4, current],
          [2, current],
        ),
        background: { conditions: ['hypertension'], familyHistory: [], ageYears: 40 },
      }),
    );

  it('mejorar no resta puntos pero se reporta', () => {
    const result = ready(trendOf('alert', 'normal'));
    assert.equal(result.trend, 'improving');
    assert.equal(pointsOf(result, 'trend'), 0);
  });

  it('con menos de 2 lecturas por semana no hay tendencia', () => {
    const result = ready(
      computeIpcp(
        snapshot({
          readings: readings('bloodPressure', [10, 'normal'], [1, 'alert'], [0.5, 'alert']),
          background: { conditions: ['hypertension'], familyHistory: [], ageYears: 40 },
        }),
      ),
    );
    assert.equal(result.trend, 'unknown');
    assert.equal(pointsOf(result, 'trend'), null);
  });
});

describe('computeIpcp · seguimiento', () => {
  const hypertensive = { conditions: ['hypertension' as const], familyHistory: [], ageYears: 40 };

  it('días sin medirse la presión suman hasta 60 puntos', () => {
    const result = ready(
      computeIpcp(
        snapshot({
          readings: readings('bloodPressure', [13, 'normal'], [12, 'normal']),
          doses: doses(12),
          background: hypertensive,
        }),
      ),
    );
    assert.equal(pointsOf(result, 'followUp'), 60);
    assert.deepEqual(
      result.drivers.find((d) => d.code === 'monitoringLapse'),
      { code: 'monitoringLapse', indicator: 'bloodPressure', days: 12 },
    );
  });

  it('nunca haberse medido se reporta con days = null', () => {
    const result = ready(computeIpcp(snapshot({ doses: doses(12), background: hypertensive })));
    assert.equal(pointsOf(result, 'followUp'), 60);
    assert.deepEqual(
      result.drivers.find((d) => d.code === 'monitoringLapse'),
      { code: 'monitoringLapse', indicator: 'bloodPressure', days: null },
    );
  });

  it('hasta 3 días sin registrar no penaliza', () => {
    const result = ready(
      computeIpcp(
        snapshot({
          readings: readings('bloodPressure', [3, 'normal']),
          doses: doses(12),
          background: hypertensive,
        }),
      ),
    );
    assert.equal(pointsOf(result, 'followUp'), 0);
  });

  it('cuenta las citas perdidas de los últimos 90 días (20 c/u, máximo 40)', () => {
    const result = ready(
      computeIpcp(
        snapshot({
          readings: readings('bloodPressure', [1, 'normal']),
          doses: doses(12),
          appointments: [
            { date: ago(10), outcome: 'noShow' },
            { date: ago(40), outcome: 'noShow' },
            { date: ago(60), outcome: 'noShow' },
            { date: ago(100), outcome: 'noShow' }, // fuera de la ventana
            { date: ago(5), outcome: 'completed' },
            { date: ago(-5), outcome: 'upcoming' },
          ],
          background: hypertensive,
        }),
      ),
    );
    assert.equal(pointsOf(result, 'followUp'), 40);
    assert.deepEqual(
      result.drivers.find((d) => d.code === 'missedAppointments'),
      { code: 'missedAppointments', count: 3 },
    );
  });
});

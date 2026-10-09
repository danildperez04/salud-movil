// features/ipcp/domain/ipcp-report.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { toIpcpReport, type ApiIpcp } from './ipcp-report';

type ApiComponent = ApiIpcp['components'][number];

const WEIGHTS = { indicatorDeviation: 40, adherence: 25, appointmentControl: 20, trend: 15 };

/** Componentes con el peso nominal; `scores` fija el puntaje (null: sin datos). */
function components(
  scores: Partial<Record<ApiComponent['key'], number | null>>,
  indicators?: ApiComponent['indicators'],
): ApiComponent[] {
  const keys = Object.keys(WEIGHTS) as ApiComponent['key'][];
  const available = keys.filter((key) => (scores[key] ?? null) !== null);
  const availableWeight = available.reduce((sum, key) => sum + WEIGHTS[key], 0);

  return keys.map((key) => ({
    key,
    weight: WEIGHTS[key],
    effectiveWeight: (scores[key] ?? null) === null ? 0 : (WEIGHTS[key] / availableWeight) * 100,
    score: scores[key] ?? null,
    ...(key === 'indicatorDeviation' ? { indicators } : {}),
  }));
}

const api = (overrides: Partial<ApiIpcp> & Pick<ApiIpcp, 'components'>): ApiIpcp => ({
  score: 0,
  level: 'low',
  generatedAt: '2026-09-10T14:30:00.000Z',
  ...overrides,
});

describe('toIpcpReport', () => {
  it('sin datos en ninguna variable es "insufficient", aunque el backend responda 0', () => {
    const report = toIpcpReport(api({ components: components({}) }));
    assert.equal(report.status, 'insufficient');
    assert.equal(report.coverage, 0);
    assert.equal(report.components.find((c) => c.id === 'clinical')?.points, null);
  });

  it('con datos conserva puntaje, nivel y fecha del backend', () => {
    const report = toIpcpReport(
      api({ score: 55, level: 'moderate', components: components({ indicatorDeviation: 50 }) }),
    );
    assert.equal(report.status, 'ready');
    if (report.status !== 'ready') return;
    assert.equal(report.score, 55);
    assert.equal(report.level, 'moderate');
    assert.equal(report.computedAt, '2026-09-10T14:30:00.000Z');
  });

  it('la cobertura es la parte del peso total que tuvo datos', () => {
    const report = toIpcpReport(
      api({ components: components({ indicatorDeviation: 0, adherence: 0 }) }),
    );
    assert.equal(report.coverage, 0.65);
  });

  it('convierte las claves del backend a las de la app y reparte la contribución', () => {
    const report = toIpcpReport(
      api({ components: components({ indicatorDeviation: 100, appointmentControl: 50 }) }),
    );
    assert.deepEqual(
      report.components.map((c) => c.id),
      ['clinical', 'adherence', 'followUp', 'trend'],
    );
    const clinical = report.components.find((c) => c.id === 'clinical');
    // 40 de 60 puntos de peso disponibles -> 66,67 %
    assert.ok(Math.abs((clinical?.contribution ?? 0) - 66.666) < 0.01);
    assert.equal(report.components.find((c) => c.id === 'adherence')?.contribution, 0);
  });

  describe('motivos', () => {
    const drivers = (c: ApiComponent[]) => {
      const report = toIpcpReport(api({ components: c }));
      return report.status === 'ready' ? report.drivers : [];
    };

    it('lecturas críticas primero, luego las alteradas; ignora tipos que la pantalla no nombra', () => {
      assert.deepEqual(
        drivers(
          components({ indicatorDeviation: 100 }, [
            { typeIndicatorName: 'Glucose', severity: 'alert' },
            { typeIndicatorName: 'Blood pressure', severity: 'critical' },
            { typeIndicatorName: 'Temperature', severity: 'normal' },
            { typeIndicatorName: 'Weight', severity: 'critical' },
          ]),
        ),
        [
          { code: 'criticalReading', indicator: 'bloodPressure' },
          { code: 'elevatedReadings', indicator: 'glucose' },
        ],
      );
    });

    it('adherencia: señala desde 20 % de tomas sin confirmar', () => {
      assert.deepEqual(drivers(components({ adherence: 19 })), []);
      const [driver] = drivers(components({ adherence: 40 }));
      assert.equal(driver.code, 'lowAdherence');
      assert.ok(driver.code === 'lowAdherence' && Math.abs(driver.rate - 0.6) < 1e-9);
    });

    it('citas: señala cualquier cita no asistida o cancelada', () => {
      assert.deepEqual(drivers(components({ appointmentControl: 0 })), []);
      assert.deepEqual(drivers(components({ appointmentControl: 50 })), [
        { code: 'missedAppointments', rate: 0.5 },
      ]);
    });

    it('tendencia: solo señala cuando empeora', () => {
      assert.deepEqual(drivers(components({ trend: 100 })), [{ code: 'worseningTrend' }]);
      assert.deepEqual(drivers(components({ trend: 50 })), []);
      assert.deepEqual(drivers(components({ trend: 0 })), []);
    });
  });

  describe('tendencia', () => {
    const trend = (score: number | null) => {
      const report = toIpcpReport(
        api({ components: components({ indicatorDeviation: 0, trend: score }) }),
      );
      return report.status === 'ready' ? report.trend : null;
    };

    it('traduce el puntaje 100/50/0 y "sin datos"', () => {
      assert.equal(trend(100), 'worsening');
      assert.equal(trend(50), 'stable');
      assert.equal(trend(0), 'improving');
      assert.equal(trend(null), 'unknown');
    });
  });
});

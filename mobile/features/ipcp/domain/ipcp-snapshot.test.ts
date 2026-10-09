// features/ipcp/domain/ipcp-snapshot.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  ageInYears,
  buildIpcpSnapshot,
  conditionFromText,
  type IpcpSources,
} from './ipcp-snapshot';

describe('conditionFromText', () => {
  it('reconoce las enfermedades por palabra clave', () => {
    assert.equal(conditionFromText('Hipertensión arterial'), 'hypertension');
    assert.equal(conditionFromText('Diabetes mellitus tipo 2'), 'diabetes');
    assert.equal(conditionFromText('Diabetes'), 'diabetes');
    assert.equal(conditionFromText('Gastritis'), null);
  });
});

describe('ageInYears', () => {
  const now = new Date(2026, 9, 8); // 8 oct 2026
  it('cuenta los años cumplidos', () => {
    assert.equal(ageInYears(new Date(2003, 2, 10), now), 23); // cumplió en marzo
    assert.equal(ageInYears(new Date(2003, 11, 1), now), 22); // aún no cumple
    assert.equal(ageInYears(new Date(2003, 9, 8), now), 23); // cumple hoy
  });
});

describe('buildIpcpSnapshot', () => {
  const sources: IpcpSources = {
    now: new Date(2026, 9, 8, 12, 0),
    indicators: [
      { typeName: 'Blood pressure', value: '150/95', dateHour: '2026-10-08T14:00:00.000Z' },
      { typeName: 'Weight', value: '72.5', dateHour: '2026-10-08T14:00:00.000Z' },
    ],
    doses: [{ scheduledAt: new Date(2026, 9, 7, 8, 0), status: 'taken' }],
    appointments: [
      { date: '2026-09-01', time: '10:00 AM', status: 'No show' },
      { date: '2026-09-15', time: '09:30 AM', status: 'Scheduled' },
      { date: '2026-09-20', time: '09:30 AM', status: 'Completed' },
    ],
    diagnoses: [
      { name: 'Hipertensión arterial', status: 'active' },
      { name: 'Diabetes mellitus tipo 2', status: 'history' },
      { name: 'Gastritis', status: 'active' },
    ],
    history: [
      { kind: 'family', title: 'Diabetes' },
      { kind: 'family', title: 'Cáncer' },
      { kind: 'personal', title: 'Hipertensión' },
    ],
    birthDate: '1970-03-10',
  };

  it('clasifica las lecturas y descarta las que no tienen bandas (peso)', () => {
    const { readings } = buildIpcpSnapshot(sources);
    assert.deepEqual(readings, [
      { type: 'bloodPressure', severity: 'alert', recordedAt: '2026-10-08T14:00:00.000Z' },
    ]);
  });

  it('solo toma diagnósticos activos de las enfermedades que el IPCP reconoce', () => {
    const { background } = buildIpcpSnapshot(sources);
    assert.deepEqual(background.conditions, ['hypertension']);
  });

  it('solo toma antecedentes familiares (no los personales)', () => {
    const { background } = buildIpcpSnapshot(sources);
    assert.deepEqual(background.familyHistory, ['diabetes']);
    assert.equal(background.ageYears, 56);
  });

  it('las citas sin resolver no cuentan: solo "No show", "Completed" y "Cancelled" tienen resultado', () => {
    const { appointments } = buildIpcpSnapshot(sources);
    assert.deepEqual(
      appointments.map((a) => a.outcome),
      ['noShow', 'upcoming', 'completed'],
    );
  });

  it('serializa las dosis y la fecha de cálculo en ISO', () => {
    const snapshot = buildIpcpSnapshot(sources);
    assert.equal(snapshot.now, sources.now.toISOString());
    assert.deepEqual(snapshot.doses, [
      { scheduledAt: new Date(2026, 9, 7, 8, 0).toISOString(), status: 'taken' },
    ]);
  });

  it('sin fecha de nacimiento no inventa la edad', () => {
    assert.equal(
      buildIpcpSnapshot({ ...sources, birthDate: undefined }).background.ageYears,
      undefined,
    );
  });
});

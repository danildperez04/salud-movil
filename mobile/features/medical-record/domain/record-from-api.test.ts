// features/medical-record/domain/record-from-api.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  allergiesFrom,
  diagnosesFrom,
  historyFrom,
  toPatientProfile,
  type ApiMedicalRecord,
} from './record-from-api';

const at = (month: number, day: number) => new Date(2026, month - 1, day, 10, 0).toISOString();

const record: ApiMedicalRecord = {
  primaryDiagnosis: 'Hipertensión arterial',
  medicalHistory: 'Apendicectomía en 2018',
  allergies: 'Penicilina, polen\nMariscos',
  bloodType: 'O+',
  createDate: at(1, 8),
  updateDate: at(9, 11),
  visits: [
    {
      id: 'v1',
      visitDate: at(3, 12),
      diagnosis: 'Control de presión',
      observations: 'Estable',
      treatment: 'Losartán 50 mg',
      healthcareWorkerName: 'Dra. Karla Ruiz',
    },
    {
      id: 'v2',
      visitDate: at(6, 1),
      diagnosis: 'Gastritis',
      observations: '',
      treatment: '',
      healthcareWorkerName: 'Dr. Juan Pérez',
    },
  ],
};

describe('toPatientProfile', () => {
  it('toma la fecha de nacimiento del paciente y el tipo de sangre y la actualización del expediente', () => {
    assert.deepEqual(toPatientProfile({ dateOfBirth: '1980-05-20' }, record), {
      birthDate: '1980-05-20',
      bloodType: 'O+',
      updatedAt: '2026-09-11',
    });
  });

  it('sin expediente solo queda la fecha de nacimiento', () => {
    assert.deepEqual(toPatientProfile({ dateOfBirth: '1980-05-20' }, null), {
      birthDate: '1980-05-20',
      bloodType: '',
      updatedAt: undefined,
    });
  });

  it('tipo de sangre sin registrar queda vacío', () => {
    assert.equal(
      toPatientProfile({ dateOfBirth: '1980-05-20' }, { ...record, bloodType: null }).bloodType,
      '',
    );
  });
});

describe('diagnosesFrom', () => {
  it('el diagnóstico principal está activo y cada consulta es un antecedente', () => {
    const diagnoses = diagnosesFrom(record);
    assert.deepEqual(
      diagnoses.map((d) => [d.id, d.name, d.status]),
      [
        ['primary', 'Hipertensión arterial', 'active'],
        ['v1', 'Control de presión', 'history'],
        ['v2', 'Gastritis', 'history'],
      ],
    );
    assert.equal(diagnoses[0].diagnosedAt, '2026-01-08');
  });

  it('una consulta lleva su profesional y junta observaciones y tratamiento', () => {
    const [, visit, bare] = diagnosesFrom(record);
    assert.equal(visit.provider, 'Dra. Karla Ruiz');
    assert.equal(visit.notes, 'Estable\nLosartán 50 mg');
    assert.equal(bare.notes, undefined);
  });

  it('sin diagnóstico principal solo quedan las consultas; sin expediente, nada', () => {
    assert.equal(diagnosesFrom({ ...record, primaryDiagnosis: '  ' }).length, 2);
    assert.deepEqual(diagnosesFrom(null), []);
  });
});

describe('allergiesFrom', () => {
  it('una alergia por elemento del texto', () => {
    assert.deepEqual(
      allergiesFrom(record).map((a) => a.name),
      ['Penicilina', 'polen', 'Mariscos'],
    );
  });

  it('"Ninguna" y similares no son alergias', () => {
    for (const text of ['Ninguna', 'ninguno.', 'No', 'N/A', 'Sin alergias', '', '  ']) {
      assert.deepEqual(allergiesFrom({ ...record, allergies: text }), [], text);
    }
  });

  it('sin expediente, nada', () => {
    assert.deepEqual(allergiesFrom(null), []);
  });
});

describe('historyFrom', () => {
  it('el texto de antecedentes es una entrada personal', () => {
    assert.deepEqual(
      historyFrom(record).map((e) => [e.kind, e.detail]),
      [['personal', 'Apendicectomía en 2018']],
    );
  });

  it('vacío o "Ninguno" no genera entrada', () => {
    assert.deepEqual(historyFrom({ ...record, medicalHistory: 'Ninguno' }), []);
    assert.deepEqual(historyFrom({ ...record, medicalHistory: '' }), []);
    assert.deepEqual(historyFrom(null), []);
  });
});

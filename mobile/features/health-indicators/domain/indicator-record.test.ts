// features/health-indicators/domain/indicator-record.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  formatIndicatorValue,
  toIndicatorRecord,
  type ApiHealthIndicator,
} from './indicator-record';

const api: ApiHealthIndicator = {
  id: 'abc',
  typeIndicatorId: 1,
  typeIndicatorName: 'Blood pressure',
  measurementUnit: 'mmHg',
  value: 120,
  valueSecondary: 80,
  dateHour: '2026-09-10T14:30:00.000Z',
  notes: null,
};

describe('formatIndicatorValue', () => {
  it('une sistólica y diastólica con una barra', () => {
    assert.equal(formatIndicatorValue(120, 80), '120/80');
  });

  it('sin valor secundario muestra solo el valor, conservando decimales', () => {
    assert.equal(formatIndicatorValue(72.5, null), '72.5');
    assert.equal(formatIndicatorValue(110, null), '110');
  });
});

describe('toIndicatorRecord', () => {
  it('convierte la respuesta de la API al registro de la app', () => {
    assert.deepEqual(toIndicatorRecord(api), {
      id: 'abc',
      typeId: 1,
      typeName: 'Blood pressure',
      value: '120/80',
      unit: 'mmHg',
      dateHour: '2026-09-10T14:30:00.000Z',
      notes: undefined,
    });
  });

  it('conserva las observaciones cuando existen', () => {
    assert.equal(toIndicatorRecord({ ...api, notes: 'En reposo' }).notes, 'En reposo');
  });
});

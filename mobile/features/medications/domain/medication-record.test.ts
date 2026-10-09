// features/medications/domain/medication-record.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  firstTime,
  timeMinutes,
  toAppWeekday,
  toMedicationRecord,
  type ApiMedication,
} from './medication-record';

const api: ApiMedication = {
  id: 'med-1',
  drugName: 'Losartán',
  dose: '50mg',
  startDate: '2026-09-01',
  endDate: null,
  active: true,
  routeAdministrationName: 'Oral',
  schedules: [
    { id: 's-evening', hour: '20:00', days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 's-morning', hour: '08:00', days: [0, 1, 2, 3, 4, 5, 6] },
  ],
};

describe('toAppWeekday', () => {
  it('pasa del domingo en 0 al lunes en 0', () => {
    assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(toAppWeekday), [6, 0, 1, 2, 3, 4, 5]);
  });
});

describe('toMedicationRecord', () => {
  it('ordena las tomas por hora y junta las horas para mostrarlas', () => {
    const record = toMedicationRecord(api);
    assert.deepEqual(
      record.schedules.map((schedule) => schedule.id),
      ['s-morning', 's-evening'],
    );
    assert.equal(record.time, '08:00 AM · 08:00 PM');
    assert.equal(firstTime(record.time), '08:00 AM');
    assert.equal(timeMinutes(record.time), 8 * 60);
  });

  it('todos los días es "Daily"; la vía de administración va en español', () => {
    const record = toMedicationRecord(api);
    assert.equal(record.frequency, 'Daily');
    assert.equal(record.detail, 'Vía oral');
    assert.equal(record.endDate, undefined);
  });

  it('con días sueltos describe cuáles, con el lunes primero', () => {
    const record = toMedicationRecord({
      ...api,
      schedules: [{ id: 's', hour: '09:30', days: [5, 1, 3] }], // viernes, lunes, miércoles
    });
    assert.deepEqual(record.schedules[0].days, [0, 2, 4]);
    assert.equal(record.frequency, 'Lunes, Miércoles, Viernes');
  });

  it('una vía desconocida se muestra tal cual', () => {
    assert.equal(
      toMedicationRecord({ ...api, routeAdministrationName: 'Rectal' }).detail,
      'Rectal',
    );
  });

  it('conserva fechas y estado', () => {
    const record = toMedicationRecord({ ...api, endDate: '2026-12-01', active: false });
    assert.equal(record.startDate, '2026-09-01');
    assert.equal(record.endDate, '2026-12-01');
    assert.equal(record.active, false);
  });
});

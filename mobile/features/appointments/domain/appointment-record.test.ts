// features/appointments/domain/appointment-record.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { toAppointmentRecord, type ApiAppointment } from './appointment-record';

// 10 sep 2026, 14:30 hora local: el resultado no debe depender de la zona horaria de la máquina
const dateHour = new Date(2026, 8, 10, 14, 30).toISOString();

const api: ApiAppointment = {
  id: 'abc',
  dateHour,
  reason: 'Control de presión',
  appointmentStateName: 'Scheduled',
  appointmentTypeName: 'Check-up',
  healthcareWorkerName: 'Dra. Ana Gómez',
};

describe('toAppointmentRecord', () => {
  it('convierte la cita de la API al registro de la app', () => {
    assert.deepEqual(toAppointmentRecord(api), {
      id: 'abc',
      date: '2026-09-10',
      time: '02:30 PM',
      title: 'Control',
      doctorName: 'Dra. Ana Gómez',
      status: 'Scheduled',
      reason: 'Control de presión',
    });
  });

  it('un tipo de cita desconocido se muestra tal cual', () => {
    assert.equal(
      toAppointmentRecord({ ...api, appointmentTypeName: 'Telemedicine' }).title,
      'Telemedicine',
    );
  });
});

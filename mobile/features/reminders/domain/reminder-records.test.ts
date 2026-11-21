// features/reminders/domain/reminder-records.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { MedicationRecord } from '@/features/medications/domain/medication-record';
import {
  appointmentRemindersFrom,
  confirmedDosesFrom,
  findDoseRow,
  medicationRemindersFrom,
  notifyBeforeFor,
  type ApiReminderItem,
} from './reminder-records';

const at = (hours: number, minutes = 0) => new Date(2026, 8, 10, hours, minutes).toISOString();

const medication: MedicationRecord = {
  id: 'med-1',
  drugName: 'Losartán',
  dose: '50mg',
  time: '08:00 AM',
  active: true,
  startDate: '2026-09-01',
  schedules: [
    { id: 's-1', time: '08:00 AM', days: [0, 1, 2] },
    { id: 's-2', time: '08:00 PM', days: [0, 1, 2] },
  ],
};

describe('medicationRemindersFrom', () => {
  it('un recordatorio por horario, con el estado del medicamento', () => {
    const reminders = medicationRemindersFrom([{ ...medication, active: false }]);
    assert.deepEqual(
      reminders.map((r) => [r.id, r.medicationId, r.time, r.enabled]),
      [
        ['s-1', 'med-1', '08:00 AM', false],
        ['s-2', 'med-1', '08:00 PM', false],
      ],
    );
  });

  it('las tomas cuentan desde el inicio del tratamiento (hora local)', () => {
    const [reminder] = medicationRemindersFrom([medication]);
    assert.equal(reminder.createdAt, new Date(2026, 8, 1).toISOString());
  });

  it('los medicamentos sin horarios (creados en el dispositivo) no generan recordatorios', () => {
    assert.deepEqual(medicationRemindersFrom([{ ...medication, schedules: [] }]), []);
  });
});

describe('notifyBeforeFor', () => {
  it('traduce la diferencia entre la cita y el aviso a la anticipación más cercana', () => {
    assert.equal(notifyBeforeFor(at(10), at(9, 30)), '30m');
    assert.equal(notifyBeforeFor(at(10), at(9)), '1h');
    assert.equal(notifyBeforeFor(at(10), at(8)), '2h');
  });

  it('una diferencia intermedia cae en la opción más próxima', () => {
    assert.equal(notifyBeforeFor(at(10), at(9, 20)), '30m');
  });
});

const feed: ApiReminderItem[] = [
  {
    type: 'medication',
    id: 'row-1',
    medicationId: 'med-1',
    scheduleId: 's-1',
    dateHour: at(8),
    confirmedAt: at(8, 5),
  },
  {
    type: 'medication',
    id: 'row-2',
    medicationId: 'med-1',
    scheduleId: 's-2',
    dateHour: at(20),
    confirmedAt: null,
  },
  {
    type: 'appointment',
    id: 'appt-1',
    appointmentId: 'appt-1',
    dateHour: at(14),
    reminderAt: at(13, 30),
  },
];

describe('appointmentRemindersFrom', () => {
  it('solo toma los avisos de cita y los identifica con el id de la cita', () => {
    assert.deepEqual(appointmentRemindersFrom(feed), [
      {
        id: 'appt-1',
        appointmentId: 'appt-1',
        notifyBefore: '30m',
        pushEnabled: true,
        secondNotice: false,
      },
    ]);
  });
});

describe('confirmedDosesFrom', () => {
  it('solo las tomas ya confirmadas, por horario y día', () => {
    assert.deepEqual(confirmedDosesFrom(feed), [
      { reminderId: 's-1', date: '2026-09-10', status: 'taken', respondedAt: at(8, 5) },
    ]);
  });
});

describe('findDoseRow', () => {
  it('encuentra la toma de un horario en un día', () => {
    assert.equal(findDoseRow(feed, 's-2', '2026-09-10')?.id, 'row-2');
  });

  it('undefined si ese día no está en el feed', () => {
    assert.equal(findDoseRow(feed, 's-2', '2026-09-11'), undefined);
    assert.equal(findDoseRow(feed, 'otro', '2026-09-10'), undefined);
  });
});

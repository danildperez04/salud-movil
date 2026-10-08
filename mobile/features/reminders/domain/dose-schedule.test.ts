// features/reminders/domain/dose-schedule.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildDueDoses, isUnconfirmed, type DoseLogEntry } from './dose-schedule';

// miércoles 7 oct 2026 (en hora local: lunes = 0 -> miércoles = 2)
const WEDNESDAY = new Date(2026, 9, 7, 15, 0);
const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];
const LONG_AGO = new Date(2026, 0, 1).toISOString();

const reminder = (
  overrides: Partial<Parameters<typeof buildDueDoses>[0]['reminders'][number]> = {},
) => ({
  id: 'r1',
  medicationId: 'm1',
  time: '08:00 AM',
  days: EVERY_DAY,
  enabled: true,
  createdAt: LONG_AGO,
  ...overrides,
});

const build = (
  reminders: ReturnType<typeof reminder>[],
  options: { log?: DoseLogEntry[]; from?: Date; to?: Date; active?: string[] } = {},
) =>
  buildDueDoses({
    reminders,
    activeMedicationIds: new Set(options.active ?? ['m1']),
    log: options.log ?? [],
    from: options.from ?? WEDNESDAY,
    to: options.to ?? WEDNESDAY,
  });

describe('buildDueDoses', () => {
  it('genera una toma por recordatorio y día, a la hora configurada', () => {
    const [dose] = build([reminder({ time: '02:30 PM' })]);
    assert.equal(dose.date, '2026-10-07');
    assert.equal(dose.scheduledAt.getHours(), 14);
    assert.equal(dose.scheduledAt.getMinutes(), 30);
    assert.equal(dose.status, 'pending');
  });

  it('respeta los días de la semana (lunes = 0)', () => {
    assert.equal(build([reminder({ days: [0, 1] })]).length, 0); // lunes y martes
    assert.equal(build([reminder({ days: [2] })]).length, 1); // miércoles
  });

  it('cubre un rango de días y ordena de la más antigua a la más reciente', () => {
    const doses = build(
      [reminder({ id: 'a', time: '12:00 PM' }), reminder({ id: 'b', time: '08:00 AM' })],
      {
        from: new Date(2026, 9, 5),
        to: WEDNESDAY,
      },
    );
    assert.equal(doses.length, 6); // 3 días x 2 recordatorios
    assert.deepEqual(
      doses.map((d) => d.scheduledAt.getTime()),
      [...doses.map((d) => d.scheduledAt.getTime())].sort((x, y) => x - y),
    );
  });

  it('ignora recordatorios desactivados y de medicamentos inactivos', () => {
    assert.equal(build([reminder({ enabled: false })]).length, 0);
    assert.equal(build([reminder()], { active: [] }).length, 0);
  });

  it('no genera tomas anteriores a la creación del recordatorio', () => {
    // creado hoy a las 10:00: la toma de las 08:00 de hoy no se esperaba todavía
    const createdToday = new Date(2026, 9, 7, 10, 0).toISOString();
    assert.equal(build([reminder({ createdAt: createdToday })]).length, 0);
    assert.equal(
      build([reminder({ createdAt: createdToday })], { to: new Date(2026, 9, 8, 15, 0) }).length,
      1, // la de mañana sí
    );
  });

  it('toma el estado del registro de respuestas', () => {
    const log: DoseLogEntry[] = [
      {
        reminderId: 'r1',
        date: '2026-10-07',
        status: 'skipped',
        respondedAt: WEDNESDAY.toISOString(),
      },
      {
        reminderId: 'r1',
        date: '2026-10-06',
        status: 'taken',
        respondedAt: WEDNESDAY.toISOString(),
      },
    ];
    const doses = build([reminder()], { log, from: new Date(2026, 9, 6), to: WEDNESDAY });
    assert.deepEqual(
      doses.map((d) => [d.date, d.status]),
      [
        ['2026-10-06', 'taken'],
        ['2026-10-07', 'skipped'],
      ],
    );
  });
});

describe('isUnconfirmed', () => {
  const dose = (status: 'pending' | 'taken', hour: number) => ({
    status,
    scheduledAt: new Date(2026, 9, 7, hour, 0),
  });

  it('es una toma pendiente cuya hora ya pasó', () => {
    assert.equal(isUnconfirmed(dose('pending', 8), WEDNESDAY), true);
    assert.equal(isUnconfirmed(dose('pending', 18), WEDNESDAY), false);
    assert.equal(isUnconfirmed(dose('taken', 8), WEDNESDAY), false);
  });
});

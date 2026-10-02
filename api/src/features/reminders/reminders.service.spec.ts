import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RemindersService } from './reminders.service';
import { MedicationReminder } from '../medications/entities/medication-reminder.entity';
import { AppointmentReminder } from '../appointments/entities/appointment-reminder.entity';
import { PatientsService } from '../patients/patients.service';

describe('RemindersService', () => {
  let service: RemindersService;

  const currentUser = { sub: 'u-1', email: 'patient@test', role: 'patient' };
  const patient = { id: 'pat-1' };

  const medicationReminder = (overrides: Partial<MedicationReminder> = {}) =>
    ({
      id: 'mr-1',
      dateHourScheduled: new Date(Date.now() + 60 * 60 * 1000),
      confirmationDate: null,
      notificationState: { name: 'Pending' },
      schedule: {
        id: 'sch-1',
        medication: { id: 'med-1', drugName: 'Losartán', dose: '50mg' },
      },
      ...overrides,
    }) as MedicationReminder;

  const appointmentReminder = (overrides: Partial<AppointmentReminder> = {}) =>
    ({
      id: 'ar-1',
      dateHourSend: new Date(Date.now() + 3 * 60 * 60 * 1000),
      notificationState: { name: 'Pending' },
      appointment: {
        id: 'app-1',
        reason: 'Control de hipertensión',
        dateHour: new Date(Date.now() + 3.5 * 60 * 60 * 1000),
        appointmentState: { name: 'Scheduled' },
        healthcareWorker: {
          user: { name: 'Dr. Ejemplo Pérez' },
          major: { name: 'Medicina General' },
        },
      },
      ...overrides,
    }) as AppointmentReminder;

  const buildModule = async (overrides: {
    medicationFind?: jest.Mock;
    appointmentFind?: jest.Mock;
    patients?: Partial<PatientsService>;
  }) => {
    const {
      medicationFind = jest.fn().mockResolvedValue([]),
      appointmentFind = jest.fn().mockResolvedValue([]),
      patients = {},
    } = overrides;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemindersService,
        {
          provide: getRepositoryToken(MedicationReminder),
          useValue: { find: medicationFind },
        },
        {
          provide: getRepositoryToken(AppointmentReminder),
          useValue: { find: appointmentFind },
        },
        {
          provide: PatientsService,
          useValue: {
            findByUserId: jest.fn().mockResolvedValue(patient),
            findRecordForScope: jest.fn().mockResolvedValue(patient),
            ...patients,
          },
        },
      ],
    }).compile();

    return module.get<RemindersService>(RemindersService);
  };

  it('debería estar definido', async () => {
    service = await buildModule({});
    expect(service).toBeDefined();
  });

  it('debería unir medicamentos y citas ordenados por reminderAt', async () => {
    service = await buildModule({
      medicationFind: jest.fn().mockResolvedValue([medicationReminder()]),
      appointmentFind: jest.fn().mockResolvedValue([appointmentReminder()]),
    });

    const feed = await service.listForMe(currentUser);

    expect(feed).toHaveLength(2);
    expect(feed[0].type).toBe('medication');
    expect(feed[1].type).toBe('appointment');
    const times = feed.map((item) => new Date(item.reminderAt).getTime());
    expect(times[0]).toBeLessThanOrEqual(times[1]);
  });

  it('debería exponer la especialidad y el profesional de la cita', async () => {
    service = await buildModule({
      appointmentFind: jest.fn().mockResolvedValue([appointmentReminder()]),
    });

    const [reminder] = await service.listForMe(currentUser);

    expect(reminder.type).toBe('appointment');
    if (reminder.type !== 'appointment') {
      throw new Error('Se esperaba un recordatorio de cita');
    }
    expect(reminder.specialty).toBe('Medicina General');
    expect(reminder.professionalName).toBe('Dr. Ejemplo Pérez');
    expect(reminder.title).toBe('Control de hipertensión');
  });

  it('debería excluir citas que ya no están programadas', async () => {
    service = await buildModule({
      appointmentFind: jest.fn().mockResolvedValue([
        appointmentReminder({
          appointment: {
            ...appointmentReminder().appointment,
            appointmentState: { name: 'Cancelled' },
          },
        } as AppointmentReminder),
      ]),
    });

    const feed = await service.listForMe(currentUser);

    expect(feed).toHaveLength(0);
  });

  it('debería excluir recordatorios fuera de la ventana', async () => {
    service = await buildModule({
      medicationFind: jest.fn().mockResolvedValue([
        medicationReminder({
          dateHourScheduled: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        }),
      ]),
    });

    const feed = await service.listForMe(currentUser, 7);

    expect(feed).toHaveLength(0);
  });

  it('debería incluir la toma confirmada con su fecha', async () => {
    const confirmedAt = new Date();
    service = await buildModule({
      medicationFind: jest
        .fn()
        .mockResolvedValue([
          medicationReminder({ confirmationDate: confirmedAt }),
        ]),
    });

    const [reminder] = await service.listForMe(currentUser);

    expect(reminder.type).toBe('medication');
    if (reminder.type !== 'medication') {
      throw new Error('Se esperaba un recordatorio de medicamento');
    }
    expect(reminder.confirmedAt).toBe(confirmedAt.toISOString());
    expect(reminder.dose).toBe('50mg');
  });
});

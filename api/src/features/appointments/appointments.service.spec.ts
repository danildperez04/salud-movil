import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { AppointmentReminder } from './entities/appointment-reminder.entity';
import { AppointmentState } from '../catalogues/entities/appointment-state.entity';
import { AppointmentType } from '../catalogues/entities/appointment-type.entity';
import { NotificationState } from '../catalogues/entities/notification-state.entity';
import { HealthcareWorker } from '../users/entities/healthcare-worker.entity';
import { PatientsService } from '../patients/patients.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  const currentUser = { sub: 'u-1', email: 'staff@test', role: 'health_staff' };

  const buildModule = async (overrides: {
    appointmentFindOne?: jest.Mock;
    appointmentSave?: jest.Mock;
    appointmentStateFindOne?: jest.Mock;
    appointmentTypeFindOne?: jest.Mock;
    healthcareWorkerFindOne?: jest.Mock;
    patients?: Partial<PatientsService>;
  }) => {
    const {
      appointmentFindOne = jest.fn(),
      appointmentSave = jest.fn(),
      appointmentStateFindOne = jest.fn(),
      appointmentTypeFindOne = jest.fn(),
      healthcareWorkerFindOne = jest.fn(),
      patients = {},
    } = overrides;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: { findOne: appointmentFindOne, save: appointmentSave },
        },
        {
          provide: getRepositoryToken(AppointmentReminder),
          useValue: { save: jest.fn(), create: jest.fn() },
        },
        {
          provide: getRepositoryToken(AppointmentState),
          useValue: { findOne: appointmentStateFindOne },
        },
        {
          provide: getRepositoryToken(AppointmentType),
          useValue: { findOne: appointmentTypeFindOne },
        },
        {
          provide: getRepositoryToken(NotificationState),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(HealthcareWorker),
          useValue: { findOne: healthcareWorkerFindOne },
        },
        {
          provide: PatientsService,
          useValue: {
            findRecordForScope: jest
              .fn()
              .mockResolvedValue({ id: 'pat-1', healthCenter: { id: 'hc-1' } }),
            ...patients,
          },
        },
      ],
    }).compile();

    return module.get<AppointmentsService>(AppointmentsService);
  };

  it('debería estar definido', async () => {
    service = await buildModule({});
    expect(service).toBeDefined();
  });

  it('debería rechazar cancelar una cita ya finalizada o cancelada', async () => {
    const cancelledAppointment = {
      id: 'app-1',
      appointmentState: { id: 2, name: 'Cancelled' },
    };
    const appointmentFindOne = jest
      .fn()
      .mockResolvedValue(cancelledAppointment);

    service = await buildModule({ appointmentFindOne });

    await expect(
      service.cancel('pat-1', 'app-1', currentUser, { cancelReason: 'motivo' }),
    ).rejects.toThrow(ConflictException);
  });

  it('debería rechazar cambiar el estado de una cita no programada', async () => {
    const completedAppointment = {
      id: 'app-2',
      appointmentState: { id: 3, name: 'Completed' },
    };
    const appointmentFindOne = jest
      .fn()
      .mockResolvedValue(completedAppointment);

    service = await buildModule({ appointmentFindOne });

    await expect(
      service.changeState('pat-1', 'app-2', currentUser, { state: 'No show' }),
    ).rejects.toThrow(ConflictException);
  });
});

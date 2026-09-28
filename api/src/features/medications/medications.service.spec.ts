import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { Medication } from './entities/medication.entity';
import { MedicationSchedule } from './entities/medication-schedule.entity';
import { MedicationReminder } from './entities/medication-reminder.entity';
import { RouteAdministration } from '../catalogues/entities/route-administration.entity';
import { NotificationState } from '../catalogues/entities/notification-state.entity';
import { PatientsService } from '../patients/patients.service';

describe('MedicationsService', () => {
  let service: MedicationsService;

  const currentUser = { sub: 'u-1', email: 'staff@test', role: 'health_staff' };

  const buildModule = async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationsService,
        { provide: getRepositoryToken(Medication), useValue: {} },
        { provide: getRepositoryToken(MedicationSchedule), useValue: {} },
        { provide: getRepositoryToken(MedicationReminder), useValue: {} },
        {
          provide: getRepositoryToken(RouteAdministration),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(NotificationState),
          useValue: { findOne: jest.fn() },
        },
        { provide: getDataSourceToken(), useValue: { transaction: jest.fn() } },
        {
          provide: PatientsService,
          useValue: {
            findRecordForScope: jest
              .fn()
              .mockResolvedValue({ id: 'pat-1', healthCenter: { id: 'hc-1' } }),
          },
        },
      ],
    }).compile();

    return module.get<MedicationsService>(MedicationsService);
  };

  it('debería estar definido', async () => {
    service = await buildModule();
    expect(service).toBeDefined();
  });

  it('debería rechazar endDate anterior a startDate', async () => {
    service = await buildModule();

    await expect(
      service.create('pat-1', currentUser, {
        drugName: 'Losartán',
        dose: '50mg',
        startDate: '2026-10-01',
        endDate: '2026-09-01',
        routeAdministrationId: 1,
        schedules: [{ hour: '08:00', timesPerDay: 1, days: [1, 3, 5] }],
      }),
    ).rejects.toThrow(BadRequestException);
  });
});

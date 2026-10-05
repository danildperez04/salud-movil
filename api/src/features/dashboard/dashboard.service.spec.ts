import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Patient } from '../users/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { MedicationReminder } from '../medications/entities/medication-reminder.entity';
import { ClinicalRangeBandsService } from '../catalogues/clinical-range-bands.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const staff = { sub: 'w-1', email: 'staff@test', role: 'health_staff' };
  const admin = { sub: 'a-1', email: 'admin@test', role: 'admin' };

  const glucoseBands = new Map([
    [
      2,
      {
        primary: [
          {
            severity: 'critical' as const,
            label: 'Glucosa crítica',
            minValue: 200,
            maxValue: null,
          },
          {
            severity: 'alert' as const,
            label: 'Glucosa elevada',
            minValue: 126,
            maxValue: 199.99,
          },
          {
            severity: 'normal' as const,
            label: 'Glucosa normal',
            minValue: 70,
            maxValue: 125.99,
          },
        ],
        secondary: [],
      },
    ],
  ]);

  const indicator = (overrides: Record<string, unknown> = {}) => ({
    id: 'i-1',
    value: '150',
    valueSecondary: null,
    dateHour: new Date('2026-10-02T12:00:00Z'),
    typeIndicator: { id: 2, name: 'Glucose', measurementUnit: 'mg/dL' },
    ...overrides,
  });

  const patient = (overrides: Record<string, unknown> = {}) => ({
    id: 'pat-1',
    user: { name: 'Pedro Gómez' },
    healthCenter: { name: 'Centro A' },
    healthIndicators: [],
    ...overrides,
  });

  /** Query builder encadenado: cada método devuelve el mismo mock. */
  const qb = (extra: Record<string, unknown>) => {
    const chain: Record<string, unknown> = {};
    for (const method of [
      'innerJoin',
      'innerJoinAndSelect',
      'leftJoinAndSelect',
      'where',
      'andWhere',
    ]) {
      chain[method] = jest.fn().mockReturnValue(chain);
    }
    return Object.assign(chain, extra);
  };

  const buildModule = async (overrides: {
    userFindOne?: jest.Mock;
    patientQuery?: jest.Mock;
    appointmentQuery?: jest.Mock;
    reminderQuery?: jest.Mock;
    bands?: Map<number, unknown>;
  }) => {
    const {
      userFindOne = jest.fn().mockResolvedValue({
        healthcareWorker: { healthCenter: { id: 'hc-1' } },
      }),
      patientQuery = qb({
        getCount: jest.fn().mockResolvedValue(3),
        getMany: jest.fn().mockResolvedValue([]),
      }),
      appointmentQuery = qb({ getCount: jest.fn().mockResolvedValue(2) }),
      reminderQuery = qb({ getCount: jest.fn().mockResolvedValue(1) }),
      bands = new Map(),
    } = overrides;

    const bandsService = {
      loadAll: jest.fn().mockResolvedValue(bands),
      match: (
        list: { minValue: number | null; maxValue: number | null }[],
        value: number,
      ) => {
        for (const band of list) {
          const aboveMin = band.minValue === null || value >= band.minValue;
          const belowMax = band.maxValue === null || value <= band.maxValue;
          if (aboveMin && belowMax) {
            return band;
          }
        }
        return null;
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Patient),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(patientQuery),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: userFindOne },
        },
        {
          provide: getRepositoryToken(Appointment),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(appointmentQuery),
          },
        },
        {
          provide: getRepositoryToken(MedicationReminder),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(reminderQuery),
          },
        },
        { provide: ClinicalRangeBandsService, useValue: bandsService },
      ],
    }).compile();

    return module.get<DashboardService>(DashboardService);
  };

  it('debería estar definido', async () => {
    service = await buildModule({});
    expect(service).toBeDefined();
  });

  it('debería devolver los contadores del panel', async () => {
    service = await buildModule({});

    const stats = await service.stats(admin);

    expect(stats.totalPatients).toBe(3);
    expect(stats.activePatients).toBe(3);
    expect(stats.upcomingAppointments).toBe(2);
    expect(stats.pendingMedicationIntakes).toBe(1);
    expect(stats.generatedAt).toBeTruthy();
  });

  it('debería incluir en atención a quien tiene un indicador en alerta', async () => {
    const patientQuery = qb({
      getCount: jest.fn().mockResolvedValue(1),
      getMany: jest
        .fn()
        .mockResolvedValue([patient({ healthIndicators: [indicator()] })]),
    });
    service = await buildModule({ patientQuery, bands: glucoseBands });

    const stats = await service.stats(admin);

    expect(stats.patientsWithAttention).toBe(1);
    expect(stats.attention[0]).toMatchObject({
      name: 'Pedro Gómez',
      indicatorName: 'Glucose',
      indicatorValue: 150,
      indicatorUnit: 'mg/dL',
      severity: 'alert',
      band: 'Glucosa elevada',
    });
  });

  it('debería marcar como crítico y situarlo primero', async () => {
    const patientQuery = qb({
      getCount: jest.fn().mockResolvedValue(2),
      getMany: jest.fn().mockResolvedValue([
        patient({
          id: 'pat-alerta',
          healthIndicators: [indicator({ value: '150' })],
        }),
        patient({
          id: 'pat-critico',
          healthIndicators: [indicator({ value: '350' })],
        }),
      ]),
    });
    service = await buildModule({ patientQuery, bands: glucoseBands });

    const stats = await service.stats(admin);

    expect(stats.attention[0].id).toBe('pat-critico');
    expect(stats.attention[0].severity).toBe('critical');
    expect(stats.attention[1].severity).toBe('alert');
  });

  it('debería ignorar a quien solo tiene indicadores normales', async () => {
    const patientQuery = qb({
      getCount: jest.fn().mockResolvedValue(1),
      getMany: jest
        .fn()
        .mockResolvedValue([
          patient({ healthIndicators: [indicator({ value: '100' })] }),
        ]),
    });
    service = await buildModule({ patientQuery, bands: glucoseBands });

    const stats = await service.stats(admin);

    expect(stats.attention).toHaveLength(0);
  });

  it('debería quedarse con el último valor de cada tipo de indicador', async () => {
    const patientQuery = qb({
      getCount: jest.fn().mockResolvedValue(1),
      getMany: jest.fn().mockResolvedValue([
        patient({
          healthIndicators: [
            indicator({
              id: 'viejo',
              value: '350',
              dateHour: new Date('2026-09-01'),
            }),
            indicator({
              id: 'nuevo',
              value: '100',
              dateHour: new Date('2026-10-04'),
            }),
          ],
        }),
      ]),
    });
    service = await buildModule({ patientQuery, bands: glucoseBands });

    const stats = await service.stats(admin);

    // El valor reciente es normal, así que el paciente deja de estar en alerta
    // aunque conserve un valor crítico antiguo.
    expect(stats.attention).toHaveLength(0);
  });

  it('debería fallar si el personal no pertenece a un centro', async () => {
    service = await buildModule({
      userFindOne: jest.fn().mockResolvedValue({ healthcareWorker: null }),
    });

    await expect(service.stats(staff)).rejects.toThrow(ForbiddenException);
  });
});

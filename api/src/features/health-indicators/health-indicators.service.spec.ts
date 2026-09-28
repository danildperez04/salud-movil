import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { HealthIndicatorsService } from './health-indicators.service';
import { HealthIndicator } from './entities/health-indicator.entity';
import { TypeIndicator } from '../catalogues/entities/type-indicator.entity';
import { ClinicalRange } from '../catalogues/entities/clinical-range.entity';
import { User } from '../users/entities/user.entity';
import { PatientsService } from '../patients/patients.service';

describe('HealthIndicatorsService', () => {
  let service: HealthIndicatorsService;

  const patient = { id: 'pat-1', healthCenter: { id: 'hc-1' } };
  const currentUser = { sub: 'u-1', email: 'staff@test', role: 'health_staff' };
  const bloodPressure = {
    id: 1,
    name: 'Blood pressure',
    measurementUnit: 'mmHg',
  };
  const glucose = { id: 2, name: 'Glucose', measurementUnit: 'mg/dL' };

  const buildModule = async (overrides: {
    typeIndicatorFindOne?: jest.Mock;
    userFindOne?: jest.Mock;
    indicatorSave?: jest.Mock;
    indicatorFindOne?: jest.Mock;
    rangeFind?: jest.Mock;
    patients?: Partial<PatientsService>;
  }) => {
    const {
      typeIndicatorFindOne = jest.fn(),
      userFindOne = jest.fn(),
      indicatorSave = jest.fn(),
      indicatorFindOne = jest.fn(),
      rangeFind = jest.fn(),
      patients = {},
    } = overrides;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthIndicatorsService,
        {
          provide: getRepositoryToken(HealthIndicator),
          useValue: {
            save: indicatorSave,
            findOne: indicatorFindOne,
            create: jest.fn((input: unknown) => input),
          },
        },
        {
          provide: getRepositoryToken(TypeIndicator),
          useValue: { findOne: typeIndicatorFindOne },
        },
        {
          provide: getRepositoryToken(ClinicalRange),
          useValue: { find: rangeFind },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: userFindOne },
        },
        {
          provide: PatientsService,
          useValue: {
            findRecordForScope: jest.fn().mockResolvedValue(patient),
            ...patients,
          },
        },
      ],
    }).compile();

    return module.get<HealthIndicatorsService>(HealthIndicatorsService);
  };

  it('debería estar definido', async () => {
    service = await buildModule({});
    expect(service).toBeDefined();
  });

  it('debería exigir valueSecondary para la presión arterial', async () => {
    service = await buildModule({
      typeIndicatorFindOne: jest.fn().mockResolvedValue(bloodPressure),
    });

    await expect(
      service.create('pat-1', currentUser, { typeIndicatorId: 1, value: 120 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería clasificar como high cuando el valor supera el rango', async () => {
    const indicatorFindOne = jest
      .fn()
      .mockResolvedValueOnce({
        id: 'ind-1',
        value: '200',
        valueSecondary: null,
        dateHour: new Date('2026-09-27T10:00:00Z'),
        notes: null,
        typeIndicator: glucose,
        registeredBy: { id: 'u-1', name: 'Doc' },
      })
      .mockResolvedValue(null);

    service = await buildModule({
      typeIndicatorFindOne: jest.fn().mockResolvedValue(glucose),
      userFindOne: jest.fn().mockResolvedValue({ id: 'u-1', name: 'Doc' }),
      indicatorSave: jest.fn().mockResolvedValue({ id: 'ind-1' }),
      indicatorFindOne,
      rangeFind: jest.fn().mockResolvedValue([
        {
          typeIndicatorId: 2,
          minValue: 70,
          maxValue: 126,
          minValueSecondary: null,
          maxValueSecondary: null,
        },
      ]),
    });

    const result = await service.create('pat-1', currentUser, {
      typeIndicatorId: 2,
      value: 200,
    });

    expect(result.status).toBe('high');
    expect(result.value).toBe(200);
    expect(result.dateHour).toBeTruthy();
  });

  it('debería clasificar como low cuando el valor está bajo el rango', async () => {
    const indicatorFindOne = jest
      .fn()
      .mockResolvedValueOnce({
        id: 'ind-2',
        value: '60',
        valueSecondary: null,
        dateHour: new Date('2026-09-27T10:00:00Z'),
        notes: null,
        typeIndicator: glucose,
        registeredBy: { id: 'u-1', name: 'Doc' },
      })
      .mockResolvedValue(null);

    service = await buildModule({
      typeIndicatorFindOne: jest.fn().mockResolvedValue(glucose),
      userFindOne: jest.fn().mockResolvedValue({ id: 'u-1', name: 'Doc' }),
      indicatorSave: jest.fn().mockResolvedValue({ id: 'ind-2' }),
      indicatorFindOne,
      rangeFind: jest.fn().mockResolvedValue([
        {
          typeIndicatorId: 2,
          minValue: 70,
          maxValue: 126,
          minValueSecondary: null,
          maxValueSecondary: null,
        },
      ]),
    });

    const result = await service.create('pat-1', currentUser, {
      typeIndicatorId: 2,
      value: 60,
    });

    expect(result.status).toBe('low');
  });
});

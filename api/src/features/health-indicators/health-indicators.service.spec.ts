import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { HealthIndicatorsService } from './health-indicators.service';
import { HealthIndicator } from './entities/health-indicator.entity';
import { TypeIndicator } from '../catalogues/entities/type-indicator.entity';
import { ClinicalRange } from '../catalogues/entities/clinical-range.entity';
import { ClinicalRangeBandsService } from '../catalogues/clinical-range-bands.service';
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

  /** Bandas reales de glucosa, como las siembra el catálogo. */
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
          {
            severity: 'alert' as const,
            label: 'Glucosa baja',
            minValue: null,
            maxValue: 69.99,
          },
        ],
        secondary: [],
      },
    ],
  ]);

  /** Bandas de presión arterial: sistólica y diastólica por separado. */
  const bloodPressureBands = new Map([
    [
      1,
      {
        primary: [
          {
            severity: 'critical' as const,
            label: 'Sistólica crítica',
            minValue: 160,
            maxValue: null,
          },
          {
            severity: 'alert' as const,
            label: 'Sistólica elevada',
            minValue: 140,
            maxValue: 159.99,
          },
          {
            severity: 'normal' as const,
            label: 'Sistólica normal',
            minValue: 90,
            maxValue: 139.99,
          },
          {
            severity: 'alert' as const,
            label: 'Sistólica baja',
            minValue: null,
            maxValue: 89.99,
          },
        ],
        secondary: [
          {
            severity: 'critical' as const,
            label: 'Diastólica crítica',
            minValue: 110,
            maxValue: null,
          },
          {
            severity: 'alert' as const,
            label: 'Diastólica elevada',
            minValue: 90,
            maxValue: 109.99,
          },
          {
            severity: 'normal' as const,
            label: 'Diastólica normal',
            minValue: 60,
            maxValue: 89.99,
          },
          {
            severity: 'alert' as const,
            label: 'Diastólica baja',
            minValue: null,
            maxValue: 59.99,
          },
        ],
      },
    ],
  ]);

  const loadedIndicator = (overrides: Record<string, unknown> = {}) => ({
    id: 'ind-1',
    value: '200',
    valueSecondary: null,
    dateHour: new Date('2026-09-27T10:00:00Z'),
    notes: null,
    typeIndicator: glucose,
    registeredBy: { id: 'u-1', name: 'Doc' },
    ...overrides,
  });

  const buildModule = async (overrides: {
    typeIndicatorFindOne?: jest.Mock;
    userFindOne?: jest.Mock;
    indicatorSave?: jest.Mock;
    indicatorFindOne?: jest.Mock;
    rangeFind?: jest.Mock;
    bands?: Map<number, unknown>;
    patients?: Partial<PatientsService>;
  }) => {
    const {
      typeIndicatorFindOne = jest.fn(),
      userFindOne = jest.fn(),
      indicatorSave = jest.fn(),
      indicatorFindOne = jest.fn(),
      rangeFind = jest.fn(),
      bands = new Map(),
      patients = {},
    } = overrides;

    // El servicio real de bandas, con `match` verdadeiro y `loadAll` simulado.
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
        { provide: ClinicalRangeBandsService, useValue: bandsService },
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

  const registerIndicator = async (
    bands: Map<number, unknown>,
    indicator: Record<string, unknown>,
  ) => {
    service = await buildModule({
      bands,
      typeIndicatorFindOne: jest
        .fn()
        .mockResolvedValue(indicator.typeIndicator),
      userFindOne: jest.fn().mockResolvedValue({ id: 'u-1', name: 'Doc' }),
      indicatorSave: jest.fn().mockResolvedValue({ id: 'ind-1' }),
      indicatorFindOne: jest.fn().mockResolvedValue(indicator),
      rangeFind: jest.fn().mockResolvedValue([
        {
          typeIndicatorId: (indicator.typeIndicator as { id: number }).id,
          minValue: '70',
          maxValue: '126',
          minValueSecondary: null,
          maxValueSecondary: null,
        },
      ]),
    });

    return service.create('pat-1', currentUser, {
      typeIndicatorId: (indicator.typeIndicator as { id: number }).id,
      value: Number(indicator.value),
      ...(indicator.valueSecondary !== null &&
      indicator.valueSecondary !== undefined
        ? { valueSecondary: Number(indicator.valueSecondary) }
        : {}),
    });
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
    const result = await registerIndicator(
      glucoseBands,
      loadedIndicator({ value: '150' }),
    );

    // 150 supera el max de 126, así que sigue siendo 'high'...
    expect(result.status).toBe('high');
    // ...pero la banda lo gradúa como alerta, no como crítico.
    expect(result.severity).toBe('alert');
    expect(result.band).toBe('Glucosa elevada');
  });

  it('debería clasificar como low cuando el valor está bajo el rango', async () => {
    const result = await registerIndicator(
      glucoseBands,
      loadedIndicator({ value: '60' }),
    );

    expect(result.status).toBe('low');
    expect(result.severity).toBe('alert');
    expect(result.band).toBe('Glucosa baja');
  });

  it('debería distinguir una desviación moderada de una crítica', async () => {
    const moderada = await registerIndicator(
      glucoseBands,
      loadedIndicator({ id: 'a', value: '150' }),
    );
    const critica = await registerIndicator(
      glucoseBands,
      loadedIndicator({ id: 'b', value: '350' }),
    );

    // Con el modelo anterior min/max ambas daban 'high'. Las bandas separan.
    expect(moderada.status).toBe(critica.status);
    expect(moderada.severity).toBe('alert');
    expect(critica.severity).toBe('critical');
  });

  it('debería marcar como normal un valor dentro de rango', async () => {
    const result = await registerIndicator(
      glucoseBands,
      loadedIndicator({ value: '100' }),
    );

    expect(result.status).toBe('normal');
    expect(result.severity).toBe('normal');
  });

  it('debería dejar severity en null si no hay bandas para el tipo', async () => {
    const result = await registerIndicator(
      new Map(),
      loadedIndicator({ value: '150' }),
    );

    // Sin bandas se conserva la clasificación binaria, que es lo que evita
    // perder información en datos ya registrados.
    expect(result.status).toBe('high');
    expect(result.severity).toBeNull();
    expect(result.band).toBeNull();
  });

  it('debería tomar la severidad más grave entre sistólica y diastólica', async () => {
    // Sistólica elevada (140-159) pero diastólica crítica (>=110).
    const result = await registerIndicator(
      bloodPressureBands,
      loadedIndicator({
        typeIndicator: bloodPressure,
        value: '150',
        valueSecondary: '115',
      }),
    );

    expect(result.severity).toBe('critical');
    expect(result.band).toBe('Sistólica elevada / Diastólica crítica');
  });

  it('debería evaluar la diastólica contra las bandas secundarias', async () => {
    // Sistólica normal, diastólica elevada.
    const result = await registerIndicator(
      bloodPressureBands,
      loadedIndicator({
        typeIndicator: bloodPressure,
        value: '120',
        valueSecondary: '95',
      }),
    );

    expect(result.severity).toBe('alert');
    // Se reportan ambas bandas: la sistólica está normal, pero la diastólica
    // elevada es la que marca la alerta.
    expect(result.band).toBe('Sistólica normal / Diastólica elevada');
  });

  it('debería convertir el decimal a número', async () => {
    const result = await registerIndicator(
      glucoseBands,
      loadedIndicator({ value: '200.50' }),
    );

    expect(result.value).toBe(200.5);
    expect(typeof result.value).toBe('number');
  });
});

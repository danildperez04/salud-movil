import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException } from '@nestjs/common';
import { IpcpService } from './ipcp.service';
import {
  IPCP_CACHE_PREFIX,
  IPCP_LEVEL_CUTS,
  IPCP_SEVERITY_SCORE,
  IPCP_WEIGHTS,
} from './ipcp.constants';
import { PatientsService } from '../patients/patients.service';
import { HealthIndicator } from '../health-indicators/entities/health-indicator.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { MedicationReminder } from '../medications/entities/medication-reminder.entity';
import { MedicationSchedule } from '../medications/entities/medication-schedule.entity';
import { ClinicalRangeBandsService } from '../catalogues/clinical-range-bands.service';
import { Patient } from '../users/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

const PATIENT_ID = 'e89f308f-130d-4e98-8157-d9bdd8ba30f8';
const staff: JwtPayload = { sub: 'w-1', email: 's@test', role: 'health_staff' };
const admin: JwtPayload = { sub: 'u-1', email: 'a@test', role: 'admin' };

describe('IpcpService', () => {
  let service: IpcpService;

  /**
   * `loadAll` se simula, pero `match` se usa el real: es una función pura que
   * no toca el repositorio, y reimprimirla aquí haría que las pruebasaran una
   * copia que puede divergir de la de producción.
   */
  const bandsProvider = (overrides: Record<number, unknown> = {}) => ({
    loadAll: jest.fn().mockResolvedValue(new Map(bands)),
    match: (
      list: Parameters<ClinicalRangeBandsService['match']>[0],
      value: number,
    ) => ClinicalRangeBandsService.prototype.match(list, value),
    ...overrides,
  });

  /** Alcance por defecto: el paciente existe y está en el centro del staff. */
  const patientsServiceMock = (overrides: Record<string, unknown> = {}) => ({
    findRecordForScope: jest.fn().mockResolvedValue({ id: PATIENT_ID }),
    findByUserId: jest.fn().mockResolvedValue({ id: PATIENT_ID }),
    ...overrides,
  });

  const indicatorRepo = { find: jest.fn() };
  const appointmentRepo = { find: jest.fn() };
  const reminderRepo = { find: jest.fn() };
  const scheduleRepo = { find: jest.fn() };
  const userRepo = { findOne: jest.fn() };
  const patientRepo = { createQueryBuilder: jest.fn() };

  /** Cache en memoria: sin él el servicio no arranca y no se prueba el acierto. */
  const cacheStore = new Map<string, unknown>();
  const cacheProvider = {
    provide: CACHE_MANAGER,
    useValue: {
      get: jest.fn((key: string) => Promise.resolve(cacheStore.get(key))),
      set: jest.fn((key: string, value: unknown) => {
        cacheStore.set(key, value);
        return Promise.resolve(value);
      }),
      del: jest.fn((key: string) => {
        cacheStore.delete(key);
        return Promise.resolve(true);
      }),
    },
  };

  /** Ruta de entrada de cualquier test: monta el servicio con todos sus deps. */
  function baseProviders(): unknown[] {
    return [
      IpcpService,
      { provide: getRepositoryToken(HealthIndicator), useValue: indicatorRepo },
      { provide: getRepositoryToken(Appointment), useValue: appointmentRepo },
      {
        provide: getRepositoryToken(MedicationReminder),
        useValue: reminderRepo,
      },
      {
        provide: getRepositoryToken(MedicationSchedule),
        useValue: scheduleRepo,
      },
      { provide: getRepositoryToken(Patient), useValue: patientRepo },
      { provide: getRepositoryToken(User), useValue: userRepo },
      { provide: ClinicalRangeBandsService, useValue: bandsProvider() },
      { provide: PatientsService, useValue: patientsServiceMock() },
      cacheProvider,
    ];
  }

  /** Bandas reales sembradas: glucosa (2) y PA (1) con secundaria. */
  const bands = new Map([
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
    [
      1,
      {
        primary: [
          {
            severity: 'critical' as const,
            label: 'PA sistólica crítica',
            minValue: 180,
            maxValue: null,
          },
          {
            severity: 'alert' as const,
            label: 'PA sistólica elevada',
            minValue: 140,
            maxValue: 179.99,
          },
          {
            severity: 'normal' as const,
            label: 'PA sistólica normal',
            minValue: null,
            maxValue: 139.99,
          },
        ],
        secondary: [
          {
            severity: 'critical' as const,
            label: 'PA diastólica crítica',
            minValue: 120,
            maxValue: null,
          },
          {
            severity: 'alert' as const,
            label: 'PA diastólica elevada',
            minValue: 90,
            maxValue: 119.99,
          },
          {
            severity: 'normal' as const,
            label: 'PA diastólica normal',
            minValue: null,
            maxValue: 89.99,
          },
        ],
      },
    ],
    // El peso (3) no tiene entrada a propósito: reproduce la BD, donde
    // `cat_type_indicator` 3 no tiene rangos ni bandas sembradas.
  ]);

  const indicator = (
    typeId: number,
    value: number,
    daysAgo: number,
    secondary: number | null = null,
  ) => ({
    value: String(value),
    valueSecondary: secondary === null ? null : String(secondary),
    dateHour: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    typeIndicator: {
      id: typeId,
      name: typeId === 2 ? 'Glucose' : 'Blood pressure',
    },
  });

  const appointment = (daysAgo: number, state: string) => ({
    dateHour: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    appointmentState: { name: state },
  });

  const schedule = { id: 'sch-1' };
  const reminder = (daysAgo: number, confirmed: boolean) => ({
    dateHourScheduled: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    confirmationDate: confirmed ? new Date() : null,
  });

  beforeEach(async () => {
    cacheStore.clear();
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: baseProviders(),
    }).compile();

    service = moduleFixture.get(IpcpService);

    indicatorRepo.find.mockResolvedValue([]);
    appointmentRepo.find.mockResolvedValue([]);
    scheduleRepo.find.mockResolvedValue([]);
    reminderRepo.find.mockResolvedValue([]);
  });

  it('devuelve 0 y "low" cuando el paciente no tiene ningún dato', async () => {
    const result = await service.compute(PATIENT_ID);

    expect(result.score).toBe(0);
    expect(result.level).toBe('low');
    expect(result.computedFrom).toBeNull();
    expect(result.components.every((c) => c.score === null)).toBe(true);
    // Sin datos no se renormaliza a nada: el peso efectivo es 0.
    expect(result.components.every((c) => c.effectiveWeight === 0)).toBe(true);
  });

  it('renormaliza: sin adherencia, el resto absorbe el 100% del peso', async () => {
    // Glucosa 350 -> critical (100) y una cita pasada perdida -> 100.
    indicatorRepo.find.mockResolvedValue([indicator(2, 350, 1)]);
    scheduleRepo.find.mockResolvedValue([]);
    appointmentRepo.find.mockResolvedValue([appointment(10, 'No show')]);

    const result = await service.compute(PATIENT_ID);

    const deviation = result.components.find(
      (c) => c.key === 'indicatorDeviation',
    )!;
    const adherence = result.components.find((c) => c.key === 'adherence')!;
    const control = result.components.find(
      (c) => c.key === 'appointmentControl',
    )!;
    const trend = result.components.find((c) => c.key === 'trend')!;

    expect(adherence.score).toBeNull();
    expect(adherence.effectiveWeight).toBe(0);
    expect(trend.effectiveWeight).toBe(0);

    // 40 y 20 nominales sobre 60 disponibles -> 66.67% y 33.33%.
    expect(deviation.effectiveWeight).toBeCloseTo(66.67, 1);
    expect(control.effectiveWeight).toBeCloseTo(33.33, 1);

    // Solo hay 1 lectura, así que la tendencia no cuenta.
    expect(result.score).toBe(100);
  });

  it('aplica los pesos nominales cuando las cuatro variables tienen datos', async () => {
    indicatorRepo.find.mockResolvedValue([
      indicator(2, 350, 1), // critical, la más reciente -> peor banda y empeora
      indicator(2, 100, 5), // normal
    ]);
    scheduleRepo.find.mockResolvedValue([schedule]);
    // 2 de 4 tomas confirmadas -> 50 puntos de adherencia.
    reminderRepo.find.mockResolvedValue([
      reminder(1, true),
      reminder(2, true),
      reminder(3, false),
      reminder(4, false),
    ]);
    // 1 de 4 citas perdidas -> 25 puntos de control.
    appointmentRepo.find.mockResolvedValue([
      appointment(5, 'Completed'),
      appointment(6, 'Completed'),
      appointment(7, 'Completed'),
      appointment(8, 'No show'),
    ]);

    const result = await service.compute(PATIENT_ID);

    const byKey = Object.fromEntries(result.components.map((c) => [c.key, c]));
    expect(byKey.indicatorDeviation.score).toBe(100);
    expect(byKey.indicatorDeviation.effectiveWeight).toBe(
      IPCP_WEIGHTS.indicatorDeviation,
    );
    expect(byKey.adherence.score).toBe(50);
    expect(byKey.appointmentControl.score).toBe(25);
    expect(byKey.trend.score).toBe(100); // de normal a critical

    // 100*0.40 + 50*0.25 + 25*0.20 + 100*0.15 = 72.5 -> 73
    expect(result.score).toBe(73);
    expect(result.level).toBe('high');
  });

  describe('desviación: la peor banda manda', () => {
    it.each([
      [100, 'normal', 0],
      [150, 'alert', 50],
      [350, 'critical', 100],
    ])('glucosa %i cae en %s y puntúa %i', async (value, severity, score) => {
      indicatorRepo.find.mockResolvedValue([indicator(2, value, 1)]);

      const result = await service.compute(PATIENT_ID);
      const deviation = result.components[0];

      expect(deviation.score).toBe(score);
      expect(deviation.indicators?.[0].severity).toBe(severity);
    });

    it('usa la banda diastólica cuando la PA trae valor secundario', async () => {
      // Sistólica 130 (normal) pero diastólica 95 (alert): manda la diastólica.
      indicatorRepo.find.mockResolvedValue([indicator(1, 130, 1, 95)]);

      const result = await service.compute(PATIENT_ID);
      const deviation = result.components[0];

      expect(deviation.score).toBe(50);
      expect(deviation.indicators?.[0].valueSecondary).toBe(95);
      expect(deviation.indicators?.[0].severity).toBe('alert');
    });

    it('toma la peor banda entre varios tipos de indicador', async () => {
      indicatorRepo.find.mockResolvedValue([
        indicator(2, 100, 1), // glucose normal
        indicator(1, 190, 2, 125), // PA critical por diastólica
      ]);

      const result = await service.compute(PATIENT_ID);
      expect(result.components[0].score).toBe(100);
    });

    it('ignora el peso porque no tiene bandas configuradas', async () => {
      // Tipo 3 = Weight, sin entrada en el mapa de bandas.
      indicatorRepo.find.mockResolvedValue([indicator(3, 95, 1)]);

      const result = await service.compute(PATIENT_ID);
      expect(result.components[0].score).toBeNull();
    });
  });

  describe('adherencia', () => {
    it('puntúa 0 cuando todas las tomas están confirmadas', async () => {
      scheduleRepo.find.mockResolvedValue([schedule]);
      reminderRepo.find.mockResolvedValue([
        reminder(1, true),
        reminder(2, true),
      ]);

      const result = await service.compute(PATIENT_ID);
      const adherence = result.components.find((c) => c.key === 'adherence')!;
      expect(adherence.score).toBe(0);
    });

    it('puntúa 100 cuando ninguna toma está confirmada', async () => {
      scheduleRepo.find.mockResolvedValue([schedule]);
      reminderRepo.find.mockResolvedValue([
        reminder(1, false),
        reminder(2, false),
      ]);

      const result = await service.compute(PATIENT_ID);
      expect(result.components.find((c) => c.key === 'adherence')!.score).toBe(
        100,
      );
    });

    it('no cuenta tomas fuera de la ventana de 30 días', async () => {
      scheduleRepo.find.mockResolvedValue([schedule]);
      reminderRepo.find.mockResolvedValue([reminder(45, false)]);

      const result = await service.compute(PATIENT_ID);
      expect(
        result.components.find((c) => c.key === 'adherence')!.score,
      ).toBeNull();
    });
  });

  describe('cumplimiento de controles', () => {
    it('no cuenta las citas futuras como incumplimiento', async () => {
      appointmentRepo.find.mockResolvedValue([
        {
          dateHour: new Date(Date.now() + 86400000),
          appointmentState: { name: 'Scheduled' },
        },
      ]);

      const result = await service.compute(PATIENT_ID);
      expect(
        result.components.find((c) => c.key === 'appointmentControl')!.score,
      ).toBeNull();
    });

    it('cuenta canceladas y No show como incumplimiento', async () => {
      appointmentRepo.find.mockResolvedValue([
        appointment(3, 'Completed'),
        appointment(4, 'No show'),
        appointment(5, 'Cancelled'),
      ]);

      const result = await service.compute(PATIENT_ID);
      // 2 de 3 -> 66.67 -> 67
      expect(
        result.components.find((c) => c.key === 'appointmentControl')!.score,
      ).toBe(67);
    });

    it('ignora citas de hace más de 90 días', async () => {
      appointmentRepo.find.mockResolvedValue([appointment(120, 'No show')]);

      const result = await service.compute(PATIENT_ID);
      expect(
        result.components.find((c) => c.key === 'appointmentControl')!.score,
      ).toBeNull();
    });
  });

  describe('tendencia', () => {
    it('detecta empeoramiento cuando sube la severidad de la banda', async () => {
      indicatorRepo.find.mockResolvedValue([
        indicator(2, 350, 1), // critical, más reciente
        indicator(2, 100, 10), // normal
      ]);

      const result = await service.compute(PATIENT_ID);
      const trend = result.components.find((c) => c.key === 'trend')!;
      expect(trend.score).toBe(100);
      expect(trend.detail).toContain('empeora');
    });

    it('detecta mejora cuando baja la severidad de la banda', async () => {
      indicatorRepo.find.mockResolvedValue([
        indicator(2, 100, 1), // normal, más reciente
        indicator(2, 350, 10), // critical
      ]);

      const result = await service.compute(PATIENT_ID);
      const trend = result.components.find((c) => c.key === 'trend')!;
      expect(trend.score).toBe(0);
      expect(trend.detail).toContain('mejora');
    });

    it('detecta estabilidad con dos lecturas en la misma banda', async () => {
      indicatorRepo.find.mockResolvedValue([
        indicator(2, 150, 1),
        indicator(2, 160, 10),
      ]);

      const result = await service.compute(PATIENT_ID);
      expect(result.components.find((c) => c.key === 'trend')!.score).toBe(50);
    });

    it('compara la severidad, no el número: 38 -> 37 empeora', async () => {
      // Temperatura: 38 es alert, 37 es normal. El valor baja y aun así empeora
      // la gravedad, que es lo que importa clínicamente.
      const tempBands = new Map([
        [
          4,
          {
            primary: [
              {
                severity: 'critical' as const,
                label: 'Crítica',
                minValue: 39,
                maxValue: null,
              },
              {
                severity: 'alert' as const,
                label: 'Fiebre',
                minValue: 37.5,
                maxValue: 38.99,
              },
              {
                severity: 'normal' as const,
                label: 'Normal',
                minValue: null,
                maxValue: 37.49,
              },
            ],
            secondary: [],
          },
        ],
      ]);
      (service['bandsService'].loadAll as jest.Mock).mockResolvedValue(
        tempBands,
      );
      indicatorRepo.find.mockResolvedValue([
        {
          value: '37',
          valueSecondary: null,
          dateHour: new Date(Date.now() - 86400000),
          typeIndicator: { id: 4, name: 'Temperature' },
        },
        {
          value: '38',
          valueSecondary: null,
          dateHour: new Date(Date.now() - 10 * 86400000),
          typeIndicator: { id: 4, name: 'Temperature' },
        },
      ]);

      const result = await service.compute(PATIENT_ID);
      const trend = result.components.find((c) => c.key === 'trend')!;
      expect(trend.score).toBe(0); // de alert a normal: mejora
    });

    it('resuelve un empate entre mejora y empeoramiento como estable', async () => {
      // Un indicador empeora y otro mejora: no hay dirección mayoritaria. Marcarlo
      // como "mejora" bajaría el riesgo sin que los datos lo sostengan.
      indicatorRepo.find.mockResolvedValue([
        indicator(1, 190, 1, 125), // PA: empeora
        indicator(2, 100, 1), // glucose: mejora
        indicator(1, 130, 10, 80), // PA anterior: normal
        indicator(2, 350, 10), // glucose anterior: critical
      ]);

      const result = await service.compute(PATIENT_ID);
      const trend = result.components.find((c) => c.key === 'trend')!;
      expect(trend.score).toBe(50);
    });

    it('no puntúa con una sola lectura', async () => {
      indicatorRepo.find.mockResolvedValue([indicator(2, 150, 1)]);

      const result = await service.compute(PATIENT_ID);
      expect(
        result.components.find((c) => c.key === 'trend')!.score,
      ).toBeNull();
    });
  });

  describe('cortes de nivel', () => {
    it.each([
      [0, 'low'],
      [39, 'low'],
      [IPCP_LEVEL_CUTS.moderate, 'moderate'],
      [69, 'moderate'],
      [IPCP_LEVEL_CUTS.high, 'high'],
      [100, 'high'],
    ])('un score de %i es "%s"', (score, level) => {
      expect(service['levelFor'](score)).toBe(level);
    });
  });

  describe('constantes auditables', () => {
    it('los pesos suman 100', () => {
      const total = Object.values(IPCP_WEIGHTS).reduce((a, b) => a + b, 0);
      expect(total).toBe(100);
    });

    it('la severidad ordena normal < alert < critical', () => {
      expect(IPCP_SEVERITY_SCORE.normal).toBeLessThan(
        IPCP_SEVERITY_SCORE.alert,
      );
      expect(IPCP_SEVERITY_SCORE.alert).toBeLessThan(
        IPCP_SEVERITY_SCORE.critical,
      );
    });
  });

  describe('accesos', () => {
    it('rechaza a un paciente sin ficha asociada', async () => {
      const moduleFixture = await Test.createTestingModule({
        providers: baseProviders(),
      })
        .overrideProvider(PatientsService)
        .useValue(
          patientsServiceMock({
            findByUserId: jest.fn().mockResolvedValue(null),
          }),
        )
        .compile();
      const svc = moduleFixture.get(IpcpService);

      await expect(svc.forSelf(staff)).rejects.toThrow(ForbiddenException);
    });

    it('valida el alcance de centro antes de calcular', async () => {
      const findRecordForScope = jest
        .fn()
        .mockResolvedValue({ id: PATIENT_ID });
      const moduleFixture = await Test.createTestingModule({
        providers: baseProviders(),
      })
        .overrideProvider(PatientsService)
        .useValue(patientsServiceMock({ findRecordForScope }))
        .compile();
      const svc = moduleFixture.get(IpcpService);

      await svc.forPatient(PATIENT_ID, staff);

      expect(findRecordForScope).toHaveBeenCalledWith(PATIENT_ID, staff);
    });
  });

  describe('listado por lotes (GET /patients/ipcp)', () => {
    /** Deja lista la consulta de alcance con las filas indicadas. */
    function stubScope(
      rows: Array<{ id: string; name: string; email: string }>,
    ) {
      const qb: Record<string, jest.Mock> = {
        innerJoin: jest.fn(),
        select: jest.fn(),
        addSelect: jest.fn(),
        andWhere: jest.fn(),
        getRawMany: jest.fn().mockResolvedValue(rows),
      };
      for (const key of ['innerJoin', 'select', 'addSelect', 'andWhere']) {
        qb[key].mockReturnValue(qb);
      }
      patientRepo.createQueryBuilder.mockReturnValue(qb);
      return qb;
    }

    /** Glucosa crítica solo para el paciente indicado; el resto, sin datos. */
    function stubScores(perPatient: Record<string, number>) {
      indicatorRepo.find.mockImplementation(
        (options: { where: { patient: { id: string } } }) => {
          const value = perPatient[options.where.patient.id];
          return Promise.resolve(
            value === undefined ? [] : [indicator(2, value, 1)],
          );
        },
      );
    }

    it('devuelve identidad, score y componentes de cada paciente', async () => {
      stubScope([
        { id: 'p-high', name: 'Ana Pérez', email: 'ana@test.dev' },
        { id: 'p-low', name: 'Luis Gómez', email: 'luis@test.dev' },
      ]);
      stubScores({ 'p-high': 350 });

      const result = await service.getBatch({});

      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.data.map((row) => row.id)).toEqual(['p-high', 'p-low']);
      // Antes el listado devolvía `id` y `name` vacíos: la fila no era pintable.
      expect(result.data[0]).toMatchObject({
        id: 'p-high',
        name: 'Ana Pérez',
        email: 'ana@test.dev',
        score: 100,
        level: 'high',
        deviationScore: 100,
      });
      expect(result.data[1]).toMatchObject({
        id: 'p-low',
        name: 'Luis Gómez',
        score: 0,
        level: 'low',
        // Sin datos, cada variable es `null`, no un 0 inventado.
        adherenceScore: null,
        appointmentScore: null,
        trendScore: null,
      });
    });

    it('filtra por nivel antes de paginar, no después', async () => {
      stubScope([
        { id: 'p-high', name: 'Ana Pérez', email: 'ana@test.dev' },
        { id: 'p-low-1', name: 'Luis Gómez', email: 'luis@test.dev' },
        { id: 'p-low-2', name: 'María Ruiz', email: 'maria@test.dev' },
      ]);
      stubScores({ 'p-high': 350 });

      const page = await service.getBatch({ level: 'low', limit: 1, page: 2 });

      // El total es de la lista filtrada (2), no de la lista completa (3).
      expect(page.total).toBe(2);
      expect(page.totalPages).toBe(2);
      expect(page.data).toHaveLength(1);
      expect(page.data[0].id).toBe('p-low-2');
    });

    it('ordena por score descendente por defecto', async () => {
      stubScope([
        { id: 'p-low', name: 'Luis Gómez', email: 'luis@test.dev' },
        { id: 'p-high', name: 'Ana Pérez', email: 'ana@test.dev' },
      ]);
      stubScores({ 'p-high': 350 });

      const result = await service.getBatch({});

      expect(result.data.map((row) => row.id)).toEqual(['p-high', 'p-low']);
    });

    it('ordena por nombre cuando se pide', async () => {
      stubScope([
        { id: 'p-1', name: 'Zoe Díaz', email: 'zoe@test.dev' },
        { id: 'p-2', name: 'Ana Pérez', email: 'ana@test.dev' },
      ]);
      stubScores({});

      const result = await service.getBatch({
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expect(result.data.map((row) => row.name)).toEqual([
        'Ana Pérez',
        'Zoe Díaz',
      ]);
    });

    it('el admin ve todos los centros sin consultar el del usuario', async () => {
      const qb = stubScope([]);

      await service.getBatchForUser(admin, {});

      expect(userRepo.findOne).not.toHaveBeenCalled();
      expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it('el admin puede centrar el listado en un centro concreto', async () => {
      const qb = stubScope([]);

      await service.getBatchForUser(admin, { healthCenterId: 'hc-9' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'patient.health_center_id = :centerId',
        { centerId: 'hc-9' },
      );
    });

    it('el personal de salud ignora el centro pedido en la query', async () => {
      userRepo.findOne.mockResolvedValue({
        healthcareWorker: { healthCenter: { id: 'hc-1' } },
      });
      const qb = stubScope([]);

      await service.getBatchForUser(staff, { healthCenterId: 'hc-9' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'patient.health_center_id = :centerId',
        { centerId: 'hc-1' },
      );
    });

    it('el personal de salud solo ve los pacientes de su centro', async () => {
      userRepo.findOne.mockResolvedValue({
        healthcareWorker: { healthCenter: { id: 'hc-1' } },
      });
      const qb = stubScope([]);

      await service.getBatchForUser(staff, { search: '  ana  ' });

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: staff.sub },
        relations: { healthcareWorker: { healthCenter: true } },
      });
      expect(qb.andWhere).toHaveBeenCalledWith(
        'patient.health_center_id = :centerId',
        { centerId: 'hc-1' },
      );
      expect(qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('user.name ILIKE :term'),
        { term: '%ana%' },
      );
    });

    it('rechaza al personal sin centro asignado', async () => {
      userRepo.findOne.mockResolvedValue({
        healthcareWorker: { healthCenter: null },
      });
      stubScope([]);

      await expect(service.getBatchForUser(staff, {})).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('cache y precálculo', () => {
    /** Filas de alcance de un único paciente. */
    function stubScopeFor(id: string) {
      const qb: Record<string, jest.Mock> = {
        innerJoin: jest.fn(),
        select: jest.fn(),
        addSelect: jest.fn(),
        andWhere: jest.fn(),
        getRawMany: jest
          .fn()
          .mockResolvedValue([
            { id, name: 'Ana Pérez', email: 'ana@test.dev' },
          ]),
      };
      for (const key of ['innerJoin', 'select', 'addSelect', 'andWhere']) {
        qb[key].mockReturnValue(qb);
      }
      patientRepo.createQueryBuilder.mockReturnValue(qb);
    }

    it('calcula una vez y reutiliza la entrada en cache', async () => {
      const compute = jest.spyOn(service, 'compute').mockResolvedValue({
        score: 42,
        level: 'moderate',
        components: [],
        exclusions: [],
        computedFrom: null,
        generatedAt: new Date().toISOString(),
      });

      await service.getCachedOrCompute(PATIENT_ID);
      await service.getCachedOrCompute(PATIENT_ID);

      expect(compute).toHaveBeenCalledTimes(1);
      expect(cacheProvider.useValue.set).toHaveBeenCalledWith(
        `${IPCP_CACHE_PREFIX}${PATIENT_ID}`,
        expect.objectContaining({ score: 42 }),
        expect.any(Number),
      );
    });

    it('invalida la entrada del paciente afectado', async () => {
      await service.getCachedOrCompute(PATIENT_ID);
      expect(cacheStore.has(`${IPCP_CACHE_PREFIX}${PATIENT_ID}`)).toBe(true);

      await service.invalidateCache(PATIENT_ID);

      expect(cacheStore.has(`${IPCP_CACHE_PREFIX}${PATIENT_ID}`)).toBe(false);
    });

    it('el cron fuerza el recálculo en vez de leer el cache', async () => {
      stubScopeFor(PATIENT_ID);
      const compute = jest.spyOn(service, 'compute').mockResolvedValue({
        score: 70,
        level: 'high',
        components: [],
        exclusions: [],
        computedFrom: null,
        generatedAt: new Date().toISOString(),
      });

      await service.getCachedOrCompute(PATIENT_ID);
      compute.mockClear();

      await service.recalculateAllIpcp();

      // Si el cron leyera el cache, el índice envejecería hasta expirar.
      expect(compute).toHaveBeenCalledWith(PATIENT_ID);
    });

    it('una página vacía sigue reportando totalPages ≥ 1', async () => {
      stubScopeFor(PATIENT_ID);

      const result = await service.getBatch({ level: 'high' });

      expect(result.total).toBe(0);
      // Con totalPages en 0 el botón "Siguiente" quedaría habilitado.
      expect(result.totalPages).toBe(1);
      expect(result.data).toEqual([]);
    });
  });
});

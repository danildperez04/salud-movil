import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClinicalRangeBandsService } from './clinical-range-bands.service';
import { ClinicalRange } from './entities/clinical-range.entity';
import { ClinicalRangeBand } from './entities/clinical-range-band.entity';

describe('ClinicalRangeBandsService', () => {
  let service: ClinicalRangeBandsService;

  // clinical_range.id ≠ type_indicator_id a propósito: el cruce de claves es
  // justo lo que se debe verificar.
  const range = {
    id: 10,
    typeIndicatorId: 1,
    minValue: '90',
    maxValue: '139',
    minValueSecondary: '60',
    maxValueSecondary: '89',
  };

  const buildModule = async (overrides: {
    rangeFind?: jest.Mock;
    bandFind?: jest.Mock;
  }) => {
    const {
      rangeFind = jest.fn().mockResolvedValue([range]),
      bandFind = jest.fn().mockResolvedValue([]),
    } = overrides;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicalRangeBandsService,
        {
          provide: getRepositoryToken(ClinicalRange),
          useValue: { find: rangeFind },
        },
        {
          provide: getRepositoryToken(ClinicalRangeBand),
          useValue: { find: bandFind },
        },
      ],
    }).compile();

    return module.get<ClinicalRangeBandsService>(ClinicalRangeBandsService);
  };

  it('debería estar definido', async () => {
    service = await buildModule({});
    expect(service).toBeDefined();
  });

  it('debería indexar las bandas por type_indicator_id, no por clinical_range_id', async () => {
    const bandFind = jest.fn().mockResolvedValue([
      {
        id: 1,
        clinicalRangeId: 10,
        sequence: 1,
        severity: 'normal',
        valueKind: 'primary',
        minValue: '90',
        maxValue: '139.99',
        label: 'Normal',
      },
    ]);
    service = await buildModule({ bandFind });

    const result = await service.loadAll();

    // La banda referencia clinical_range_id=10, que corresponde a
    // type_indicator_id=1. Si se indexara por clinical_range_id, la banda
    // quedaría en una clave que nadie consulta y `primary` saldría vacío.
    expect(result.get(10)).toBeUndefined();
    expect(result.get(1)?.primary).toHaveLength(1);
    expect(result.get(1)?.primary[0].label).toBe('Normal');
  });

  it('debería separar las bandas primarias de las secundarias', async () => {
    const bandFind = jest.fn().mockResolvedValue([
      {
        id: 1,
        clinicalRangeId: 10,
        sequence: 1,
        severity: 'normal',
        valueKind: 'primary',
        minValue: '90',
        maxValue: '139.99',
        label: 'Sistólica normal',
      },
      {
        id: 2,
        clinicalRangeId: 10,
        sequence: 1,
        severity: 'normal',
        valueKind: 'secondary',
        minValue: '60',
        maxValue: '89.99',
        label: 'Diastólica normal',
      },
    ]);
    service = await buildModule({ bandFind });

    const result = await service.loadAll();

    expect(result.get(1)?.primary.map((b) => b.label)).toEqual([
      'Sistólica normal',
    ]);
    expect(result.get(1)?.secondary.map((b) => b.label)).toEqual([
      'Diastólica normal',
    ]);
  });

  it('debería ignorar bandas cuyo rango no existe', async () => {
    const bandFind = jest.fn().mockResolvedValue([
      {
        id: 1,
        clinicalRangeId: 999,
        sequence: 1,
        severity: 'normal',
        valueKind: 'primary',
        minValue: null,
        maxValue: null,
        label: 'Huérfana',
      },
    ]);
    service = await buildModule({ bandFind });

    const result = await service.loadAll();

    expect(result.get(1)?.primary).toHaveLength(0);
  });

  describe('match', () => {
    it('debería respetar los extremos abiertos', async () => {
      service = await buildModule({});
      const open = [
        {
          severity: 'critical' as const,
          label: 'Crítica',
          minValue: 200,
          maxValue: null,
        },
      ];

      expect(service.match(open, 350)).not.toBeNull();
      expect(service.match(open, 200)).not.toBeNull();
      expect(service.match(open, 199)).toBeNull();
    });

    it('debería devolver la primera banda que contiene el valor', async () => {
      service = await buildModule({});
      const bands = [
        {
          severity: 'critical' as const,
          label: 'Crítica',
          minValue: 200,
          maxValue: null,
        },
        {
          severity: 'alert' as const,
          label: 'Elevada',
          minValue: 126,
          maxValue: 199.99,
        },
        {
          severity: 'normal' as const,
          label: 'Normal',
          minValue: 70,
          maxValue: 125.99,
        },
      ];

      expect(service.match(bands, 350)?.label).toBe('Crítica');
      expect(service.match(bands, 150)?.label).toBe('Elevada');
      expect(service.match(bands, 100)?.label).toBe('Normal');
    });

    it('debería devolver null si el valor cae en un hueco', async () => {
      service = await buildModule({});
      const bands = [
        {
          severity: 'alert' as const,
          label: 'Elevada',
          minValue: 126,
          maxValue: 199.99,
        },
        {
          severity: 'normal' as const,
          label: 'Normal',
          minValue: 70,
          maxValue: 125.99,
        },
      ];

      expect(service.match(bands, 60)).toBeNull();
    });

    it('debería convertir los decimales a número', async () => {
      service = await buildModule({});
      const result = await service.loadAll();

      expect(result).toBeInstanceOf(Map);
      service = await buildModule({
        rangeFind: jest.fn().mockResolvedValue([range]),
        bandFind: jest.fn().mockResolvedValue([
          {
            id: 1,
            clinicalRangeId: 10,
            sequence: 1,
            severity: 'normal',
            valueKind: 'primary',
            minValue: '35.50',
            maxValue: '37.49',
            label: 'Normal',
          },
        ]),
      });

      const bands = await service.loadAll();
      expect(bands.get(1)?.primary[0].minValue).toBe(35.5);
      expect(bands.get(1)?.primary[0].maxValue).toBe(37.49);
    });
  });
});

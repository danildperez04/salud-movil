import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Patient } from '../users/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { PatientCaregiver } from '../users/entities/patient-caregiver.entity';
import { Caregiver } from '../users/entities/caregiver.entity';
import { RelationshipType } from '../catalogues/entities/relationship-type.entity';
import { Role } from '../catalogues/entities/role.entity';
import { Municipality } from '../catalogues/entities/municipality.entity';
import { Genre } from '../catalogues/entities/genre.entity';
import { HealthCenter } from '../health-centers/entities/health-center.entity';
import { MedicalRecord } from '../medical-records/entities/medical-record.entity';

describe('PatientsService', () => {
  let service: PatientsService;

  const patientWithUser = {
    id: 'pat-1',
    dateOfBirth: new Date('1990-01-01'),
    emergencyContactName: 'Ana',
    emergencyContactPhoneNumber: '5555',
    user: {
      id: 'pat-1',
      name: 'Pedro Gómez',
      email: 'pedro@test',
      username: 'pedro',
      passwordHash: 'x',
      phoneNumber: '1111',
      address: 'Managua',
      dni: null,
      isActive: true,
      municipality: { id: 1, name: 'Managua' },
    },
    genre: { id: 1, name: 'Masculino' },
    healthCenter: { id: 'hc-1', name: 'Centro A' },
  };

  const buildModule = async (overrides: {
    patientFindOne?: jest.Mock;
    patientSoftDelete?: jest.Mock;
    userSoftDelete?: jest.Mock;
    userSave?: jest.Mock;
    patientSave?: jest.Mock;
    healthCenterFindOne?: jest.Mock;
    medicalRecordQuery?: jest.Mock;
    createQueryBuilder?: jest.Mock;
    patientCreateQueryBuilder?: jest.Mock;
  }) => {
    const {
      patientFindOne = jest.fn(),
      patientSoftDelete = jest.fn(),
      userSoftDelete = jest.fn(),
      userSave = jest.fn(),
      patientSave = jest.fn(),
      healthCenterFindOne = jest.fn(),
      medicalRecordQuery = jest.fn().mockResolvedValue([]),
      createQueryBuilder = jest.fn(),
      patientCreateQueryBuilder = jest.fn(),
    } = overrides;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useValue: {
            findOne: patientFindOne,
            softDelete: patientSoftDelete,
            save: patientSave,
            createQueryBuilder: patientCreateQueryBuilder,
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            softDelete: userSoftDelete,
            save: userSave,
            findOne: jest.fn(),
          },
        },
        { provide: getRepositoryToken(PatientCaregiver), useValue: {} },
        { provide: getRepositoryToken(Caregiver), useValue: {} },
        { provide: getRepositoryToken(RelationshipType), useValue: {} },
        { provide: getRepositoryToken(Role), useValue: {} },
        { provide: getRepositoryToken(Municipality), useValue: {} },
        { provide: getRepositoryToken(Genre), useValue: {} },
        {
          provide: getRepositoryToken(HealthCenter),
          useValue: { findOne: healthCenterFindOne },
        },
        {
          provide: getRepositoryToken(MedicalRecord),
          useValue: { query: medicalRecordQuery, createQueryBuilder },
        },
        { provide: getDataSourceToken(), useValue: {} },
      ],
    }).compile();

    return module.get<PatientsService>(PatientsService);
  };

  const admin = { sub: 'u-admin', email: 'admin@test', role: 'admin' };
  const staff = { sub: 'u-staff', email: 'staff@test', role: 'health_staff' };

  /** Monta el servicio con los dos query builders encadenados que usa `findAll`. */
  const listAllWithLastVisit = async (
    lastVisitRows: { patientId: string; visitDate: string }[],
  ) => {
    const chained = <T extends object>(extra: T) => {
      const qb: Record<string, jest.Mock> = {};
      for (const method of [
        'select',
        'addSelect',
        'innerJoin',
        'where',
        'andWhere',
        'groupBy',
        'innerJoinAndSelect',
        'leftJoinAndSelect',
        'orderBy',
      ]) {
        qb[method] = jest.fn().mockReturnValue(qb);
      }
      return Object.assign(qb, extra);
    };

    const lastVisitQuery = chained({
      getRawMany: jest.fn().mockResolvedValue(lastVisitRows),
    });
    const patientQuery = chained({
      getMany: jest.fn().mockResolvedValue([patientWithUser]),
    });

    service = await buildModule({
      createQueryBuilder: jest.fn().mockReturnValue(lastVisitQuery),
      patientCreateQueryBuilder: jest.fn().mockReturnValue(patientQuery),
    });

    return service.findAll(admin);
  };

  it('debería estar definido', async () => {
    service = await buildModule({});
    expect(service).toBeDefined();
  });

  it('debería lanzar NotFound cuando el usuario está borrado lógicamente', async () => {
    // El LEFT JOIN de `user` viene filtrado por deleted_at IS NULL, así que una
    // fila `patient` huérfana llega con `user` en null. Debe tratarse como 404.
    service = await buildModule({
      patientFindOne: jest.fn().mockResolvedValue({
        ...patientWithUser,
        user: null,
      }),
    });

    await expect(service.findOne('pat-1', admin)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('debería borrar lógicamente el usuario y la fila del paciente', async () => {
    const userSoftDelete = jest.fn();
    const patientSoftDelete = jest.fn();
    service = await buildModule({
      patientFindOne: jest.fn().mockResolvedValue(patientWithUser),
      userSoftDelete,
      patientSoftDelete,
    });

    await service.remove('pat-1');

    expect(userSoftDelete).toHaveBeenCalledWith('pat-1');
    expect(patientSoftDelete).toHaveBeenCalledWith('pat-1');
  });

  it('debería impedir que el personal reasigne el centro de salud', async () => {
    service = await buildModule({
      patientFindOne: jest.fn().mockResolvedValue(patientWithUser),
    });

    await expect(
      service.update('pat-1', staff, { healthCenterId: 'hc-2' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('debería permitir que el admin reasigne el centro de salud', async () => {
    const newCenter = { id: 'hc-2', name: 'Centro B' };
    const patientSave = jest.fn();
    const patientFindOne = jest
      .fn()
      .mockResolvedValueOnce(patientWithUser)
      .mockResolvedValueOnce({ ...patientWithUser, healthCenter: newCenter });
    service = await buildModule({
      patientFindOne,
      patientSave,
      healthCenterFindOne: jest.fn().mockResolvedValue(newCenter),
    });

    const result = await service.update('pat-1', admin, {
      healthCenterId: 'hc-2',
    });

    expect(result.healthCenterName).toBe('Centro B');
  });

  it('debería exponer la fecha de la última consulta en el listado', async () => {
    const [patient] = await listAllWithLastVisit([
      { patientId: 'pat-1', visitDate: '2026-03-05T09:00:00Z' },
    ]);

    expect(patient.lastVisitAt).toBe('2026-03-05T09:00:00.000Z');
  });

  it('debería devolver null en lastVisitAt cuando no hay consultas', async () => {
    const [patient] = await listAllWithLastVisit([]);

    expect(patient.lastVisitAt).toBeNull();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { User } from '../src/features/users/entities/user.entity';
import { Patient } from '../src/features/users/entities/patient.entity';
import { HealthcareWorker } from '../src/features/users/entities/healthcare-worker.entity';
import { Role } from '../src/features/catalogues/entities/role.entity';
import { Genre } from '../src/features/catalogues/entities/genre.entity';
import { Municipality } from '../src/features/catalogues/entities/municipality.entity';
import { Major } from '../src/features/catalogues/entities/major.entity';
import { HealthCenter } from '../src/features/health-centers/entities/health-center.entity';
import { HealthCenterType } from '../src/features/catalogues/entities/health-center-type.entity';

const PASSWORD = 'Test1234!';

describe('RBAC y scoping por centro de salud (e2e)', () => {
  let app: INestApplication<App>;

  let adminToken: string;
  let staffToken: string;
  let patientToken: string;

  let patientInStaffCenter: string;
  let patientInOtherCenter: string;

  const login = async (email: string) => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: PASSWORD })
      .expect(201);
    return (response.body as { accessToken: string }).accessToken;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Misma configuración que `main.ts`, para que la ValidationPipe se pruebe de verdad.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    const suffix = Date.now();
    const users = app.get<Repository<User>>(getRepositoryToken(User));
    const patients = app.get<Repository<Patient>>(getRepositoryToken(Patient));
    const workers = app.get<Repository<HealthcareWorker>>(
      getRepositoryToken(HealthcareWorker),
    );
    const roles = app.get<Repository<Role>>(getRepositoryToken(Role));
    const genres = app.get<Repository<Genre>>(getRepositoryToken(Genre));
    const municipalities = app.get<Repository<Municipality>>(
      getRepositoryToken(Municipality),
    );
    const majors = app.get<Repository<Major>>(getRepositoryToken(Major));
    const centers = app.get<Repository<HealthCenter>>(
      getRepositoryToken(HealthCenter),
    );

    const [adminRole, staffRole, patientRole] = await Promise.all([
      roles.findOneByOrFail({ code: 'admin' }),
      roles.findOneByOrFail({ code: 'health_staff' }),
      roles.findOneByOrFail({ code: 'patient' }),
    ]);
    const genre = await genres.findOneByOrFail({ name: 'Masculino' });
    const municipality = await municipalities.findOneByOrFail({
      name: 'Managua',
    });
    const major = await majors.findOneByOrFail({ name: 'Medicina General' });

    // Centro propio del personal de salud, y un segundo centro ajeno.
    const centerType = await app
      .get<Repository<HealthCenterType>>(getRepositoryToken(HealthCenterType))
      .findOneByOrFail({ name: 'Centro de Salud' });
    const staffCenter =
      (await centers.findOneBy({
        name: 'Centro de Salud Carlos Núñez Téllez',
      })) ??
      (await centers.save({
        name: 'Centro E2E A',
        address: 'Dirección E2E',
        phoneNumber: '0000',
        healthCenterType: centerType,
        municipality,
      }));
    const otherCenter = await centers.save({
      name: `Centro E2E B ${suffix}`,
      address: 'Dirección E2E B',
      phoneNumber: '0000',
      healthCenterType: centerType,
      municipality,
    });

    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    const createUser = async (role: Role, username: string): Promise<User> =>
      users.save(
        users.create({
          name: `E2E ${username}`,
          email: `e2e-${username}-${suffix}@test.com`,
          username: `e2e${username}${suffix}`.slice(0, 48),
          passwordHash,
          phoneNumber: '0000-0000',
          address: 'Managua',
          role,
          municipality,
        }),
      );

    const createPatient = async (username: string, center: HealthCenter) => {
      const user = await createUser(patientRole, username);
      const patient = await patients.save(
        patients.create({
          id: user.id,
          dateOfBirth: new Date('1990-01-01'),
          emergencyContactName: 'Contacto',
          emergencyContactPhoneNumber: '5555',
          genre,
          healthCenter: center,
        }),
      );
      return { patient, user };
    };

    const admin = await createUser(adminRole, 'admin');
    const staff = await createUser(staffRole, 'staff');
    await workers.save(
      workers.create({
        id: staff.id,
        licenseNumber: `LIC-E2E-${suffix}`,
        employeeId: `EMP-E2E-${suffix}`,
        major,
        healthCenter: staffCenter,
        user: staff,
      }),
    );

    const own = await createPatient('patientown', staffCenter);
    const other = await createPatient('patientother', otherCenter);
    patientInStaffCenter = own.patient.id;
    patientInOtherCenter = other.patient.id;

    // Tokens reales: se validan contra la misma cadena de guards que la API.
    adminToken = await login(admin.email);
    staffToken = await login(staff.email);
    patientToken = await login(own.user.email);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Autenticación', () => {
    it('debería rechazar sin token con 401', async () => {
      await request(app.getHttpServer())
        .get(`/patients/${patientInStaffCenter}/health-indicators`)
        .expect(401);
    });

    it('debería rechazar un token inválido con 401', async () => {
      await request(app.getHttpServer())
        .get(`/patients/${patientInStaffCenter}/health-indicators`)
        .set('Authorization', 'Bearer no-es-un-jwt')
        .expect(401);
    });

    it('debería dejar pasar la ruta pública sin token', async () => {
      await request(app.getHttpServer()).get('/').expect(200);
    });

    it('debería proteger los catálogos con token', async () => {
      await request(app.getHttpServer())
        .get('/catalogues/type-indicators')
        .expect(401);
      await request(app.getHttpServer())
        .get('/catalogues/type-indicators')
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(200);
    });
  });

  describe('RBAC', () => {
    it('debería impedir que un paciente use una ruta de personal', async () => {
      await request(app.getHttpServer())
        .get(`/patients/${patientInStaffCenter}/health-indicators`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(403);
    });

    it('debería permitir que el personal use su propia ruta', async () => {
      await request(app.getHttpServer())
        .get(`/patients/${patientInStaffCenter}/health-indicators`)
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(200);
    });

    it('debería permitir que un paciente use sus rutas me/*', async () => {
      await request(app.getHttpServer())
        .get('/patients/me/health-indicators')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);
    });
  });

  describe('Scoping por centro de salud', () => {
    it('debería responder 404, no 403, con un paciente de otro centro', async () => {
      await request(app.getHttpServer())
        .get(`/patients/${patientInOtherCenter}/health-indicators`)
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(404);
    });

    it('debería aplicar el mismo scoping en el listado de pacientes', async () => {
      const response = await request(app.getHttpServer())
        .get('/patients')
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(200);

      const ids = (response.body as { id: string }[]).map((p) => p.id);
      expect(ids).toContain(patientInStaffCenter);
      expect(ids).not.toContain(patientInOtherCenter);
    });

    it('debería permitir al admin ver pacientes de cualquier centro', async () => {
      await request(app.getHttpServer())
        .get(`/patients/${patientInOtherCenter}/health-indicators`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  describe('ValidationPipe', () => {
    it('debería rechazar un campo no permitido con 400', async () => {
      await request(app.getHttpServer())
        .post('/patients/me/health-indicators')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({ typeIndicatorId: 1, value: 120, hack: true })
        .expect(400);
    });

    it('debería rechazar un tipo inválido con 400', async () => {
      await request(app.getHttpServer())
        .post('/patients/me/health-indicators')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({ typeIndicatorId: 'no-es-un-numero', value: 120 })
        .expect(400);
    });
  });
});

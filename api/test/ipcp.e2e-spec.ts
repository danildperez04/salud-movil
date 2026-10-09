import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
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

interface IpcpRow {
  id: string;
  name: string;
  email: string;
  score: number;
  level: string;
  updatedAt: string;
}

/**
 * El orden de rutas es la parte más frágil de este módulo: `GET /patients/ipcp`
 * y `GET /patients/:id` viven en controladores distintos, así que si
 * `IpcpModule` se registra después de `PatientsModule`, `:id` captura "ipcp"
 * y el lote responde 500 (`invalid input syntax for type uuid`). Este suite
 * existe para que ese fallo se vea en CI y no en producción.
 */
describe('Lote IPCP (GET /patients/ipcp) (e2e)', () => {
  let app: INestApplication<App>;

  let adminToken: string;
  let staffToken: string;
  let patientToken: string;

  let patientInStaffCenter: string;
  let patientInOtherCenter: string;
  let otherCenterId: string;

  const login = async (email: string) => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: PASSWORD })
      .expect(201);
    return (response.body as { accessToken: string }).accessToken;
  };

  const batch = (query = '', token = adminToken) =>
    request(app.getHttpServer())
      .get(`/patients/ipcp${query}`)
      .set('Authorization', `Bearer ${token}`);

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
    const centerType = await app
      .get<Repository<HealthCenterType>>(getRepositoryToken(HealthCenterType))
      .findOneByOrFail({ name: 'Centro de Salud' });

    const staffCenter = await centers.save({
      name: `Centro IPCP A ${suffix}`,
      address: 'Dirección IPCP',
      phoneNumber: '0000',
      healthCenterType: centerType,
      municipality,
    });
    const otherCenter = await centers.save({
      name: `Centro IPCP B ${suffix}`,
      address: 'Dirección IPCP B',
      phoneNumber: '0000',
      healthCenterType: centerType,
      municipality,
    });
    otherCenterId = otherCenter.id;

    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    const createUser = async (role: Role, username: string): Promise<User> =>
      users.save(
        users.create({
          name: `E2E IPCP ${username}`,
          email: `e2e-ipcp-${username}-${suffix}@test.com`,
          username: `e2eipcp${username}${suffix}`.slice(0, 48),
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
        licenseNumber: `LIC-IPCP-${suffix}`,
        employeeId: `EMP-IPCP-${suffix}`,
        major,
        healthCenter: staffCenter,
        user: staff,
      }),
    );

    const own = await createPatient('patientown', staffCenter);
    const other = await createPatient('patientother', otherCenter);
    patientInStaffCenter = own.patient.id;
    patientInOtherCenter = other.patient.id;

    adminToken = await login(admin.email);
    staffToken = await login(staff.email);
    patientToken = await login(own.user.email);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('La ruta literal no cae en GET /patients/:id', () => {
    it('devuelve 200 con el lote, no 500 por "ipcp" leído como uuid', async () => {
      const response = await batch().expect(200);
      const body = response.body as {
        data: IpcpRow[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };

      expect(Array.isArray(body.data)).toBe(true);
      expect(typeof body.total).toBe('number');
      expect(body.page).toBe(1);
      expect(body.limit).toBeGreaterThan(0);
      // Nunca 0: con totalPages en 0 el botón "Siguiente" de la web se queda habilitado.
      expect(body.totalPages).toBeGreaterThanOrEqual(1);
      expect(body.data.length).toBeLessThanOrEqual(body.limit);
    });

    it('cada fila trae identidad e IPCP calculado', async () => {
      const response = await batch('?search=patientown&limit=1000').expect(200);
      const rows = (response.body as { data: IpcpRow[] }).data;
      const row = rows.find((r) => r.id === patientInStaffCenter);

      expect(row).toBeDefined();
      expect(row).toMatchObject({ id: patientInStaffCenter });
      expect(typeof row?.name).toBe('string');
      expect(row?.name.length).toBeGreaterThan(0);
      expect(row?.email).toContain('@');
      expect(typeof row?.score).toBe('number');
      expect(['high', 'moderate', 'low']).toContain(row?.level);
      expect(typeof row?.updatedAt).toBe('string');
      expect(row?.score).toBeGreaterThanOrEqual(0);
      expect(row?.score).toBeLessThanOrEqual(100);
    });
  });

  describe('RBAC', () => {
    it('exige token', async () => {
      await request(app.getHttpServer()).get('/patients/ipcp').expect(401);
    });

    it('impide el lote a un paciente', async () => {
      await batch('', patientToken).expect(403);
    });

    it('permite el lote al personal de salud', async () => {
      await batch('', staffToken).expect(200);
    });
  });

  describe('Scoping por centro de salud', () => {
    it('el admin ve pacientes de ambos centros', async () => {
      const response = await batch('?limit=1000').expect(200);
      const ids = (response.body as { data: IpcpRow[] }).data.map((r) => r.id);

      expect(ids).toContain(patientInStaffCenter);
      expect(ids).toContain(patientInOtherCenter);
    });

    it('el admin puede limitar el lote a un centro con healthCenterId', async () => {
      const response = await batch(
        `?healthCenterId=${otherCenterId}&limit=1000`,
      ).expect(200);
      const ids = (response.body as { data: IpcpRow[] }).data.map((r) => r.id);

      expect(ids).toContain(patientInOtherCenter);
      expect(ids).not.toContain(patientInStaffCenter);
    });

    it('el personal solo ve los pacientes de su centro', async () => {
      const response = await batch('?limit=1000', staffToken).expect(200);
      const ids = (response.body as { data: IpcpRow[] }).data.map((r) => r.id);

      expect(ids).toContain(patientInStaffCenter);
      expect(ids).not.toContain(patientInOtherCenter);
    });
  });

  describe('Filtros y paginación', () => {
    it('filtra por nivel', async () => {
      const response = await batch('?level=high&limit=1000').expect(200);
      const rows = (response.body as { data: IpcpRow[] }).data;

      expect(rows.every((row) => row.level === 'high')).toBe(true);
      expect(rows).not.toContainEqual(
        expect.objectContaining({ id: patientInStaffCenter }),
      );
    });

    it('filtra por búsqueda', async () => {
      const response = await batch('?search=patientother').expect(200);
      const ids = (response.body as { data: IpcpRow[] }).data.map((r) => r.id);

      expect(ids).toContain(patientInOtherCenter);
      expect(ids).not.toContain(patientInStaffCenter);
    });

    it('pagina con limit y page', async () => {
      const response = await batch('?page=2&limit=1').expect(200);
      const body = response.body as {
        data: IpcpRow[];
        page: number;
        limit: number;
        total: number;
      };

      expect(body.page).toBe(2);
      expect(body.limit).toBe(1);
      expect(body.data.length).toBeLessThanOrEqual(1);
      expect(body.total).toBeGreaterThanOrEqual(2);
    });

    it('la fila del personal se obtiene con el IPCP individual', async () => {
      await request(app.getHttpServer())
        .get(`/patients/${patientInOtherCenter}/ipcp`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // El personal de otro centro sigue recibiendo 404, como en el resto de rutas.
      await request(app.getHttpServer())
        .get(`/patients/${patientInOtherCenter}/ipcp`)
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(404);
    });
  });

  describe('ValidationPipe', () => {
    it('rechaza un parámetro no permitido con 400', async () => {
      await batch('?foo=1').expect(400);
    });

    it('rechaza un nivel fuera de catálogo con 400', async () => {
      await batch('?level=bogus').expect(400);
    });

    it('rechaza un limit por encima del máximo con 400', async () => {
      await batch('?limit=5000').expect(400);
    });

    it('rechaza un page no numérico con 400', async () => {
      await batch('?page=abc').expect(400);
    });
  });
});

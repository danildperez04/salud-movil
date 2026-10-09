import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ThrottlerStorage } from '@nestjs/throttler';
import { Repository } from 'typeorm';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DemoRequest } from '../src/features/demo-requests/entities/demo-request.entity';
import { User } from '../src/features/users/entities/user.entity';
import { Role } from '../src/features/catalogues/entities/role.entity';
import { Municipality } from '../src/features/catalogues/entities/municipality.entity';

const PASSWORD = 'Test1234!';
const BOOT_TIMEOUT_MS = 120_000;

interface Page {
  items: DemoRequest[];
  total: number;
  page: number;
  pageSize: number;
}

const buildApp = async (options: {
  throttling: boolean;
}): Promise<INestApplication<App>> => {
  const builder = Test.createTestingModule({ imports: [AppModule] });
  if (!options.throttling) {
    builder.overrideProvider(ThrottlerStorage).useValue({
      increment: () =>
        Promise.resolve({
          totalHits: 1,
          timeToExpire: 60,
          isBlocked: false,
          timeToBlockExpire: 0,
        }),
    });
  }
  const moduleFixture: TestingModule = await builder.compile();
  const app = moduleFixture.createNestApplication<INestApplication<App>>();
  // Misma configuración que `main.ts`, para que la ValidationPipe se pruebe de verdad.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.init();
  return app;
};

describe('Solicitudes de demo (e2e)', () => {
  let app: INestApplication<App>;
  let users: Repository<User>;
  let demoRequests: Repository<DemoRequest>;
  const createdUsers: string[] = [];
  let adminToken: string;
  let caregiverToken: string;

  const uniqueEmail = () =>
    `e2e-demo-${Date.now()}${Math.floor(Math.random() * 10000)}@test.com`;

  const validBody = (overrides: Record<string, unknown> = {}) => ({
    name: 'Dra. Ana Pérez',
    email: uniqueEmail(),
    organization: 'Centro de Salud Central',
    ...overrides,
  });

  const submit = (body: Record<string, unknown>) =>
    request(app.getHttpServer()).post('/demo-requests').send(body);

  const createUser = async (roleCode: string): Promise<string> => {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const role = await app
      .get<Repository<Role>>(getRepositoryToken(Role))
      .findOneByOrFail({ code: roleCode });
    const municipality = await app
      .get<Repository<Municipality>>(getRepositoryToken(Municipality))
      .findOneByOrFail({ name: 'Managua' });
    const user = await users.save(
      users.create({
        name: `E2E ${roleCode}`,
        email: `e2e-demo-${roleCode}-${suffix}@test.com`,
        username: `e2edemo${suffix}`.slice(0, 48),
        passwordHash: await bcrypt.hash(PASSWORD, 4),
        phoneNumber: '0000-0000',
        address: 'Managua',
        role,
        municipality,
      }),
    );
    createdUsers.push(user.id);
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: PASSWORD })
      .expect(201);
    return (login.body as { accessToken: string }).accessToken;
  };

  beforeAll(async () => {
    app = await buildApp({ throttling: false });
    users = app.get<Repository<User>>(getRepositoryToken(User));
    demoRequests = app.get<Repository<DemoRequest>>(
      getRepositoryToken(DemoRequest),
    );
    adminToken = await createUser('admin');
    caregiverToken = await createUser('caregiver');
  }, BOOT_TIMEOUT_MS);

  afterAll(async () => {
    await demoRequests.clear();
    if (createdUsers.length) await users.delete(createdUsers);
    await app.close();
  });

  describe('formulario público', () => {
    it('guarda la solicitud sin exigir sesión y normaliza el correo', async () => {
      const email = uniqueEmail().toUpperCase();
      const res = await submit(
        validBody({
          email,
          jobTitle: '  Directora  ',
          phoneNumber: '+505 8888-1234',
          message: 'Queremos verlo con pacientes crónicos',
        }),
      ).expect(201);
      expect(res.body).toEqual({
        message: expect.stringContaining('Recibimos') as string,
      });

      const saved = await demoRequests.findOneByOrFail({
        email: email.toLowerCase(),
      });
      expect(saved).toMatchObject({
        status: 'pending',
        jobTitle: 'Directora',
        phoneNumber: '+505 8888-1234',
        adminNotes: null,
      });
    });

    it('acepta los campos opcionales vacíos que manda el formulario', async () => {
      const email = uniqueEmail();
      await submit(
        validBody({ email, jobTitle: '', phoneNumber: '', message: '' }),
      ).expect(201);
      const saved = await demoRequests.findOneByOrFail({ email });
      expect(saved.jobTitle).toBeNull();
      expect(saved.phoneNumber).toBeNull();
      expect(saved.message).toBeNull();
    });

    it('rechaza datos inválidos y campos desconocidos', async () => {
      await submit(validBody({ email: 'no-es-correo' })).expect(400);
      await submit(validBody({ name: 'A' })).expect(400);
      await submit(validBody({ organization: '' })).expect(400);
      await submit(validBody({ phoneNumber: 'abc' })).expect(400);
      await submit(validBody({ status: 'completed' })).expect(400);
      await submit({ email: uniqueEmail() }).expect(400);
    });

    it('descarta en silencio lo que llena el señuelo anti-bots', async () => {
      const email = uniqueEmail();
      // Misma respuesta que un envío real: el bot no debe notar la diferencia.
      await submit(validBody({ email, website: 'http://spam.example' })).expect(
        201,
      );
      expect(await demoRequests.existsBy({ email })).toBe(false);
    });

    it('no duplica una solicitud pendiente del mismo correo', async () => {
      const email = uniqueEmail();
      await submit(validBody({ email })).expect(201);
      await submit(validBody({ email, name: 'Otra Persona' })).expect(201);
      expect(await demoRequests.countBy({ email })).toBe(1);
    });
  });

  describe('límite de peticiones', () => {
    it(
      'corta los envíos repetidos con 429',
      async () => {
        const limited = await buildApp({ throttling: true });
        try {
          const send = () =>
            request(limited.getHttpServer())
              .post('/demo-requests')
              .send({ ...validBody(), website: 'bot' });
          for (let i = 0; i < 5; i++) await send().expect(201);
          await send().expect(429);
        } finally {
          await limited.close();
        }
      },
      BOOT_TIMEOUT_MS,
    );
  });

  describe('panel de administración', () => {
    it('exige sesión y rol admin', async () => {
      await request(app.getHttpServer())
        .get('/admin/demo-requests')
        .expect(401);
      await request(app.getHttpServer())
        .get('/admin/demo-requests')
        .set('Authorization', `Bearer ${caregiverToken}`)
        .expect(403);
      await request(app.getHttpServer())
        .get('/admin/demo-requests/stats')
        .set('Authorization', `Bearer ${caregiverToken}`)
        .expect(403);
    });

    it('lista paginado, filtra por estado y busca sin tratar % como comodín', async () => {
      await demoRequests.clear();
      const marker = `Hospital-${Date.now()}`;
      const a = await demoRequests.save(
        demoRequests.create({
          name: 'Ana',
          email: uniqueEmail(),
          organization: `${marker} Norte`,
        }),
      );
      await demoRequests.save(
        demoRequests.create({
          name: 'Luis',
          email: uniqueEmail(),
          organization: `${marker} Sur`,
          status: 'contacted',
        }),
      );
      const auth = { Authorization: `Bearer ${adminToken}` };

      const all = await request(app.getHttpServer())
        .get('/admin/demo-requests')
        .set(auth)
        .expect(200);
      expect((all.body as Page).total).toBe(2);

      const pending = await request(app.getHttpServer())
        .get('/admin/demo-requests?status=pending')
        .set(auth)
        .expect(200);
      expect((pending.body as Page).items.map((r) => r.id)).toEqual([a.id]);

      const paged = await request(app.getHttpServer())
        .get('/admin/demo-requests?pageSize=1&page=2')
        .set(auth)
        .expect(200);
      expect(paged.body).toMatchObject({ total: 2, page: 2, pageSize: 1 });
      expect((paged.body as Page).items).toHaveLength(1);

      const byOrg = await request(app.getHttpServer())
        .get(`/admin/demo-requests?search=${marker}%20Sur`)
        .set(auth)
        .expect(200);
      expect((byOrg.body as Page).total).toBe(1);

      // "%" literal: no coincide con todo.
      const wildcard = await request(app.getHttpServer())
        .get('/admin/demo-requests?search=%25')
        .set(auth)
        .expect(200);
      expect((wildcard.body as Page).total).toBe(0);

      await request(app.getHttpServer())
        .get('/admin/demo-requests?status=inventado')
        .set(auth)
        .expect(400);
    });

    it('cuenta por estado, incluidos los que están en cero', async () => {
      const stats = await request(app.getHttpServer())
        .get('/admin/demo-requests/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(stats.body).toEqual({
        pending: 1,
        contacted: 1,
        scheduled: 0,
        completed: 0,
        discarded: 0,
      });
    });

    it('actualiza estado y notas, y borra', async () => {
      const row = await demoRequests.save(
        demoRequests.create({
          name: 'Marta',
          email: uniqueEmail(),
          organization: 'Clínica',
        }),
      );
      const auth = { Authorization: `Bearer ${adminToken}` };

      const updated = await request(app.getHttpServer())
        .patch(`/admin/demo-requests/${row.id}`)
        .set(auth)
        .send({ status: 'scheduled', adminNotes: '  Demo el lunes  ' })
        .expect(200);
      expect(updated.body).toMatchObject({
        status: 'scheduled',
        adminNotes: 'Demo el lunes',
      });

      // Cadena vacía limpia las notas.
      const cleared = await request(app.getHttpServer())
        .patch(`/admin/demo-requests/${row.id}`)
        .set(auth)
        .send({ adminNotes: '' })
        .expect(200);
      expect((cleared.body as DemoRequest).adminNotes).toBeNull();

      await request(app.getHttpServer())
        .patch(`/admin/demo-requests/${row.id}`)
        .set(auth)
        .send({ status: 'inventado' })
        .expect(400);
      await request(app.getHttpServer())
        .patch('/admin/demo-requests/no-es-uuid')
        .set(auth)
        .send({ status: 'completed' })
        .expect(400);

      await request(app.getHttpServer())
        .delete(`/admin/demo-requests/${row.id}`)
        .set(auth)
        .expect(204);
      await request(app.getHttpServer())
        .delete(`/admin/demo-requests/${row.id}`)
        .set(auth)
        .expect(404);
    });
  });
});

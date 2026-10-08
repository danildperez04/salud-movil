import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ThrottlerStorage } from '@nestjs/throttler';
import { Repository } from 'typeorm';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { OtpDelivery, OtpMessage } from '../src/features/auth/otp-delivery';
import { OTP_MAX_ATTEMPTS } from '../src/features/auth/two-factor.service';
import { User } from '../src/features/users/entities/user.entity';
import { Role } from '../src/features/catalogues/entities/role.entity';
import { Municipality } from '../src/features/catalogues/entities/municipality.entity';

const PASSWORD = 'Test1234!';
const BOOT_TIMEOUT_MS = 120_000;

interface Challenge {
  requiresTwoFactor: true;
  challengeId: string;
  expiresAt: string;
}
interface Session {
  accessToken: string;
  user: { twoFactorEnabled: boolean };
}

const buildApp = async (
  options: { throttling: boolean },
  sent: OtpMessage[],
): Promise<INestApplication<App>> => {
  const builder = Test.createTestingModule({
    imports: [AppModule],
  })
    // El canal real escribe en el log: aquí se captura para poder leer el código.
    .overrideProvider(OtpDelivery)
    .useValue({
      send: (message: OtpMessage) => {
        sent.push(message);
        return Promise.resolve();
      },
    });

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

describe('Verificación en dos pasos por OTP (e2e)', () => {
  let app: INestApplication<App>;
  let users: Repository<User>;
  let role: Role;
  let municipality: Municipality;
  const sent: OtpMessage[] = [];
  const createdIds: string[] = [];

  const createUser = async (): Promise<string> => {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const user = await users.save(
      users.create({
        name: 'E2E 2FA',
        email: `e2e-2fa-${suffix}@test.com`,
        username: `e2e2fa${suffix}`.slice(0, 48),
        passwordHash: await bcrypt.hash(PASSWORD, 4),
        phoneNumber: '0000-0000',
        address: 'Managua',
        role,
        municipality,
      }),
    );
    createdIds.push(user.id);
    return user.email;
  };

  const lastCode = (): string => sent[sent.length - 1].code;
  const wrongCode = (): string =>
    lastCode() === '000000' ? '111111' : '000000';

  // Sin `async`: devuelve el objeto de supertest para poder encadenar `.expect`.
  const login = (email: string, password = PASSWORD) =>
    request(app.getHttpServer()).post('/auth/login').send({ email, password });

  const plainSession = async (email: string): Promise<Session> =>
    (await login(email)).body as Session;

  const verify = (challengeId: string, code: string) =>
    request(app.getHttpServer())
      .post('/auth/2fa/verify')
      .send({ challengeId, code });

  /** Activa el 2FA recorriendo el flujo real (enable + confirm). */
  const enableTwoFactor = async (email: string): Promise<void> => {
    const { accessToken } = await plainSession(email);
    const started = await request(app.getHttpServer())
      .post('/auth/2fa/enable')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
    await request(app.getHttpServer())
      .post('/auth/2fa/enable/confirm')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        challengeId: (started.body as Challenge).challengeId,
        code: lastCode(),
      })
      .expect(201);
  };

  beforeAll(async () => {
    app = await buildApp({ throttling: false }, sent);
    users = app.get<Repository<User>>(getRepositoryToken(User));
    role = await app
      .get<Repository<Role>>(getRepositoryToken(Role))
      .findOneByOrFail({ code: 'caregiver' });
    municipality = await app
      .get<Repository<Municipality>>(getRepositoryToken(Municipality))
      .findOneByOrFail({ name: 'Managua' });
    // El primer arranque en una base vacía ejecuta el seed y supera los 5 s por defecto.
  }, BOOT_TIMEOUT_MS);

  afterAll(async () => {
    // Borrado físico: los desafíos caen por ON DELETE CASCADE.
    if (createdIds.length) {
      await users.delete(createdIds);
    }
    await app.close();
  });

  describe('activación', () => {
    it('activa el 2FA tras confirmar el código recibido', async () => {
      const email = await createUser();
      const { accessToken } = await plainSession(email);
      const auth = { Authorization: `Bearer ${accessToken}` };

      const started = await request(app.getHttpServer())
        .post('/auth/2fa/enable')
        .set(auth)
        .expect(201);
      expect(sent[sent.length - 1]).toMatchObject({
        purpose: 'enable',
        recipient: { email },
      });

      await request(app.getHttpServer())
        .post('/auth/2fa/enable/confirm')
        .set(auth)
        .send({
          challengeId: (started.body as Challenge).challengeId,
          code: lastCode(),
        })
        .expect(201)
        .expect({ twoFactorEnabled: true });

      const me = await request(app.getHttpServer())
        .get('/auth/me')
        .set(auth)
        .expect(200);
      expect((me.body as { twoFactorEnabled: boolean }).twoFactorEnabled).toBe(
        true,
      );
    });

    it('un código incorrecto da 400 (no 401, que cerraría la sesión del cliente) y no activa nada', async () => {
      const email = await createUser();
      const { accessToken } = await plainSession(email);
      const auth = { Authorization: `Bearer ${accessToken}` };

      const started = await request(app.getHttpServer())
        .post('/auth/2fa/enable')
        .set(auth)
        .expect(201);
      await request(app.getHttpServer())
        .post('/auth/2fa/enable/confirm')
        .set(auth)
        .send({
          challengeId: (started.body as Challenge).challengeId,
          code: wrongCode(),
        })
        .expect(400);

      const again = await login(email).expect(201);
      expect(again.body).toHaveProperty('accessToken');
    });

    it('no se puede iniciar la activación dos veces', async () => {
      const email = await createUser();
      await enableTwoFactor(email);

      const challenge = (await login(email).expect(201)).body as Challenge;
      const session = (await verify(challenge.challengeId, lastCode()).expect(
        201,
      )) as { body: Session };

      await request(app.getHttpServer())
        .post('/auth/2fa/enable')
        .set('Authorization', `Bearer ${session.body.accessToken}`)
        .expect(409);
    });

    it('exige estar autenticado', async () => {
      await request(app.getHttpServer()).post('/auth/2fa/enable').expect(401);
      await request(app.getHttpServer()).post('/auth/2fa/disable').expect(401);
    });
  });

  describe('login con 2FA', () => {
    it('la contraseña sola no da sesión: devuelve un desafío, y ese id no sirve como token', async () => {
      const email = await createUser();
      await enableTwoFactor(email);

      const response = await login(email).expect(201);
      const body = response.body as Challenge;

      expect(body.requiresTwoFactor).toBe(true);
      expect(body).not.toHaveProperty('accessToken');
      expect(body).not.toHaveProperty('user');

      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${body.challengeId}`)
        .expect(401);
    });

    it('con el código correcto entrega la sesión, y esa sesión funciona', async () => {
      const email = await createUser();
      await enableTwoFactor(email);
      const { challengeId } = (await login(email).expect(201))
        .body as Challenge;

      const response = await verify(challengeId, lastCode()).expect(201);
      const session = response.body as Session;

      expect(session.user.twoFactorEnabled).toBe(true);
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${session.accessToken}`)
        .expect(200);
    });

    it('el código es de un solo uso', async () => {
      const email = await createUser();
      await enableTwoFactor(email);
      const { challengeId } = (await login(email).expect(201))
        .body as Challenge;
      const code = lastCode();

      await verify(challengeId, code).expect(201);
      await verify(challengeId, code).expect(401);
    });

    it('un código incorrecto da 401', async () => {
      const email = await createUser();
      await enableTwoFactor(email);
      const { challengeId } = (await login(email).expect(201))
        .body as Challenge;

      await verify(challengeId, wrongCode()).expect(401);
    });

    it(`tras ${OTP_MAX_ATTEMPTS} fallos el desafío muere, incluso con el código correcto`, async () => {
      const email = await createUser();
      await enableTwoFactor(email);
      const { challengeId } = (await login(email).expect(201))
        .body as Challenge;
      const correct = lastCode();
      const wrong = wrongCode();

      for (let i = 0; i < OTP_MAX_ATTEMPTS; i++) {
        await verify(challengeId, wrong).expect(401);
      }
      await verify(challengeId, correct).expect(401);
    });

    it('las adivinanzas en paralelo tampoco superan el máximo de intentos', async () => {
      const email = await createUser();
      await enableTwoFactor(email);
      const { challengeId } = (await login(email).expect(201))
        .body as Challenge;
      const correct = lastCode();
      const wrong = wrongCode();

      // Más peticiones de las permitidas, lanzadas a la vez, y la correcta al final.
      await Promise.all(
        Array.from({ length: OTP_MAX_ATTEMPTS * 2 }, () =>
          verify(challengeId, wrong),
        ),
      );
      await verify(challengeId, correct).expect(401);
    });

    it('un login nuevo invalida el código anterior', async () => {
      const email = await createUser();
      await enableTwoFactor(email);

      const first = (await login(email).expect(201)).body as Challenge;
      const firstCode = lastCode();
      const second = (await login(email).expect(201)).body as Challenge;
      const secondCode = lastCode();

      await verify(first.challengeId, firstCode).expect(401);
      await verify(second.challengeId, secondCode).expect(201);
    });

    it('con la contraseña incorrecta no se envía ningún código', async () => {
      const email = await createUser();
      await enableTwoFactor(email);
      const before = sent.length;

      await login(email, 'incorrecta').expect(401);

      expect(sent.length).toBe(before);
    });

    it('reenviar de inmediato da 429 (enfriamiento)', async () => {
      const email = await createUser();
      await enableTwoFactor(email);
      const { challengeId } = (await login(email).expect(201))
        .body as Challenge;

      await request(app.getHttpServer())
        .post('/auth/2fa/resend')
        .send({ challengeId })
        .expect(429);
    });

    it('valida el formato de la petición', async () => {
      await verify('no-es-un-uuid', '123456').expect(400);
      await verify('0b1f6a52-98b2-4d6f-9d3c-1f6d1c2b7a10', 'abc').expect(400);
      await verify('0b1f6a52-98b2-4d6f-9d3c-1f6d1c2b7a10', '12345').expect(400);
    });
  });

  describe('desactivación', () => {
    it('exige la contraseña y, con ella, devuelve el login a un solo paso', async () => {
      const email = await createUser();
      await enableTwoFactor(email);
      const { challengeId } = (await login(email).expect(201))
        .body as Challenge;
      const { accessToken } = (
        await verify(challengeId, lastCode()).expect(201)
      ).body as Session;
      const auth = { Authorization: `Bearer ${accessToken}` };

      await request(app.getHttpServer())
        .post('/auth/2fa/disable')
        .set(auth)
        .send({ password: 'incorrecta' })
        .expect(400);
      expect(((await login(email)).body as Challenge).requiresTwoFactor).toBe(
        true,
      );

      await request(app.getHttpServer())
        .post('/auth/2fa/disable')
        .set(auth)
        .send({ password: PASSWORD })
        .expect(201)
        .expect({ twoFactorEnabled: false });

      expect((await login(email).expect(201)).body).toHaveProperty(
        'accessToken',
      );
    });
  });
});

describe('Límite de peticiones del 2FA (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await buildApp({ throttling: true }, []);
  }, BOOT_TIMEOUT_MS);

  afterAll(async () => {
    await app.close();
  });

  it('verify responde 429 al pasar de 5 peticiones por minuto', async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) {
      const response = await request(app.getHttpServer())
        .post('/auth/2fa/verify')
        .send({});
      statuses.push(response.status);
    }
    // Los guards corren antes que la ValidationPipe: las 5 primeras llegan a
    // validarse (400) y a partir de la sexta el límite corta con 429.
    expect(statuses.slice(0, 5)).toEqual([400, 400, 400, 400, 400]);
    expect(statuses.slice(5)).toEqual([429, 429]);
  });
});

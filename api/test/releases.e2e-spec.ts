import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ThrottlerStorage } from '@nestjs/throttler';
import { Repository } from 'typeorm';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AppRelease } from '../src/features/releases/entities/app-release.entity';
import { RELEASES_DIR } from '../src/features/releases/release-upload';
import { User } from '../src/features/users/entities/user.entity';
import { Role } from '../src/features/catalogues/entities/role.entity';
import { Municipality } from '../src/features/catalogues/entities/municipality.entity';

const PASSWORD = 'Test1234!';
const BOOT_TIMEOUT_MS = 120_000;

/** Un "APK" mínimo: empieza con la firma ZIP (PK\x03\x04), que es lo que se valida. */
const fakeApk = (marker: string) =>
  Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.from(marker)]);

describe('Instaladores de la app (e2e)', () => {
  let app: INestApplication<App>;
  let users: Repository<User>;
  let releases: Repository<AppRelease>;
  const createdUsers: string[] = [];
  let adminToken: string;
  let caregiverToken: string;
  const version = () =>
    `9.${Math.floor(Math.random() * 900) + 100}.${Date.now() % 1000}`;

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
        email: `e2e-rel-${roleCode}-${suffix}@test.com`,
        username: `e2erel${suffix}`.slice(0, 48),
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

  const upload = (
    token: string,
    fields: Record<string, string>,
    file?: { content: Buffer; name: string },
  ) => {
    const req = request(app.getHttpServer())
      .post('/admin/releases')
      .set('Authorization', `Bearer ${token}`);
    for (const [key, value] of Object.entries(fields)) req.field(key, value);
    if (file) req.attach('file', file.content, file.name);
    return req;
  };

  beforeAll(async () => {
    // Parte de una carpeta temporal vacía: el test comprueba que no queda nada.
    await fs.rm(join(RELEASES_DIR, '.tmp'), { recursive: true, force: true });
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ThrottlerStorage)
      .useValue({
        increment: () =>
          Promise.resolve({
            totalHits: 1,
            timeToExpire: 60,
            isBlocked: false,
            timeToBlockExpire: 0,
          }),
      })
      .compile();
    app = moduleFixture.createNestApplication<INestApplication<App>>();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    users = app.get<Repository<User>>(getRepositoryToken(User));
    releases = app.get<Repository<AppRelease>>(getRepositoryToken(AppRelease));
    adminToken = await createUser('admin');
    caregiverToken = await createUser('caregiver');
  }, BOOT_TIMEOUT_MS);

  afterAll(async () => {
    const rows = await releases.find();
    for (const row of rows) {
      await fs.rm(join(RELEASES_DIR, row.fileKey), { force: true });
    }
    await releases.clear();
    if (createdUsers.length) await users.delete(createdUsers);
    await app.close();
  });

  it('exige sesión y rol admin para gestionar versiones', async () => {
    await request(app.getHttpServer()).get('/admin/releases').expect(401);
    await request(app.getHttpServer())
      .get('/admin/releases')
      .set('Authorization', `Bearer ${caregiverToken}`)
      .expect(403);
    await upload(
      caregiverToken,
      { platform: 'android', version: '1.0.0' },
      {
        content: fakeApk('x'),
        name: 'a.apk',
      },
    ).expect(403);
  });

  it('sube un APK, lo publica y lo sirve idéntico en la descarga pública', async () => {
    const v = version();
    const content = fakeApk(`contenido-${v}`);
    const created = await upload(
      adminToken,
      { platform: 'android', version: v, notes: 'Primera versión' },
      { content, name: 'app-release.apk' },
    ).expect(201);
    const body = created.body as AppRelease;
    expect(body).toMatchObject({
      platform: 'android',
      version: v,
      sizeBytes: content.length,
      isPublished: true,
      sha256: createHash('sha256').update(content).digest('hex'),
    });

    const latest = await request(app.getHttpServer())
      .get('/releases/latest')
      .expect(200);
    expect(
      (latest.body as { platform: string; version: string }[]).find(
        (r) => r.platform === 'android',
      ),
    ).toMatchObject({
      version: v,
      downloadPath: '/releases/android/download',
    });
    // El contrato público no expone datos internos.
    expect(JSON.stringify(latest.body)).not.toContain(body.fileKey);

    const download = await request(app.getHttpServer())
      .get('/releases/android/download')
      .buffer(true)
      .parse((res, cb) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => cb(null, Buffer.concat(chunks)));
      })
      .expect(200);
    expect(download.headers['content-disposition']).toContain(
      `salud-movil-${v}.apk`,
    );
    expect(Buffer.compare(download.body as Buffer, content)).toBe(0);
  });

  it('la descarga sirve la versión publicada más reciente y respeta "no publicada"', async () => {
    const older = version();
    const newer = version();
    await upload(
      adminToken,
      { platform: 'windows', version: older },
      {
        content: Buffer.from('MZ-older'),
        name: 'setup.exe',
      },
    ).expect(201);
    const second = await upload(
      adminToken,
      { platform: 'windows', version: newer, isPublished: 'false' },
      { content: Buffer.from('MZ-newer'), name: 'setup.exe' },
    ).expect(201);

    const pick = async () =>
      (
        (await request(app.getHttpServer()).get('/releases/latest')).body as {
          platform: string;
          version: string;
        }[]
      ).find((r) => r.platform === 'windows')?.version;

    // La más nueva está sin publicar: se ofrece la anterior.
    expect(await pick()).toBe(older);

    await request(app.getHttpServer())
      .patch(`/admin/releases/${(second.body as AppRelease).id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isPublished: true })
      .expect(200);
    expect(await pick()).toBe(newer);
  });

  it('rechaza extensión, firma, duplicados y versiones mal formadas', async () => {
    const v = version();
    // Extensión de otra plataforma.
    await upload(
      adminToken,
      { platform: 'android', version: v },
      {
        content: fakeApk('a'),
        name: 'app.exe',
      },
    ).expect(400);
    // Extensión correcta pero no es un ZIP.
    await upload(
      adminToken,
      { platform: 'android', version: v },
      {
        content: Buffer.from('esto no es un apk'),
        name: 'fake.apk',
      },
    ).expect(400);
    // Sin archivo.
    await upload(adminToken, { platform: 'android', version: v }).expect(400);
    // Versión mal formada y plataforma desconocida.
    await upload(
      adminToken,
      { platform: 'android', version: 'latest' },
      {
        content: fakeApk('a'),
        name: 'a.apk',
      },
    ).expect(400);
    await upload(
      adminToken,
      { platform: 'linux', version: v },
      {
        content: fakeApk('a'),
        name: 'a.apk',
      },
    ).expect(400);

    // Duplicado: la segunda subida con la misma plataforma+versión choca.
    await upload(
      adminToken,
      { platform: 'macos', version: v },
      {
        content: Buffer.from('dmg'),
        name: 'app.dmg',
      },
    ).expect(201);
    await upload(
      adminToken,
      { platform: 'macos', version: v },
      {
        content: Buffer.from('dmg2'),
        name: 'app.dmg',
      },
    ).expect(409);

    // Ninguna subida rechazada deja basura en la carpeta temporal.
    const leftovers = await fs
      .readdir(join(RELEASES_DIR, '.tmp'))
      .catch(() => [] as string[]);
    expect(leftovers).toEqual([]);
  });

  it('borra la fila y el archivo', async () => {
    const created = await upload(
      adminToken,
      { platform: 'macos', version: version() },
      { content: Buffer.from('dmg-borrar'), name: 'app.dmg' },
    ).expect(201);
    const { id, fileKey } = created.body as AppRelease;
    await fs.access(join(RELEASES_DIR, fileKey));

    await request(app.getHttpServer())
      .delete(`/admin/releases/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
    await expect(fs.access(join(RELEASES_DIR, fileKey))).rejects.toThrow();
    await request(app.getHttpServer())
      .delete(`/admin/releases/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('devuelve 404 si no hay versión o la plataforma no existe', async () => {
    await releases.clear();
    await request(app.getHttpServer())
      .get('/releases/windows/download')
      .expect(404);
    await request(app.getHttpServer())
      .get('/releases/linux/download')
      .expect(404);
    const latest = await request(app.getHttpServer())
      .get('/releases/latest')
      .expect(200);
    expect(latest.body).toEqual([]);
  });
});

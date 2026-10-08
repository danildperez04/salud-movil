import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import {
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
  TwoFactorService,
} from './two-factor.service';
import { OtpChallenge } from './entities/otp-challenge.entity';
import { OtpDelivery, OtpMessage } from './otp-delivery';
import { User } from '../users/entities/user.entity';

const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

describe('TwoFactorService', () => {
  const EXPIRES_MS = 5 * 60_000;

  let service: TwoFactorService;
  let challenges: Record<string, jest.Mock>;
  let users: Record<string, jest.Mock>;
  let delivery: { send: jest.Mock };
  let config: { get: jest.Mock };

  const user = { id: 'u-1', name: 'Ana', email: 'ana@test', isActive: true };

  const challenge = (overrides: Partial<OtpChallenge> = {}) =>
    ({
      id: 'c-1',
      userId: 'u-1',
      purpose: 'login',
      codeHash: sha256('123456'),
      expiresAt: new Date(Date.now() + EXPIRES_MS),
      attempts: 0,
      ...overrides,
    }) as OtpChallenge;

  beforeEach(async () => {
    challenges = {
      findOne: jest.fn(),
      create: jest.fn((entity: object) => entity),
      save: jest.fn((entity: object) =>
        Promise.resolve({ id: 'c-new', ...entity }),
      ),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    users = {
      findOne: jest.fn().mockResolvedValue(user),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    delivery = { send: jest.fn().mockResolvedValue(undefined) };
    config = { get: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        TwoFactorService,
        { provide: getRepositoryToken(User), useValue: users },
        { provide: getRepositoryToken(OtpChallenge), useValue: challenges },
        { provide: OtpDelivery, useValue: delivery },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();
    service = module.get(TwoFactorService);
  });

  describe('issue', () => {
    it('entrega el código en claro y guarda solo su hash', async () => {
      const info = await service.issue(user, 'login');

      const [sent] = delivery.send.mock.calls[0] as [OtpMessage];
      expect(sent.code).toMatch(/^\d{6}$/);

      const [saved] = challenges.create.mock.calls[0] as [OtpChallenge];
      expect(saved.codeHash).toBe(sha256(sent.code));
      expect(JSON.stringify(saved)).not.toContain(sent.code);

      expect(info.challengeId).toBe('c-new');
      expect(info.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('invalida el código anterior del mismo propósito antes de crear otro', async () => {
      await service.issue(user, 'login');

      expect(challenges.delete).toHaveBeenCalledWith({
        userId: 'u-1',
        purpose: 'login',
      });
      expect(challenges.delete.mock.invocationCallOrder[0]).toBeLessThan(
        challenges.save.mock.invocationCallOrder[0],
      );
    });

    it('respeta OTP_EXPIRES_MINUTES', async () => {
      config.get.mockReturnValue('10');
      const before = Date.now();

      const info = await service.issue(user, 'enable');

      const ttl = info.expiresAt.getTime() - before;
      expect(ttl).toBeGreaterThanOrEqual(10 * 60_000);
      expect(ttl).toBeLessThan(10 * 60_000 + 5_000);
    });
  });

  describe('consume', () => {
    it('con el código correcto devuelve el usuario y borra el desafío', async () => {
      challenges.findOne.mockResolvedValue(challenge());

      await expect(service.consume('c-1', '123456', 'login')).resolves.toBe(
        'u-1',
      );
      expect(challenges.delete).toHaveBeenCalledWith({ id: 'c-1' });
    });

    it('un código incorrecto gasta un intento y falla con 401 en el login', async () => {
      challenges.findOne.mockResolvedValue(challenge());

      await expect(
        service.consume('c-1', '000000', 'login'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(challenges.update).toHaveBeenCalledTimes(1);
      expect(challenges.delete).not.toHaveBeenCalled();
    });

    it('en los endpoints autenticados falla con 400, no 401 (un 401 cierra la sesión del cliente)', async () => {
      challenges.findOne.mockResolvedValue(challenge({ purpose: 'enable' }));

      await expect(
        service.consume('c-1', '000000', 'enable', 'u-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rechaza un desafío inexistente', async () => {
      challenges.findOne.mockResolvedValue(null);

      await expect(
        service.consume('c-1', '123456', 'login'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rechaza un desafío vencido sin gastar intentos', async () => {
      challenges.findOne.mockResolvedValue(
        challenge({ expiresAt: new Date(Date.now() - 1_000) }),
      );

      await expect(
        service.consume('c-1', '123456', 'login'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(challenges.update).not.toHaveBeenCalled();
    });

    it('con los intentos agotados rechaza incluso el código correcto', async () => {
      challenges.findOne.mockResolvedValue(
        challenge({ attempts: OTP_MAX_ATTEMPTS }),
      );
      // El UPDATE condicional (attempts < máximo) no afecta ninguna fila.
      challenges.update.mockResolvedValue({ affected: 0 });

      await expect(
        service.consume('c-1', '123456', 'login'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(challenges.delete).not.toHaveBeenCalled();
    });

    it('gasta el intento con un UPDATE condicional al máximo', async () => {
      challenges.findOne.mockResolvedValue(challenge());

      await service.consume('c-1', '123456', 'login');

      const [criteria, patch] = challenges.update.mock.calls[0] as [
        { id: string; attempts: { type: string; value: unknown } },
        { attempts: () => string },
      ];
      expect(criteria.id).toBe('c-1');
      expect(criteria.attempts.value).toBe(OTP_MAX_ATTEMPTS);
      expect(patch.attempts()).toBe('attempts + 1');
    });

    it('no acepta el desafío de otro usuario', async () => {
      challenges.findOne.mockResolvedValue(
        challenge({ purpose: 'enable', userId: 'otro' }),
      );

      await expect(
        service.consume('c-1', '123456', 'enable', 'u-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(challenges.update).not.toHaveBeenCalled();
    });

    it('es de un solo uso: si otra petición ya lo borró, falla', async () => {
      challenges.findOne.mockResolvedValue(challenge());
      challenges.delete.mockResolvedValue({ affected: 0 });

      await expect(
        service.consume('c-1', '123456', 'login'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('resend', () => {
    // El servicio deduce la hora de emisión de `expiresAt - vigencia`.
    const issuedAgo = (ms: number) =>
      challenge({ expiresAt: new Date(Date.now() - ms + EXPIRES_MS) });

    it('antes del enfriamiento responde 429', async () => {
      challenges.findOne.mockResolvedValue(issuedAgo(1_000));

      const error = await service.resend('c-1').catch((e: unknown) => e);

      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(429);
      expect(delivery.send).not.toHaveBeenCalled();
    });

    it('pasado el enfriamiento emite un código nuevo del mismo propósito', async () => {
      challenges.findOne.mockResolvedValue({
        ...issuedAgo(OTP_RESEND_COOLDOWN_MS + 1_000),
        purpose: 'enable',
      });

      const info = await service.resend('c-1');

      expect(info.challengeId).toBe('c-new');
      expect(challenges.delete).toHaveBeenCalledWith({
        userId: 'u-1',
        purpose: 'enable',
      });
      expect(delivery.send).toHaveBeenCalledTimes(1);
    });

    it('un desafío desconocido o de una cuenta inactiva falla con 400', async () => {
      challenges.findOne.mockResolvedValue(null);
      await expect(service.resend('c-1')).rejects.toBeInstanceOf(
        BadRequestException,
      );

      challenges.findOne.mockResolvedValue(issuedAgo(60_000));
      users.findOne.mockResolvedValue({ ...user, isActive: false });
      await expect(service.resend('c-1')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('activar y desactivar', () => {
    it('no inicia la activación si ya está activa', async () => {
      users.findOne.mockResolvedValue({ ...user, twoFactorEnabled: true });

      await expect(service.startEnable('u-1')).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(delivery.send).not.toHaveBeenCalled();
    });

    it('inicia la activación enviando un código de propósito enable', async () => {
      users.findOne.mockResolvedValue({ ...user, twoFactorEnabled: false });

      await service.startEnable('u-1');

      expect(delivery.send).toHaveBeenCalledWith(
        expect.objectContaining({ purpose: 'enable' }),
      );
    });

    it('confirmar con el código correcto activa el 2FA', async () => {
      challenges.findOne.mockResolvedValue(challenge({ purpose: 'enable' }));

      await expect(
        service.confirmEnable('u-1', 'c-1', '123456'),
      ).resolves.toEqual({ twoFactorEnabled: true });
      expect(users.update).toHaveBeenCalledWith(
        { id: 'u-1' },
        { twoFactorEnabled: true },
      );
    });

    it('confirmar con un código incorrecto no activa nada', async () => {
      challenges.findOne.mockResolvedValue(challenge({ purpose: 'enable' }));

      await expect(
        service.confirmEnable('u-1', 'c-1', '000000'),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(users.update).not.toHaveBeenCalled();
    });

    it('desactivar exige la contraseña correcta', async () => {
      users.findOne.mockResolvedValue({
        ...user,
        passwordHash: bcrypt.hashSync('Secreta123!', 4),
        twoFactorEnabled: true,
      });

      await expect(service.disable('u-1', 'incorrecta')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(users.update).not.toHaveBeenCalled();
    });

    it('con la contraseña correcta desactiva y descarta los códigos pendientes', async () => {
      users.findOne.mockResolvedValue({
        ...user,
        passwordHash: bcrypt.hashSync('Secreta123!', 4),
        twoFactorEnabled: true,
      });

      await expect(service.disable('u-1', 'Secreta123!')).resolves.toEqual({
        twoFactorEnabled: false,
      });
      expect(users.update).toHaveBeenCalledWith(
        { id: 'u-1' },
        { twoFactorEnabled: false },
      );
      expect(challenges.delete).toHaveBeenCalledWith({ userId: 'u-1' });
    });
  });
});

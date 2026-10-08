import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthResponse, AuthService } from './auth.service';
import { TwoFactorService } from './two-factor.service';
import { PasswordReset } from './entities/password-reset.entity';
import { User } from '../users/entities/user.entity';
import { Caregiver } from '../users/entities/caregiver.entity';
import { Role } from '../catalogues/entities/role.entity';
import { Municipality } from '../catalogues/entities/municipality.entity';

describe('AuthService — login con verificación en dos pasos', () => {
  const PASSWORD = 'Secreta123!';

  let service: AuthService;
  let userRepo: { findOne: jest.Mock; save: jest.Mock };
  let jwt: { signAsync: jest.Mock };
  let twoFactor: { issue: jest.Mock; consume: jest.Mock };

  const buildUser = (overrides: Partial<User> = {}) =>
    ({
      id: 'u-1',
      name: 'Ana',
      email: 'ana@test',
      username: 'ana',
      phoneNumber: '8888-8888',
      address: 'Managua',
      isActive: true,
      twoFactorEnabled: false,
      lastLoginAt: null,
      passwordHash: bcrypt.hashSync(PASSWORD, 4),
      role: { code: 'caregiver' },
      municipality: { id: 1 },
      healthcareWorker: null,
      ...overrides,
    }) as User;

  beforeEach(async () => {
    userRepo = {
      findOne: jest.fn(),
      save: jest.fn((entity: object) => Promise.resolve(entity)),
    };
    jwt = { signAsync: jest.fn().mockResolvedValue('jwt-token') };
    twoFactor = {
      issue: jest.fn().mockResolvedValue({
        challengeId: 'c-1',
        expiresAt: new Date('2026-10-08T12:00:00Z'),
      }),
      consume: jest.fn().mockResolvedValue('u-1'),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Caregiver), useValue: {} },
        { provide: getRepositoryToken(PasswordReset), useValue: {} },
        { provide: getRepositoryToken(Role), useValue: {} },
        { provide: getRepositoryToken(Municipality), useValue: {} },
        { provide: JwtService, useValue: jwt },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: TwoFactorService, useValue: twoFactor },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  describe('login', () => {
    it('sin 2FA entrega la sesión como siempre', async () => {
      userRepo.findOne.mockResolvedValue(buildUser());

      const result = (await service.login({
        email: 'ana@test',
        password: PASSWORD,
      })) as AuthResponse;

      expect(result.accessToken).toBe('jwt-token');
      expect(result.user.twoFactorEnabled).toBe(false);
      expect(twoFactor.issue).not.toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalledTimes(1);
    });

    it('con 2FA devuelve el desafío y no entrega token ni marca el login', async () => {
      userRepo.findOne.mockResolvedValue(buildUser({ twoFactorEnabled: true }));

      const result = await service.login({
        email: 'ana@test',
        password: PASSWORD,
      });

      expect(result).toEqual({
        requiresTwoFactor: true,
        challengeId: 'c-1',
        expiresAt: new Date('2026-10-08T12:00:00Z'),
      });
      expect(result).not.toHaveProperty('accessToken');
      expect(jwt.signAsync).not.toHaveBeenCalled();
      expect(userRepo.save).not.toHaveBeenCalled();
      expect(twoFactor.issue).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'u-1' }),
        'login',
      );
    });

    it('con la contraseña incorrecta no envía ningún código', async () => {
      userRepo.findOne.mockResolvedValue(buildUser({ twoFactorEnabled: true }));

      await expect(
        service.login({ email: 'ana@test', password: 'incorrecta' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(twoFactor.issue).not.toHaveBeenCalled();
    });

    it('con la cuenta desactivada no envía ningún código', async () => {
      userRepo.findOne.mockResolvedValue(
        buildUser({ twoFactorEnabled: true, isActive: false }),
      );

      await expect(
        service.login({ email: 'ana@test', password: PASSWORD }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(twoFactor.issue).not.toHaveBeenCalled();
    });
  });

  describe('completeTwoFactorLogin', () => {
    const dto = { challengeId: 'c-1', code: '123456' };

    it('con un código válido entrega la sesión y marca el login', async () => {
      userRepo.findOne.mockResolvedValue(buildUser({ twoFactorEnabled: true }));

      const result = await service.completeTwoFactorLogin(dto);

      expect(twoFactor.consume).toHaveBeenCalledWith('c-1', '123456', 'login');
      expect(result.accessToken).toBe('jwt-token');
      expect(result.user.twoFactorEnabled).toBe(true);
      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ lastLoginAt: expect.any(Date) as Date }),
      );
    });

    it('si el código es inválido no entrega nada', async () => {
      twoFactor.consume.mockRejectedValue(new UnauthorizedException());

      await expect(service.completeTwoFactorLogin(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(jwt.signAsync).not.toHaveBeenCalled();
    });

    it('si la cuenta se desactivó entre el login y la verificación, la rechaza', async () => {
      userRepo.findOne.mockResolvedValue(buildUser({ isActive: false }));

      await expect(service.completeTwoFactorLogin(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(jwt.signAsync).not.toHaveBeenCalled();
    });
  });
});

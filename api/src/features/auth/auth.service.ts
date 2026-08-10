import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { randomBytes, createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Role } from '../catalogues/entities/role.entity';
import { Municipality } from '../catalogues/entities/municipality.entity';
import { User } from '../users/entities/user.entity';
import { Caregiver } from '../users/entities/caregiver.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { RegisterCaregiverDto } from './dto/register-caregiver.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload } from '../../common/guards/jwt-payload.interface';

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  municipalityId: number;
  role: string;
  healthcareWorker?: {
    licenseNumber: string;
    employeeId: string;
    majorId?: number;
    majorName?: string;
    healthCenterId?: string;
    healthCenterName?: string;
  } | null;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Caregiver)
    private readonly caregiverRepository: Repository<Caregiver>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerCaregiver(dto: RegisterCaregiverDto): Promise<AuthResponse> {
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
      withDeleted: true,
    });
    if (existing) {
      throw new ConflictException(
        'El correo o el nombre de usuario ya está en uso',
      );
    }

    const role = await this.roleRepository.findOne({
      where: { code: 'caregiver' },
    });
    const municipality = await this.municipalityRepository.findOne({
      where: { id: dto.municipalityId },
    });
    if (!role || !municipality) {
      throw new ConflictException('Datos de referencia no válidos');
    }

    const user = await this.userRepository.save(
      this.userRepository.create({
        name: dto.name,
        email: dto.email.toLowerCase(),
        username: dto.username,
        passwordHash: await bcrypt.hash(dto.password, 10),
        phoneNumber: dto.phoneNumber,
        address: dto.address,
        dni: dto.dni,
        role,
        municipality,
      }),
    );

    await this.caregiverRepository.save(
      this.caregiverRepository.create({ id: user.id }),
    );

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.email }],
      relations: {
        role: true,
        municipality: true,
        healthcareWorker: { major: true, healthCenter: true },
      },
      withDeleted: true,
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('La cuenta está desactivada');
    }

    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return this.buildAuthResponse(user);
  }

  async getProfile(payload: JwtPayload): Promise<PublicUser> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: {
        role: true,
        municipality: true,
        healthcareWorker: { major: true, healthCenter: true },
      },
      withDeleted: true,
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }
    return this.toPublicUser(user);
  }

  async forgotPassword(email: string): Promise<{ resetToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      throw new NotFoundException('No existe una cuenta con ese correo');
    }

    const token = randomBytes(32).toString('hex');
    const expiresMinutes =
      parseInt(
        this.configService.get<string>('PASSWORD_RESET_EXPIRES_MINUTES') ??
          '60',
        10,
      ) || 60;

    await this.passwordResetRepository.save(
      this.passwordResetRepository.create({
        user,
        tokenHash: createHash('sha256').update(token).digest('hex'),
        expiresAt: new Date(Date.now() + expiresMinutes * 60_000),
      }),
    );

    this.logger.log(
      `Token de restablecimiento generado para ${email}: ${token} (vence en ${expiresMinutes} min)`,
    );
    return { resetToken: token };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const reset = await this.passwordResetRepository.findOne({
      where: { tokenHash },
      relations: { user: true },
    });

    if (!reset || reset.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('El token es inválido o ha expirado');
    }
    if (reset.usedAt) {
      throw new BadRequestException('El token ya fue utilizado');
    }

    await this.passwordResetRepository.update(
      { user: { id: reset.user.id } },
      { usedAt: new Date() },
    );
    reset.user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(reset.user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: true,
    });
    if (
      !user ||
      !(await bcrypt.compare(dto.currentPassword, user.passwordHash))
    ) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }
    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.save(user);
  }

  private async buildAuthResponse(user: User): Promise<AuthResponse> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role.code,
    });
    return { user: this.toPublicUser(user), accessToken };
  }

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      address: user.address,
      municipalityId: user.municipality.id,
      role: user.role.code,
      healthcareWorker: user.healthcareWorker
        ? {
            licenseNumber: user.healthcareWorker.licenseNumber,
            employeeId: user.healthcareWorker.employeeId,
            majorId: user.healthcareWorker.major?.id,
            majorName: user.healthcareWorker.major?.name,
            healthCenterId: user.healthcareWorker.healthCenter?.id,
            healthCenterName: user.healthcareWorker.healthCenter?.name,
          }
        : null,
    };
  }
}

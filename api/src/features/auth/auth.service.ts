import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Role } from '../catalogues/entities/role.entity';
import { Municipality } from '../catalogues/entities/municipality.entity';
import { User } from '../users/entities/user.entity';
import { Caregiver } from '../users/entities/caregiver.entity';
import { RegisterCaregiverDto } from './dto/register-caregiver.dto';
import { LoginDto } from './dto/login.dto';
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
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Caregiver)
    private readonly caregiverRepository: Repository<Caregiver>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
    private readonly jwtService: JwtService,
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
      relations: { role: true, municipality: true },
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
      relations: { role: true, municipality: true },
      withDeleted: true,
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }
    return this.toPublicUser(user);
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
    };
  }
}

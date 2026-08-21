import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HealthcareWorker } from './entities/healthcare-worker.entity';
import { Role } from '../catalogues/entities/role.entity';
import { Municipality } from '../catalogues/entities/municipality.entity';
import { Major } from '../catalogues/entities/major.entity';
import { HealthCenter } from '../health-centers/entities/health-center.entity';
import { CreateHealthStaffDto } from './dto/create-health-staff.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  dni: string | null;
  isActive: boolean;
  municipalityId?: number;
  role?: string;
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
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
    @InjectRepository(Major)
    private readonly majorRepository: Repository<Major>,
    @InjectRepository(HealthCenter)
    private readonly healthCenterRepository: Repository<HealthCenter>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async createHealthStaff(dto: CreateHealthStaffDto): Promise<PublicUser> {
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
      withDeleted: true,
    });
    if (existing) {
      throw new ConflictException(
        'El correo o el nombre de usuario ya está en uso',
      );
    }

    const created = await this.dataSource.transaction(async (manager) => {
      const role = await manager.findOne(Role, {
        where: { code: 'health_staff' },
      });
      const municipality = await manager.findOne(Municipality, {
        where: { id: dto.municipalityId },
      });
      const major = await manager.findOne(Major, {
        where: { id: dto.majorId },
      });
      const healthCenter = await manager.findOne(HealthCenter, {
        where: { id: dto.healthCenterId },
      });
      if (!role || !municipality || !major || !healthCenter) {
        throw new BadRequestException('Datos de referencia no válidos');
      }

      const user = await manager.save(
        manager.create(User, {
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

      return manager.save(
        manager.create(HealthcareWorker, {
          id: user.id,
          licenseNumber: dto.licenseNumber,
          employeeId: dto.employeeId,
          major,
          healthCenter,
        }),
      );
    });

    const user = await this.userRepository.findOne({
      where: { id: created.id },
      relations: {
        role: true,
        municipality: true,
        healthcareWorker: { major: true, healthCenter: true },
      },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.toPublicUser(user);
  }

  async findAll(): Promise<PublicUser[]> {
    const users = await this.userRepository.find({
      relations: {
        role: true,
        municipality: true,
        healthcareWorker: { major: true, healthCenter: true },
      },
    });
    return users.map((user) => this.toPublicUser(user));
  }

  async findOne(id: string): Promise<PublicUser> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        role: true,
        municipality: true,
        healthcareWorker: { major: true, healthCenter: true },
      },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.toPublicUser(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<PublicUser> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: true, municipality: true },
      withDeleted: true,
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.email || dto.username) {
      const duplicate = await this.userRepository.findOne({
        where: [
          ...(dto.email ? [{ email: dto.email }] : []),
          ...(dto.username ? [{ username: dto.username }] : []),
        ],
        withDeleted: true,
      });
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException(
          'El correo o el nombre de usuario ya está en uso',
        );
      }
    }

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email.toLowerCase();
    if (dto.username !== undefined) user.username = dto.username;
    if (dto.phoneNumber !== undefined) user.phoneNumber = dto.phoneNumber;
    if (dto.address !== undefined) user.address = dto.address;
    if (dto.dni !== undefined) user.dni = dto.dni;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.password !== undefined) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.toPublicUser(await this.userRepository.save(user));
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dni: user.dni ?? null,
      isActive: user.isActive,
      municipalityId: user.municipality?.id,
      role: user.role?.code,
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

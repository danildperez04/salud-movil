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
import { Caregiver } from './entities/caregiver.entity';
import { PatientCaregiver } from './entities/patient-caregiver.entity';
import { Role } from '../catalogues/entities/role.entity';
import { Municipality } from '../catalogues/entities/municipality.entity';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface PublicCaregiverDetail {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  dni: string | null;
  isActive: boolean;
  municipalityId?: number;
}

export interface PublicPatientLink {
  patientId: string;
  patientName: string;
  patientEmail: string;
  relationshipTypeName: string;
  isPrimary: boolean;
  dateLink: string;
}

@Injectable()
export class CaregiversService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Caregiver)
    private readonly caregiverRepository: Repository<Caregiver>,
    @InjectRepository(PatientCaregiver)
    private readonly linkRepository: Repository<PatientCaregiver>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateCaregiverDto): Promise<PublicCaregiverDetail> {
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
        where: { code: 'caregiver' },
      });
      const municipality = await manager.findOne(Municipality, {
        where: { id: dto.municipalityId },
      });
      if (!role || !municipality) {
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

      await manager.save(
        manager.create(Caregiver, {
          id: user.id,
        }),
      );

      return user;
    });

    return this.findOne(created.id);
  }

  async findOne(id: string): Promise<PublicCaregiverDetail> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: true, municipality: true },
      withDeleted: true,
    });
    if (!user || user.role?.code !== 'caregiver') {
      throw new NotFoundException('Cuidador no encontrado');
    }
    return this.toPublic(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<PublicCaregiverDetail> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: true, municipality: true },
      withDeleted: true,
    });
    if (!user || user.role?.code !== 'caregiver') {
      throw new NotFoundException('Cuidador no encontrado');
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

    return this.toPublic(await this.userRepository.save(user));
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { caregiver: { caregiverLinks: true }, role: true },
      withDeleted: true,
    });
    if (!user || user.role?.code !== 'caregiver') {
      throw new NotFoundException('Cuidador no encontrado');
    }
    await this.dataSource.transaction(async (manager) => {
      if (user.caregiver) {
        await manager.softRemove(user.caregiver);
      }
      await manager.softDelete(User, { id });
    });
  }

  async findPatients(caregiverId: string): Promise<PublicPatientLink[]> {
    await this.findOne(caregiverId);

    const links = await this.linkRepository.find({
      where: { caregiverId },
      relations: {
        patient: { user: true },
        relationshipType: true,
      },
      withDeleted: true,
    });

    return links
      .filter((l) => !l.patient?.user?.deletedAt && !l.patient?.deletedAt)
      .map((l) => ({
        patientId: l.patientId,
        patientName: l.patient.user.name,
        patientEmail: l.patient.user.email,
        relationshipTypeName: l.relationshipType.name,
        isPrimary: l.isPrimary,
        dateLink: l.dateLink.toISOString().slice(0, 10),
      }));
  }

  private toPublic(user: User): PublicCaregiverDetail {
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
    };
  }
}

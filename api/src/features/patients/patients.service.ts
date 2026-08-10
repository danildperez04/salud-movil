import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Patient } from '../users/entities/patient.entity';
import { Role } from '../catalogues/entities/role.entity';
import { Municipality } from '../catalogues/entities/municipality.entity';
import { Genre } from '../catalogues/entities/genre.entity';
import { HealthCenter } from '../health-centers/entities/health-center.entity';
import { MedicalRecord } from '../medical-records/entities/medical-record.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

export interface PublicPatient {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  dni: string | null;
  isActive: boolean;
  municipalityId: number;
  municipalityName: string;
  dateOfBirth: string;
  genreId: number;
  genreName: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  healthCenterId: string;
  healthCenterName: string;
}

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(HealthCenter)
    private readonly healthCenterRepository: Repository<HealthCenter>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async create(
    currentUser: JwtPayload,
    dto: CreatePatientDto,
  ): Promise<PublicPatient> {
    const healthCenter = await this.resolveTargetHealthCenter(
      currentUser,
      dto.healthCenterId,
    );

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
        where: { code: 'patient' },
      });
      const municipality = await manager.findOne(Municipality, {
        where: { id: dto.municipalityId },
      });
      const genre = await manager.findOne(Genre, {
        where: { id: dto.genreId },
      });
      if (!role || !municipality || !genre) {
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
        manager.create(Patient, {
          id: user.id,
          dateOfBirth: new Date(`${dto.dateOfBirth}T00:00:00`),
          emergencyContactName: dto.emergencyContactName,
          emergencyContactPhoneNumber: dto.emergencyContactPhoneNumber,
          genre,
          healthCenter,
        }),
      );

      const creator = await manager.findOne(User, {
        where: { id: currentUser.sub },
      });
      return manager.save(
        manager.create(MedicalRecord, {
          primaryDiagnosis: '',
          medicalHistory: '',
          allergies: '',
          patient: { id: user.id },
          ...(creator ? { createdBy: creator } : {}),
        }),
      );
    });

    return this.findOne(created.patient.id, currentUser);
  }

  async findAll(currentUser: JwtPayload, q?: string): Promise<PublicPatient[]> {
    const query = this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.user', 'user')
      .leftJoinAndSelect('user.municipality', 'municipality')
      .leftJoinAndSelect('patient.genre', 'genre')
      .leftJoinAndSelect('patient.healthCenter', 'healthCenter')
      .orderBy('user.name', 'ASC');

    if (currentUser.role === 'health_staff') {
      const centerId = await this.getStaffCenterId(currentUser);
      query.andWhere('patient.health_center_id = :centerId', { centerId });
    }

    if (q && q.trim().length > 0) {
      const term = `%${q.trim()}%`;
      query.andWhere(
        '(user.name ILIKE :term OR user.email ILIKE :term OR user.username ILIKE :term OR user.dni ILIKE :term)',
        { term },
      );
    }

    const patients = await query.getMany();
    return patients.map((patient) => this.toPublicPatient(patient));
  }

  async findOne(id: string, currentUser: JwtPayload): Promise<PublicPatient> {
    const patient = await this.loadPatient(id);
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }
    await this.assertCanAccess(currentUser, patient);
    return this.toPublicPatient(patient);
  }

  async findMe(userId: string): Promise<PublicPatient> {
    const patient = await this.loadPatient(undefined, userId);
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return this.toPublicPatient(patient);
  }

  async update(
    id: string,
    currentUser: JwtPayload,
    dto: UpdatePatientDto,
  ): Promise<PublicPatient> {
    const patient = await this.loadPatient(id);
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }
    await this.assertCanAccess(currentUser, patient);
    const user = patient.user;

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
    if (dto.password !== undefined) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }
    if (dto.municipalityId !== undefined) {
      const municipality = await this.municipalityRepository.findOne({
        where: { id: dto.municipalityId },
      });
      if (!municipality) {
        throw new BadRequestException('Datos de referencia no válidos');
      }
      user.municipality = municipality;
    }
    if (dto.dateOfBirth !== undefined) {
      patient.dateOfBirth = new Date(`${dto.dateOfBirth}T00:00:00`);
    }
    if (dto.genreId !== undefined) {
      const genre = await this.genreRepository.findOne({
        where: { id: dto.genreId },
      });
      if (!genre) {
        throw new BadRequestException('Datos de referencia no válidos');
      }
      patient.genre = genre;
    }
    if (dto.emergencyContactName !== undefined) {
      patient.emergencyContactName = dto.emergencyContactName;
    }
    if (dto.emergencyContactPhoneNumber !== undefined) {
      patient.emergencyContactPhoneNumber = dto.emergencyContactPhoneNumber;
    }

    await this.userRepository.save(user);
    await this.patientRepository.save(patient);

    return this.findOne(id, currentUser);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.loadPatient(id);
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }
    await this.userRepository.softDelete(id);
  }

  private async resolveTargetHealthCenter(
    currentUser: JwtPayload,
    explicitCenterId?: string,
  ): Promise<HealthCenter> {
    if (currentUser.role === 'admin') {
      if (!explicitCenterId) {
        throw new BadRequestException(
          'El administrador debe indicar el centro de salud del paciente',
        );
      }
      const healthCenter = await this.healthCenterRepository.findOne({
        where: { id: explicitCenterId },
      });
      if (!healthCenter) {
        throw new BadRequestException('Datos de referencia no válidos');
      }
      return healthCenter;
    }

    const centerId = await this.getStaffCenterId(currentUser);
    const healthCenter = await this.healthCenterRepository.findOne({
      where: { id: centerId },
    });
    if (!healthCenter) {
      throw new BadRequestException('Datos de referencia no válidos');
    }
    return healthCenter;
  }

  private async getStaffCenterId(currentUser: JwtPayload): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: currentUser.sub },
      relations: { healthcareWorker: { healthCenter: true } },
    });
    if (!user?.healthcareWorker?.healthCenter?.id) {
      throw new ForbiddenException(
        'El personal de salud debe pertenecer a un centro de salud',
      );
    }
    return user.healthcareWorker.healthCenter.id;
  }

  private async assertCanAccess(
    currentUser: JwtPayload,
    patient: Patient,
  ): Promise<void> {
    if (currentUser.role === 'admin') {
      return;
    }
    const staffCenterId = await this.getStaffCenterId(currentUser);
    if (patient.healthCenter?.id !== staffCenterId) {
      throw new NotFoundException('Paciente no encontrado');
    }
  }

  private async loadPatient(
    id?: string,
    userId?: string,
  ): Promise<Patient | null> {
    return this.patientRepository.findOne({
      where: id ? { id } : { user: { id: userId } },
      relations: {
        user: { municipality: true },
        genre: true,
        healthCenter: true,
      },
    });
  }

  private toPublicPatient(patient: Patient): PublicPatient {
    return {
      id: patient.id,
      name: patient.user.name,
      email: patient.user.email,
      username: patient.user.username,
      phoneNumber: patient.user.phoneNumber,
      address: patient.user.address,
      dni: patient.user.dni ?? null,
      isActive: patient.user.isActive,
      municipalityId: patient.user.municipality.id,
      municipalityName: patient.user.municipality.name,
      dateOfBirth: new Date(patient.dateOfBirth).toISOString().slice(0, 10),
      genreId: patient.genre.id,
      genreName: patient.genre.name,
      emergencyContactName: patient.emergencyContactName,
      emergencyContactPhoneNumber: patient.emergencyContactPhoneNumber,
      healthCenterId: patient.healthCenter.id,
      healthCenterName: patient.healthCenter.name,
    };
  }
}

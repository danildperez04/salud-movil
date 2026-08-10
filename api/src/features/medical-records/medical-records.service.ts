import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { MedicalVisit } from './entities/medical-visit.entity';
import { HealthcareWorker } from '../users/entities/healthcare-worker.entity';
import { User } from '../users/entities/user.entity';
import { PatientsService } from '../patients/patients.service';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { CreateMedicalVisitDto } from './dto/create-medical-visit.dto';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

export interface PublicMedicalVisit {
  id: string;
  visitDate: string;
  diagnosis: string;
  observations: string;
  treatment: string;
  nextVisitDate: string | null;
  healthcareWorkerId: string;
  healthcareWorkerName: string;
}

export interface PublicMedicalRecord {
  primaryDiagnosis: string;
  medicalHistory: string;
  allergies: string;
  bloodType: string | null;
  createDate: string;
  updateDate: string;
  visits: PublicMedicalVisit[];
}

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(MedicalVisit)
    private readonly medicalVisitRepository: Repository<MedicalVisit>,
    @InjectRepository(HealthcareWorker)
    private readonly healthcareWorkerRepository: Repository<HealthcareWorker>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly patientsService: PatientsService,
  ) {}

  async upsertRecord(
    patientId: string,
    currentUser: JwtPayload,
    dto: UpdateMedicalRecordDto,
  ): Promise<PublicMedicalRecord> {
    await this.patientsService.findRecordForScope(patientId, currentUser);

    let record = await this.medicalRecordRepository.findOne({
      where: { patient: { id: patientId } },
      relations: { createdBy: true },
    });

    if (!record) {
      const creator = await this.userRepository.findOne({
        where: { id: currentUser.sub },
      });
      record = await this.medicalRecordRepository.save(
        this.medicalRecordRepository.create({
          primaryDiagnosis: dto.primaryDiagnosis,
          medicalHistory: dto.medicalHistory,
          allergies: dto.allergies,
          bloodType: dto.bloodType ?? '',
          patient: { id: patientId },
          ...(creator ? { createdBy: creator } : {}),
        }),
      );
    } else {
      record.primaryDiagnosis = dto.primaryDiagnosis;
      record.medicalHistory = dto.medicalHistory;
      record.allergies = dto.allergies;
      record.bloodType = dto.bloodType ?? '';
      await this.medicalRecordRepository.save(record);
    }

    return this.getRecord(patientId, currentUser);
  }

  async addVisit(
    patientId: string,
    currentUser: JwtPayload,
    dto: CreateMedicalVisitDto,
  ): Promise<PublicMedicalRecord> {
    const patient = await this.patientsService.findRecordForScope(
      patientId,
      currentUser,
    );
    const healthcareWorker = await this.healthcareWorkerRepository.findOne({
      where: { id: currentUser.sub },
      relations: { healthCenter: true },
    });
    if (!healthcareWorker) {
      throw new ForbiddenException(
        'Solo el personal de salud puede registrar consultas',
      );
    }
    if (healthcareWorker.healthCenter?.id !== patient.healthCenter?.id) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const record = await this.medicalRecordRepository.findOne({
      where: { patient: { id: patientId } },
    });
    if (!record) {
      throw new NotFoundException('El paciente no tiene expediente clínico');
    }

    await this.medicalVisitRepository.save(
      this.medicalVisitRepository.create({
        visitDate: dto.visitDate ? new Date(dto.visitDate) : new Date(),
        diagnosis: dto.diagnosis,
        observations: dto.observations,
        treatment: dto.treatment,
        nextVisitDate: dto.nextVisitDate
          ? new Date(`${dto.nextVisitDate}T00:00:00`)
          : null,
        medicalRecord: record,
        healthcareWorker,
      }),
    );

    return this.getRecord(patientId, currentUser);
  }

  async getRecord(
    patientId: string,
    currentUser: JwtPayload,
  ): Promise<PublicMedicalRecord> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    return this.loadRecord(patientId);
  }

  async getMyHistory(userId: string): Promise<PublicMedicalRecord> {
    const patient = await this.patientsService.findByUserId(userId);
    return this.loadRecord(patient.id);
  }

  private async loadRecord(patientId: string): Promise<PublicMedicalRecord> {
    const record = await this.medicalRecordRepository.findOne({
      where: { patient: { id: patientId } },
      relations: {
        visits: { healthcareWorker: { user: true } },
      },
      order: { visits: { visitDate: 'ASC' } },
    });
    if (!record) {
      throw new NotFoundException('El paciente no tiene expediente clínico');
    }
    return {
      primaryDiagnosis: record.primaryDiagnosis,
      medicalHistory: record.medicalHistory,
      allergies: record.allergies,
      bloodType: record.bloodType || null,
      createDate: record.createDate.toISOString(),
      updateDate: record.updateDate.toISOString(),
      visits: record.visits.map((visit) => ({
        id: visit.id,
        visitDate: visit.visitDate.toISOString(),
        diagnosis: visit.diagnosis,
        observations: visit.observations,
        treatment: visit.treatment,
        nextVisitDate: visit.nextVisitDate
          ? new Date(visit.nextVisitDate).toISOString().slice(0, 10)
          : null,
        healthcareWorkerId: visit.healthcareWorker.id,
        healthcareWorkerName: visit.healthcareWorker.user.name,
      })),
    };
  }
}

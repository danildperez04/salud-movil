import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentReminder } from './entities/appointment-reminder.entity';
import { AppointmentState } from '../catalogues/entities/appointment-state.entity';
import { AppointmentType } from '../catalogues/entities/appointment-type.entity';
import { NotificationState } from '../catalogues/entities/notification-state.entity';
import { HealthcareWorker } from '../users/entities/healthcare-worker.entity';
import { PatientsService } from '../patients/patients.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { UpdateAppointmentStateDto } from './dto/update-appointment-state.dto';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

export interface PublicAppointment {
  id: string;
  dateHour: string;
  reason: string;
  durationMinutes: number | null;
  appointmentStateId: number;
  appointmentStateName: string;
  appointmentTypeId: number;
  appointmentTypeName: string;
  cancelReason: string | null;
  cancelledAt: string | null;
  patientId: string;
  patientName: string;
  healthcareWorkerId: string;
  healthcareWorkerName: string;
}

const REMINDER_LEAD_MINUTES = 30;

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(AppointmentReminder)
    private readonly appointmentReminderRepository: Repository<AppointmentReminder>,
    @InjectRepository(AppointmentState)
    private readonly appointmentStateRepository: Repository<AppointmentState>,
    @InjectRepository(AppointmentType)
    private readonly appointmentTypeRepository: Repository<AppointmentType>,
    @InjectRepository(NotificationState)
    private readonly notificationStateRepository: Repository<NotificationState>,
    @InjectRepository(HealthcareWorker)
    private readonly healthcareWorkerRepository: Repository<HealthcareWorker>,
    private readonly patientsService: PatientsService,
  ) {}

  async create(
    patientId: string,
    currentUser: JwtPayload,
    dto: CreateAppointmentDto,
  ): Promise<PublicAppointment> {
    const patient = await this.patientsService.findRecordForScope(
      patientId,
      currentUser,
    );
    const healthcareWorker = await this.resolveHealthcareWorker(
      patient.healthCenter.id,
      currentUser,
      dto.healthcareWorkerId,
    );
    const appointmentType = await this.appointmentTypeRepository.findOne({
      where: { id: dto.appointmentTypeId },
    });
    if (!appointmentType) {
      throw new BadRequestException('Tipo de cita no válido');
    }
    const scheduled = await this.appointmentStateRepository.findOne({
      where: { name: 'Scheduled' },
    });
    if (!scheduled) {
      throw new BadRequestException('Estado de cita no disponible');
    }

    const dateHour = new Date(dto.dateHour);
    const appointment = await this.appointmentRepository.save(
      this.appointmentRepository.create({
        dateHour,
        reason: dto.reason,
        durationMinutes: dto.durationMinutes ?? undefined,
        patient,
        healthcareWorker,
        appointmentState: scheduled,
        appointmentType,
        ...(currentUser.sub ? { createdBy: { id: currentUser.sub } } : {}),
      }),
    );

    await this.createReminder(appointment, dateHour);

    return this.loadPublic(appointment.id);
  }

  async list(
    patientId: string,
    currentUser: JwtPayload,
  ): Promise<PublicAppointment[]> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    const appointments = await this.loadByPatient(patientId, {
      orderDesc: true,
    });
    return appointments.map((appointment) => this.toPublic(appointment));
  }

  async upcoming(
    patientId: string,
    currentUser: JwtPayload,
  ): Promise<PublicAppointment[]> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    const appointments = await this.loadUpcoming(patientId);
    return appointments.map((appointment) => this.toPublic(appointment));
  }

  async myUpcoming(currentUser: JwtPayload): Promise<PublicAppointment[]> {
    const patient = await this.patientsService.findByUserId(currentUser.sub);
    const appointments = await this.loadUpcoming(patient.id);
    return appointments.map((appointment) => this.toPublic(appointment));
  }

  async update(
    patientId: string,
    appointmentId: string,
    currentUser: JwtPayload,
    dto: UpdateAppointmentDto,
  ): Promise<PublicAppointment> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    const appointment = await this.loadForPatient(patientId, appointmentId);
    this.assertModifiable(appointment);

    if (dto.healthcareWorkerId !== undefined) {
      appointment.healthcareWorker = await this.resolveHealthcareWorker(
        appointment.patient.healthCenter.id,
        currentUser,
        dto.healthcareWorkerId,
      );
    }
    if (dto.dateHour !== undefined) {
      appointment.dateHour = new Date(dto.dateHour);
    }
    if (dto.reason !== undefined) {
      appointment.reason = dto.reason;
    }
    if (dto.appointmentTypeId !== undefined) {
      const appointmentType = await this.appointmentTypeRepository.findOne({
        where: { id: dto.appointmentTypeId },
      });
      if (!appointmentType) {
        throw new BadRequestException('Tipo de cita no válido');
      }
      appointment.appointmentType = appointmentType;
    }
    if (dto.durationMinutes !== undefined) {
      appointment.durationMinutes = dto.durationMinutes;
    }

    await this.appointmentRepository.save(appointment);
    return this.loadPublic(appointment.id);
  }

  async remove(
    patientId: string,
    appointmentId: string,
    currentUser: JwtPayload,
  ): Promise<void> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    const appointment = await this.loadForPatient(patientId, appointmentId);
    this.assertModifiable(appointment);
    await this.appointmentRepository.softDelete(appointment.id);
  }

  async cancel(
    patientId: string,
    appointmentId: string,
    currentUser: JwtPayload,
    dto: CancelAppointmentDto,
  ): Promise<PublicAppointment> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    const appointment = await this.loadForPatient(patientId, appointmentId);
    this.assertModifiable(appointment);

    const cancelled = await this.appointmentStateRepository.findOne({
      where: { name: 'Cancelled' },
    });
    if (!cancelled) {
      throw new BadRequestException('Estado de cita no disponible');
    }
    appointment.appointmentState = cancelled;
    appointment.cancelReason = dto.cancelReason;
    appointment.cancelledAt = new Date();

    await this.appointmentRepository.save(appointment);
    return this.loadPublic(appointment.id);
  }

  async changeState(
    patientId: string,
    appointmentId: string,
    currentUser: JwtPayload,
    dto: UpdateAppointmentStateDto,
  ): Promise<PublicAppointment> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    const appointment = await this.loadForPatient(patientId, appointmentId);
    this.assertModifiable(appointment);

    const state = await this.appointmentStateRepository.findOne({
      where: { name: dto.state },
    });
    if (!state) {
      throw new BadRequestException('Estado de cita no válido');
    }
    appointment.appointmentState = state;

    await this.appointmentRepository.save(appointment);
    return this.loadPublic(appointment.id);
  }

  // === Internals ===

  private async resolveHealthcareWorker(
    patientCenterId: string,
    currentUser: JwtPayload,
    explicitId?: string,
  ): Promise<HealthcareWorker> {
    if (explicitId) {
      const healthcareWorker = await this.healthcareWorkerRepository.findOne({
        where: { id: explicitId },
        relations: { healthCenter: true, user: true },
      });
      if (!healthcareWorker) {
        throw new BadRequestException('Personal de salud no válido');
      }
      if (healthcareWorker.healthCenter?.id !== patientCenterId) {
        throw new NotFoundException('Paciente no encontrado');
      }
      return healthcareWorker;
    }

    if (currentUser.role !== 'health_staff') {
      throw new BadRequestException(
        'Debe indicar el personal de salud que atiende la cita',
      );
    }
    const healthcareWorker = await this.healthcareWorkerRepository.findOne({
      where: { id: currentUser.sub },
      relations: { healthCenter: true, user: true },
    });
    if (!healthcareWorker) {
      throw new BadRequestException(
        'Solo el personal de salud puede agendar citas',
      );
    }
    if (healthcareWorker.healthCenter?.id !== patientCenterId) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return healthcareWorker;
  }

  private async createReminder(
    appointment: Appointment,
    appointmentDate: Date,
  ): Promise<void> {
    if (appointmentDate.getTime() <= Date.now()) {
      return;
    }
    const pending = await this.notificationStateRepository.findOne({
      where: { name: 'Pending' },
    });
    if (!pending) {
      return;
    }
    const sendAt = new Date(
      appointmentDate.getTime() - REMINDER_LEAD_MINUTES * 60_000,
    );
    await this.appointmentReminderRepository.save(
      this.appointmentReminderRepository.create({
        dateHourSend: sendAt,
        appointment,
        notificationState: pending,
      }),
    );
  }

  private async loadForPatient(
    patientId: string,
    appointmentId: string,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId, patient: { id: patientId } },
      relations: {
        patient: { healthCenter: true, user: true },
        healthcareWorker: { user: true },
        appointmentState: true,
        appointmentType: true,
      },
    });
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }
    return appointment;
  }

  private async loadByPatient(
    patientId: string,
    options: { orderDesc?: boolean } = {},
  ): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { patient: { id: patientId } },
      relations: {
        patient: { user: true },
        healthcareWorker: { user: true },
        appointmentState: true,
        appointmentType: true,
      },
      order: { dateHour: options.orderDesc ? 'DESC' : 'ASC' },
    });
  }

  private async loadUpcoming(patientId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: {
        patient: { id: patientId },
        dateHour: MoreThanOrEqual(new Date()),
        appointmentState: { name: 'Scheduled' },
      },
      relations: {
        patient: { user: true },
        healthcareWorker: { user: true },
        appointmentState: true,
        appointmentType: true,
      },
      order: { dateHour: 'ASC' },
    });
  }

  private async loadPublic(appointmentId: string): Promise<PublicAppointment> {
    const appointment = await this.loadById(appointmentId);
    return this.toPublic(appointment);
  }

  private async loadById(appointmentId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: {
        patient: { user: true },
        healthcareWorker: { user: true },
        appointmentState: true,
        appointmentType: true,
      },
    });
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }
    return appointment;
  }

  private toPublic(appointment: Appointment): PublicAppointment {
    return {
      id: appointment.id,
      dateHour: appointment.dateHour.toISOString(),
      reason: appointment.reason,
      durationMinutes: appointment.durationMinutes,
      appointmentStateId: appointment.appointmentState.id,
      appointmentStateName: appointment.appointmentState.name,
      appointmentTypeId: appointment.appointmentType.id,
      appointmentTypeName: appointment.appointmentType.name,
      cancelReason: appointment.cancelReason,
      cancelledAt: appointment.cancelledAt?.toISOString() ?? null,
      patientId: appointment.patient.id,
      patientName: appointment.patient.user.name,
      healthcareWorkerId: appointment.healthcareWorker.id,
      healthcareWorkerName: appointment.healthcareWorker.user.name,
    };
  }

  private assertModifiable(appointment: Appointment): void {
    if (appointment.appointmentState.name !== 'Scheduled') {
      throw new ConflictException(
        'Solo las citas programadas pueden modificarse o cancelarse',
      );
    }
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Medication } from './entities/medication.entity';
import { MedicationSchedule } from './entities/medication-schedule.entity';
import { MedicationScheduleDay } from './entities/medication-schedule-day.entity';
import { MedicationReminder } from './entities/medication-reminder.entity';
import { RouteAdministration } from '../catalogues/entities/route-administration.entity';
import { NotificationState } from '../catalogues/entities/notification-state.entity';
import { PatientsService } from '../patients/patients.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

export interface PublicMedicationSchedule {
  id: string;
  hour: string;
  timesPerDay: number;
  days: number[];
}

export interface PublicMedication {
  id: string;
  drugName: string;
  dose: string;
  instructions: string | null;
  startDate: string;
  endDate: string | null;
  active: boolean;
  routeAdministrationId: number;
  routeAdministrationName: string;
  prescribedById: string | null;
  prescribedByName: string | null;
  schedules: PublicMedicationSchedule[];
}

export interface PublicMedicationReminder {
  id: string;
  medicationId: string;
  drugName: string;
  dose: string;
  dateHourScheduled: string;
  notificationStateName: string;
  confirmationDate: string | null;
}

const REMINDER_WINDOW_DAYS = 21;

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
    @InjectRepository(MedicationSchedule)
    private readonly medicationScheduleRepository: Repository<MedicationSchedule>,
    @InjectRepository(MedicationReminder)
    private readonly medicationReminderRepository: Repository<MedicationReminder>,
    @InjectRepository(RouteAdministration)
    private readonly routeAdministrationRepository: Repository<RouteAdministration>,
    @InjectRepository(NotificationState)
    private readonly notificationStateRepository: Repository<NotificationState>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly patientsService: PatientsService,
  ) {}

  async create(
    patientId: string,
    currentUser: JwtPayload,
    dto: CreateMedicationDto,
  ): Promise<PublicMedication> {
    const patient = await this.patientsService.findRecordForScope(
      patientId,
      currentUser,
    );
    this.assertDates(dto.startDate, dto.endDate);
    const routeAdministration =
      await this.routeAdministrationRepository.findOne({
        where: { id: dto.routeAdministrationId },
      });
    if (!routeAdministration) {
      throw new BadRequestException('Vía de administración no válida');
    }

    const medication = await this.dataSource.transaction(async (manager) => {
      const saved = await manager.save(
        manager.create(Medication, {
          drugName: dto.drugName,
          dose: dto.dose,
          instructions: dto.instructions,
          startDate: new Date(`${dto.startDate}T00:00:00`),
          endDate: dto.endDate ? new Date(`${dto.endDate}T00:00:00`) : null,
          active: dto.active ?? true,
          patient: { id: patient.id },
          routeAdministration,
          prescribedByUser: { id: currentUser.sub },
        }),
      );
      for (const scheduleDto of dto.schedules) {
        const schedule = await manager.save(
          manager.create(MedicationSchedule, {
            hour: scheduleDto.hour,
            timesPerDay: scheduleDto.timesPerDay,
            medication: saved,
          }),
        );
        if (scheduleDto.days.length > 0) {
          await manager.insert(
            MedicationScheduleDay,
            scheduleDto.days.map((weekDay) => ({
              scheduleId: schedule.id,
              weekDay,
            })),
          );
        }
      }
      return saved;
    });

    await this.regenerateReminders(medication.id);
    return this.loadPublic(medication.id);
  }

  async list(
    patientId: string,
    currentUser: JwtPayload,
  ): Promise<PublicMedication[]> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    const medications = await this.loadByPatient(patientId);
    return medications.map((medication) => this.toPublic(medication));
  }

  async listForMe(currentUser: JwtPayload): Promise<PublicMedication[]> {
    const patient = await this.patientsService.findByUserId(currentUser.sub);
    const medications = await this.loadByPatient(patient.id);
    return medications.map((medication) => this.toPublic(medication));
  }

  async update(
    patientId: string,
    medicationId: string,
    currentUser: JwtPayload,
    dto: UpdateMedicationDto,
  ): Promise<PublicMedication> {
    this.assertDates(dto.startDate, dto.endDate);
    await this.patientsService.findRecordForScope(patientId, currentUser);
    const medication = await this.loadForPatient(patientId, medicationId, {
      includePatient: true,
      includeSchedules: true,
    });

    if (dto.drugName !== undefined) {
      medication.drugName = dto.drugName;
    }
    if (dto.dose !== undefined) {
      medication.dose = dto.dose;
    }
    if (dto.instructions !== undefined) {
      medication.instructions = dto.instructions ?? null;
    }
    if (dto.startDate !== undefined) {
      medication.startDate = new Date(`${dto.startDate}T00:00:00`);
    }
    if (dto.endDate !== undefined) {
      medication.endDate = dto.endDate
        ? new Date(`${dto.endDate}T00:00:00`)
        : null;
    }
    if (dto.active !== undefined) {
      medication.active = dto.active;
    }
    if (dto.routeAdministrationId !== undefined) {
      const routeAdministration =
        await this.routeAdministrationRepository.findOne({
          where: { id: dto.routeAdministrationId },
        });
      if (!routeAdministration) {
        throw new BadRequestException('Vía de administración no válida');
      }
      medication.routeAdministration = routeAdministration;
    }

    await this.medicationRepository.save(medication);

    if (dto.schedules !== undefined) {
      await this.replaceSchedules(medication.id, dto.schedules);
      await this.regenerateReminders(medication.id);
    } else if (dto.active === false) {
      await this.softRemoveReminders(medication.id);
    }

    return this.loadPublic(medication.id);
  }

  async remove(
    patientId: string,
    medicationId: string,
    currentUser: JwtPayload,
  ): Promise<void> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    const medication = await this.loadForPatient(patientId, medicationId);
    await this.medicationRepository.softDelete(medication.id);
  }

  async confirmReminder(
    currentUser: JwtPayload,
    medicationId: string,
    reminderId: string,
  ): Promise<PublicMedicationReminder> {
    const patient = await this.patientsService.findByUserId(currentUser.sub);
    const reminder = await this.medicationReminderRepository.findOne({
      where: { id: reminderId },
      relations: {
        schedule: {
          medication: { patient: true },
        },
        notificationState: true,
      },
    });
    if (
      !reminder ||
      reminder.schedule.medication.id !== medicationId ||
      reminder.schedule.medication.patient.id !== patient.id
    ) {
      throw new NotFoundException('Recordatorio no encontrado');
    }
    if (reminder.confirmationDate) {
      throw new ConflictException('La toma ya fue confirmada');
    }

    const confirmed = await this.notificationStateRepository.findOne({
      where: { name: 'Confirmed' },
    });
    if (!confirmed) {
      throw new BadRequestException('Estado de notificación no disponible');
    }
    reminder.notificationState = confirmed;
    reminder.confirmationDate = new Date();

    const saved = await this.medicationReminderRepository.save(reminder);
    return this.toPublicReminder(saved);
  }

  // === Internals ===

  private assertDates(startDate?: string, endDate?: string): void {
    if (!startDate || !endDate) {
      return;
    }
    const start = new Date(`${startDate}T00:00:00`).getTime();
    const end = new Date(`${endDate}T00:00:00`).getTime();
    if (end < start) {
      throw new BadRequestException(
        'La fecha de fin no puede ser anterior a la de inicio',
      );
    }
  }

  private async replaceSchedules(
    medicationId: string,
    schedules: CreateMedicationDto['schedules'],
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const existing = await manager.find(MedicationSchedule, {
        where: { medication: { id: medicationId } },
      });
      for (const schedule of existing) {
        await manager.softDelete(MedicationSchedule, schedule.id);
      }

      for (const scheduleDto of schedules) {
        const schedule = await manager.save(
          manager.create(MedicationSchedule, {
            hour: scheduleDto.hour,
            timesPerDay: scheduleDto.timesPerDay,
            medication: { id: medicationId },
          }),
        );
        if (scheduleDto.days.length > 0) {
          await manager.insert(
            MedicationScheduleDay,
            scheduleDto.days.map((weekDay) => ({
              scheduleId: schedule.id,
              weekDay,
            })),
          );
        }
      }
    });
  }

  private async regenerateReminders(medicationId: string): Promise<void> {
    const medication = await this.medicationRepository.findOne({
      where: { id: medicationId },
      relations: { schedules: { days: true } },
    });
    if (!medication || !medication.active) {
      return;
    }

    const pending = await this.notificationStateRepository.findOne({
      where: { name: 'Pending' },
    });
    if (!pending) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = medication.startDate > today ? medication.startDate : today;
    const endLimit = new Date(start);
    endLimit.setDate(endLimit.getDate() + REMINDER_WINDOW_DAYS);
    const end = medication.endDate
      ? medication.endDate < endLimit
        ? medication.endDate
        : endLimit
      : endLimit;

    for (const schedule of medication.schedules) {
      for (const day of schedule.days) {
        const dateHour = this.nextOccurrence(schedule.hour, day.weekDay, start);
        if (dateHour.getTime() > end.getTime()) {
          continue;
        }
        await this.medicationReminderRepository.save(
          this.medicationReminderRepository.create({
            dateHourScheduled: dateHour,
            schedule,
            notificationState: pending,
          }),
        );
      }
    }
  }

  private nextOccurrence(hour: string, weekDay: number, from: Date): Date {
    const [hours, minutes] = hour.split(':').map((part) => parseInt(part, 10));
    const candidate = new Date(from);
    candidate.setHours(hours, minutes, 0, 0);
    const delta = (weekDay - candidate.getDay() + 7) % 7;
    candidate.setDate(candidate.getDate() + delta);
    return candidate;
  }

  private async softRemoveReminders(medicationId: string): Promise<void> {
    const schedules = await this.medicationScheduleRepository.find({
      where: { medication: { id: medicationId } },
    });
    for (const schedule of schedules) {
      await this.medicationReminderRepository.softDelete({
        schedule: { id: schedule.id },
      });
    }
  }

  private async loadByPatient(patientId: string): Promise<Medication[]> {
    return this.medicationRepository.find({
      where: { patient: { id: patientId } },
      relations: {
        routeAdministration: true,
        prescribedByUser: true,
        schedules: { days: true },
      },
      order: { createdAt: 'DESC' },
    });
  }

  private async loadForPatient(
    patientId: string,
    medicationId: string,
    options: {
      includePatient?: boolean;
      includeSchedules?: boolean;
    } = {},
  ): Promise<Medication> {
    const medication = await this.medicationRepository.findOne({
      where: { id: medicationId, patient: { id: patientId } },
      relations: {
        patient: { healthCenter: true },
        routeAdministration: true,
        prescribedByUser: true,
        schedules: options.includeSchedules ? { days: true } : false,
      },
      withDeleted: false,
    });
    if (!medication) {
      throw new NotFoundException('Medicamento no encontrado');
    }
    return medication;
  }

  private async loadPublic(medicationId: string): Promise<PublicMedication> {
    const medication = await this.medicationRepository.findOne({
      where: { id: medicationId },
      relations: {
        routeAdministration: true,
        prescribedByUser: true,
        schedules: { days: true },
      },
    });
    if (!medication) {
      throw new NotFoundException('Medicamento no encontrado');
    }
    return this.toPublic(medication);
  }

  private toPublic(medication: Medication): PublicMedication {
    return {
      id: medication.id,
      drugName: medication.drugName,
      dose: medication.dose,
      instructions: medication.instructions ?? null,
      startDate: new Date(medication.startDate).toISOString().slice(0, 10),
      endDate: medication.endDate
        ? new Date(medication.endDate).toISOString().slice(0, 10)
        : null,
      active: medication.active,
      routeAdministrationId: medication.routeAdministration.id,
      routeAdministrationName: medication.routeAdministration.name,
      prescribedById: medication.prescribedByUser?.id ?? null,
      prescribedByName: medication.prescribedByUser?.name ?? null,
      schedules: (medication.schedules ?? []).map((schedule) => ({
        id: schedule.id,
        hour: schedule.hour.slice(0, 5),
        timesPerDay: schedule.timesPerDay,
        days: (schedule.days ?? []).map((day) => day.weekDay),
      })),
    };
  }

  private toPublicReminder(
    reminder: MedicationReminder,
  ): PublicMedicationReminder {
    return {
      id: reminder.id,
      medicationId: reminder.schedule.medication.id,
      drugName: reminder.schedule.medication.drugName,
      dose: reminder.schedule.medication.dose,
      dateHourScheduled: reminder.dateHourScheduled.toISOString(),
      notificationStateName: reminder.notificationState.name,
      confirmationDate: reminder.confirmationDate?.toISOString() ?? null,
    };
  }
}

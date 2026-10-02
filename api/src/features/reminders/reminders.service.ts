import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { MedicationReminder } from '../medications/entities/medication-reminder.entity';
import { AppointmentReminder } from '../appointments/entities/appointment-reminder.entity';
import { PatientsService } from '../patients/patients.service';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

export interface PublicMedicationReminder {
  type: 'medication';
  id: string;
  medicationId: string;
  scheduleId: string;
  title: string;
  dose: string;
  dateHour: string;
  reminderAt: string;
  confirmedAt: string | null;
  notificationState: string;
}

export interface PublicAppointmentReminder {
  type: 'appointment';
  id: string;
  appointmentId: string;
  title: string;
  professionalName: string;
  specialty: string;
  dateHour: string;
  reminderAt: string;
  notificationState: string;
}

export type PublicReminder = PublicMedicationReminder | PublicAppointmentReminder;

const DEFAULT_WINDOW_DAYS = 7;
const MAX_WINDOW_DAYS = 31;

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(MedicationReminder)
    private readonly medicationReminderRepository: Repository<MedicationReminder>,
    @InjectRepository(AppointmentReminder)
    private readonly appointmentReminderRepository: Repository<AppointmentReminder>,
    private readonly patientsService: PatientsService,
  ) {}

  async listForMe(
    currentUser: JwtPayload,
    windowDays?: number,
  ): Promise<PublicReminder[]> {
    const patient = await this.patientsService.findByUserId(currentUser.sub);
    return this.buildFeed(patient.id, windowDays);
  }

  async listForPatient(
    patientId: string,
    currentUser: JwtPayload,
    windowDays?: number,
  ): Promise<PublicReminder[]> {
    await this.patientsService.findRecordForScope(patientId, currentUser);
    return this.buildFeed(patientId, windowDays);
  }

  private async buildFeed(
    patientId: string,
    windowDays?: number,
  ): Promise<PublicReminder[]> {
    const days = this.resolveWindow(windowDays);
    const now = new Date();
    const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const [medicationReminders, appointmentReminders] = await Promise.all([
      this.medicationReminderRepository.find({
        where: {
          schedule: { medication: { patient: { id: patientId } } },
          dateHourScheduled: MoreThanOrEqual(now),
        },
        relations: { schedule: { medication: true }, notificationState: true },
        order: { dateHourScheduled: 'ASC' },
      }),
      this.appointmentReminderRepository.find({
        where: {
          appointment: { patient: { id: patientId } },
          dateHourSend: MoreThanOrEqual(now),
        },
        relations: {
          appointment: {
            healthcareWorker: { user: true, major: true },
            appointmentState: true,
          },
          notificationState: true,
        },
        order: { dateHourSend: 'ASC' },
      }),
    ]);

    const medication = medicationReminders
      .filter(
        (reminder) => reminder.dateHourScheduled.getTime() <= until.getTime(),
      )
      .map((reminder) => this.toMedicationReminder(reminder));

    const appointment = appointmentReminders
      .filter(
        (reminder) => reminder.dateHourSend.getTime() <= until.getTime(),
      )
      .filter((reminder) => reminder.appointment.appointmentState.name === 'Scheduled')
      .map((reminder) => this.toAppointmentReminder(reminder));

    return [...medication, ...appointment].sort(
      (a, b) =>
        new Date(a.reminderAt).getTime() - new Date(b.reminderAt).getTime(),
    );
  }

  private resolveWindow(windowDays?: number): number {
    if (windowDays === undefined || Number.isNaN(windowDays)) {
      return DEFAULT_WINDOW_DAYS;
    }
    return Math.min(Math.max(windowDays, 1), MAX_WINDOW_DAYS);
  }

  private toMedicationReminder(
    reminder: MedicationReminder,
  ): PublicMedicationReminder {
    const medication = reminder.schedule.medication;
    return {
      type: 'medication',
      id: reminder.id,
      medicationId: medication.id,
      scheduleId: reminder.schedule.id,
      title: medication.drugName,
      dose: medication.dose,
      dateHour: reminder.dateHourScheduled.toISOString(),
      reminderAt: reminder.dateHourScheduled.toISOString(),
      confirmedAt: reminder.confirmationDate?.toISOString() ?? null,
      notificationState: reminder.notificationState.name,
    };
  }

  private toAppointmentReminder(
    reminder: AppointmentReminder,
  ): PublicAppointmentReminder {
    const appointment = reminder.appointment;
    return {
      type: 'appointment',
      id: appointment.id,
      appointmentId: appointment.id,
      title: appointment.reason,
      professionalName: appointment.healthcareWorker.user.name,
      specialty: appointment.healthcareWorker.major.name,
      dateHour: appointment.dateHour.toISOString(),
      reminderAt: reminder.dateHourSend.toISOString(),
      notificationState: reminder.notificationState.name,
    };
  }
}

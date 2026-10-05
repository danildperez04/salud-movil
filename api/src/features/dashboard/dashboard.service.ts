import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../users/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { MedicationReminder } from '../medications/entities/medication-reminder.entity';
import {
  ClinicalRangeBandsService,
  RangeBands,
} from '../catalogues/clinical-range-bands.service';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

export interface PublicPatientAttention {
  id: string;
  name: string;
  healthCenterName: string;
  /** Indicador que motiva la atención, con su gravedad. */
  indicatorName: string | null;
  indicatorValue: number | null;
  indicatorUnit: string | null;
  indicatorDateHour: string | null;
  severity: 'normal' | 'alert' | 'critical' | null;
  band: string | null;
}

export interface PublicDashboardStats {
  totalPatients: number;
  activePatients: number;
  patientsWithAttention: number;
  upcomingAppointments: number;
  pendingMedicationIntakes: number;
  attention: PublicPatientAttention[];
  generatedAt: string;
}

/** Ventana por defecto para "próximas citas": 7 días. */
const UPCOMING_WINDOW_DAYS = 7;

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(MedicationReminder)
    private readonly medicationReminderRepository: Repository<MedicationReminder>,
    private readonly bandsService: ClinicalRangeBandsService,
  ) {}

  async stats(currentUser: JwtPayload): Promise<PublicDashboardStats> {
    // El personal solo ve su centro; el administrador ve todo.
    const centerId =
      currentUser.role === 'admin'
        ? null
        : await this.staffCenterId(currentUser);

    const [totalPatients, activePatients, attention] = await Promise.all([
      this.countPatients(centerId, false),
      this.countPatients(centerId, true),
      this.loadAttention(centerId),
    ]);

    const now = new Date();
    const windowEnd = new Date(
      now.getTime() + UPCOMING_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    );

    const [upcomingAppointments, pendingMedicationIntakes] = await Promise.all([
      this.countUpcomingAppointments(centerId, now, windowEnd),
      this.countPendingIntakes(centerId, now),
    ]);

    return {
      totalPatients,
      activePatients,
      patientsWithAttention: attention.length,
      upcomingAppointments,
      pendingMedicationIntakes,
      attention,
      generatedAt: now.toISOString(),
    };
  }

  // === Internals ===

  private async staffCenterId(currentUser: JwtPayload): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: currentUser.sub },
      relations: { healthcareWorker: { healthCenter: true } },
    });
    const centerId = user?.healthcareWorker?.healthCenter?.id;
    if (!centerId) {
      throw new ForbiddenException(
        'El personal de salud debe pertenecer a un centro de salud',
      );
    }
    return centerId;
  }

  private async countPatients(
    centerId: string | null,
    onlyActive: boolean,
  ): Promise<number> {
    const query = this.patientRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.user', 'user')
      .where('patient.deleted_at IS NULL')
      .andWhere('user.deleted_at IS NULL');

    if (centerId) {
      query.andWhere('patient.health_center_id = :centerId', { centerId });
    }
    if (onlyActive) {
      query.andWhere('user.is_active = true');
    }

    return query.getCount();
  }

  private async countUpcomingAppointments(
    centerId: string | null,
    from: Date,
    to: Date,
  ): Promise<number> {
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .innerJoin('appointment.appointmentState', 'state')
      .where('appointment.deleted_at IS NULL')
      .andWhere('state.name = :state', { state: 'Scheduled' })
      .andWhere('appointment.date_hour >= :from', { from })
      .andWhere('appointment.date_hour <= :to', { to });

    if (centerId) {
      // El filtro por centro vive en `patient`, así que hay que traerlo.
      query
        .innerJoin('appointment.patient', 'patient')
        .andWhere('patient.health_center_id = :centerId', { centerId });
    }

    return query.getCount();
  }

  private async countPendingIntakes(
    centerId: string | null,
    now: Date,
  ): Promise<number> {
    const query = this.medicationReminderRepository
      .createQueryBuilder('reminder')
      .innerJoin('reminder.notificationState', 'state')
      .where('reminder.deleted_at IS NULL')
      .andWhere('reminder.confirmation_date IS NULL')
      .andWhere('state.name = :state', { state: 'Pending' })
      .andWhere('reminder.date_hour_scheduled >= :now', { now })
      .andWhere('reminder.date_hour_scheduled <= :to', {
        to: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      });

    if (centerId) {
      // El filtro por centro vive en `patient`, alcanzada por dos relaciones.
      query
        .innerJoin('reminder.schedule', 'schedule')
        .innerJoin('schedule.medication', 'medication')
        .innerJoin('medication.patient', 'patient')
        .andWhere('patient.health_center_id = :centerId', { centerId });
    }

    return query.getCount();
  }

  /**
   * Pacientes cuyo último indicador por tipo cae en banda `alert` o `critical`.
   *
   * La gravedad se calcula aquí con las bandas clínicas, no leyendo un campo de
   * la entidad: `severity` es un valor calculado que solo existe en la capa de
   * servicio, así que leer `health_indicator` directamente lo deja indefinido.
   */
  private async loadAttention(
    centerId: string | null,
  ): Promise<PublicPatientAttention[]> {
    const query = this.patientRepository
      .createQueryBuilder('patient')
      .innerJoinAndSelect('patient.user', 'user')
      .innerJoinAndSelect('patient.healthCenter', 'healthCenter')
      .leftJoinAndSelect(
        'patient.healthIndicators',
        'indicator',
        'indicator.deleted_at IS NULL',
      )
      .leftJoinAndSelect('indicator.typeIndicator', 'typeIndicator')
      .where('patient.deleted_at IS NULL')
      .andWhere('user.deleted_at IS NULL')
      .andWhere('user.is_active = true');

    if (centerId) {
      query.andWhere('patient.health_center_id = :centerId', { centerId });
    }

    const [patients, bandsById] = await Promise.all([
      query.getMany(),
      this.bandsService.loadAll(),
    ]);

    return patients
      .map((patient) => this.toAttention(patient, bandsById))
      .filter((item): item is PublicPatientAttention => item !== null)
      .sort(
        (a, b) => this.severityRank(b.severity) - this.severityRank(a.severity),
      )
      .slice(0, 8);
  }

  /**
   * De cada paciente se toma el indicador más grave de entre sus últimos
   * valores por tipo. Si ninguno está en `alert`/`critical`, no se incluye:
   * una lista de atención que arrastra a los pacientes normales deja de
   * señalar nada.
   */
  private toAttention(
    patient: Patient,
    bandsById: Map<number, RangeBands>,
  ): PublicPatientAttention | null {
    const latest = new Map<number, (typeof patient.healthIndicators)[number]>();
    for (const indicator of patient.healthIndicators ?? []) {
      const key = indicator.typeIndicator?.id;
      if (key === undefined) {
        continue;
      }
      const current = latest.get(key);
      if (
        !current ||
        new Date(indicator.dateHour).getTime() >
          new Date(current.dateHour).getTime()
      ) {
        latest.set(key, indicator);
      }
    }

    let worst: {
      indicator: (typeof patient.healthIndicators)[number];
      severity: 'alert' | 'critical';
      band: string;
    } | null = null;

    for (const candidate of latest.values()) {
      const bands = bandsById.get(candidate.typeIndicator?.id ?? -1);
      if (!bands) {
        continue;
      }
      const match = this.bandsService.match(
        bands.primary,
        Number(candidate.value),
      );
      if (!match || match.severity === 'normal') {
        continue;
      }
      if (
        !worst ||
        this.severityRank(match.severity) > this.severityRank(worst.severity)
      ) {
        worst = {
          indicator: candidate,
          severity: match.severity,
          band: match.label,
        };
      }
    }

    if (!worst) {
      return null;
    }

    return {
      id: patient.id,
      name: patient.user.name,
      healthCenterName: patient.healthCenter?.name ?? '',
      indicatorName: worst.indicator.typeIndicator?.name ?? null,
      indicatorValue:
        worst.indicator.value !== null ? Number(worst.indicator.value) : null,
      indicatorUnit: worst.indicator.typeIndicator?.measurementUnit ?? null,
      indicatorDateHour: worst.indicator.dateHour.toISOString(),
      severity: worst.severity,
      band: worst.band,
    };
  }

  private severityRank(severity: string | null): number {
    if (severity === 'critical') {
      return 2;
    }
    if (severity === 'alert') {
      return 1;
    }
    return 0;
  }
}

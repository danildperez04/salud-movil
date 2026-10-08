// features/ipcp/domain/ipcp-snapshot.ts
// Arma la foto (IpcpSnapshot) que consume computeIpcp a partir de los registros de la app.
// Sin dependencias de React.
//
// TODO: cuando el backend calcule el IPCP, esto se elimina: el API arma la foto desde la base de
// datos (health_indicator, medication_reminder, appointment, medical_record).
import { parseLocalDate, timeLabelToDate } from '@/lib/date-format';
import { classifyReading } from './clinical-bands';
import type {
  AppointmentOutcome,
  Condition,
  DoseStatus,
  IpcpAppointment,
  IpcpReading,
  IpcpSnapshot,
} from './ipcp-model';

/** Lo mínimo que se necesita de los registros de cada feature. */
export type IpcpSources = {
  now: Date;
  indicators: readonly { typeName: string; value: string; dateHour: string }[];
  doses: readonly { scheduledAt: Date; status: DoseStatus }[];
  /** `date` "YYYY-MM-DD", `time` "10:00 AM", `status` de cat_appointment_state */
  appointments: readonly { date: string; time: string; status: string }[];
  diagnoses: readonly { name: string; status: string }[];
  history: readonly { kind: string; title: string }[];
  /** "YYYY-MM-DD" */
  birthDate?: string;
};

/** Los diagnósticos son texto libre: se reconocen por palabra clave. */
const CONDITION_KEYWORDS: readonly { condition: Condition; pattern: RegExp }[] = [
  { condition: 'hypertension', pattern: /hipertens|hypertens/i },
  { condition: 'diabetes', pattern: /diabet/i },
];

export function conditionFromText(text: string): Condition | null {
  return CONDITION_KEYWORDS.find(({ pattern }) => pattern.test(text))?.condition ?? null;
}

export function ageInYears(birthDate: Date, now: Date): number {
  const hadBirthday =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());
  return now.getFullYear() - birthDate.getFullYear() - (hadBirthday ? 0 : 1);
}

// Las citas sin resolver (programada, pendiente) no cuentan ni a favor ni en contra.
const OUTCOME_BY_STATUS: Record<string, AppointmentOutcome> = {
  Completed: 'completed',
  'No show': 'noShow',
  Cancelled: 'cancelled',
};

const compact = <T>(items: (T | null)[]): T[] => items.filter((item): item is T => item !== null);

export function buildIpcpSnapshot(sources: IpcpSources): IpcpSnapshot {
  const { now } = sources;

  const readings: IpcpReading[] = compact(
    sources.indicators.map((record) => {
      const classified = classifyReading(record.typeName, record.value);
      return classified && { ...classified, recordedAt: record.dateHour };
    }),
  );

  const appointments: IpcpAppointment[] = sources.appointments.map((appointment) => ({
    date: timeLabelToDate(appointment.time, parseLocalDate(appointment.date)).toISOString(),
    outcome: OUTCOME_BY_STATUS[appointment.status] ?? 'upcoming',
  }));

  return {
    now: now.toISOString(),
    readings,
    doses: sources.doses.map((dose) => ({
      scheduledAt: dose.scheduledAt.toISOString(),
      status: dose.status,
    })),
    appointments,
    background: {
      conditions: compact(
        sources.diagnoses
          .filter((diagnosis) => diagnosis.status === 'active')
          .map((diagnosis) => conditionFromText(diagnosis.name)),
      ),
      familyHistory: compact(
        sources.history
          .filter((entry) => entry.kind === 'family')
          .map((entry) => conditionFromText(entry.title)),
      ),
      ageYears: sources.birthDate ? ageInYears(parseLocalDate(sources.birthDate), now) : undefined,
    },
  };
}

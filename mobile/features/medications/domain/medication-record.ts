// features/medications/domain/medication-record.ts
// Medicamento tal como lo usan las pantallas, y la conversión desde la respuesta de la API.
// Sin dependencias de React.
import { ROUTE_ADMINISTRATION_LABELS } from '@/constants/labels';
import { hhmmToTimeLabel, timeLabelToMinutes } from '@/lib/date-format';
import { ALL_DAYS, describeDays } from '@/features/reminders/domain/reminder-days';

/** Una toma recurrente: la hora y los días de la semana en que aplica. */
export type MedicationSchedule = {
  id: string;
  /** "08:00 AM" */
  time: string;
  /** 0-6 con el lunes en 0 */
  days: number[];
};

export type MedicationRecord = {
  id: string;
  drugName: string;
  dose: string;
  /** segunda línea de la tarjeta, ej "Vía oral" o "1 tableta" */
  detail?: string;
  /** hora(s) de la toma, ej "08:00 AM" o "08:00 AM · 08:00 PM" */
  time: string;
  active: boolean;
  /** clave de FREQUENCY_LABELS o, si no es una, un texto ya listo para mostrar */
  frequency?: string;
  activeIngredient?: string;
  /** fechas YYYY-MM-DD */
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  /** tomas programadas; vacío en los medicamentos creados en el dispositivo */
  schedules: MedicationSchedule[];
};

/** Lo que usa la app de `PublicMedication`. */
export type ApiMedication = {
  id: string;
  drugName: string;
  dose: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
  routeAdministrationName: string;
  schedules: {
    id: string;
    /** "HH:mm" */
    hour: string;
    /** 0-6 con el domingo en 0 (Date.getDay) */
    days: number[];
  }[];
};

export const TIMES_SEPARATOR = ' · ';

/** El backend numera los días con el domingo en 0; la app, con el lunes en 0. */
export const toAppWeekday = (apiDay: number) => (apiDay + 6) % 7;

/** La primera hora de "08:00 AM · 08:00 PM" (para ordenar). */
export const firstTime = (time: string) => time.split(TIMES_SEPARATOR)[0];

export const timeMinutes = (time: string) => timeLabelToMinutes(firstTime(time));

export function toMedicationRecord(medication: ApiMedication): MedicationRecord {
  const schedules: MedicationSchedule[] = medication.schedules
    .map((schedule) => ({
      id: schedule.id,
      time: hhmmToTimeLabel(schedule.hour),
      days: schedule.days.map(toAppWeekday).sort((a, b) => a - b),
    }))
    .sort((a, b) => timeLabelToMinutes(a.time) - timeLabelToMinutes(b.time));

  const days = [...new Set(schedules.flatMap((schedule) => schedule.days))].sort((a, b) => a - b);

  return {
    id: medication.id,
    drugName: medication.drugName,
    dose: medication.dose,
    detail:
      ROUTE_ADMINISTRATION_LABELS[medication.routeAdministrationName] ??
      medication.routeAdministrationName,
    time: [...new Set(schedules.map((schedule) => schedule.time))].join(TIMES_SEPARATOR),
    active: medication.active,
    frequency: days.length === ALL_DAYS.length ? 'Daily' : describeDays(days),
    startDate: medication.startDate,
    endDate: medication.endDate ?? undefined,
    schedules,
  };
}

// features/ipcp/api/mock-ipcp.ts
//
// Mock temporal — el backend no calcula el IPCP todavía. Aquí se arma la foto con los datos de los
// otros mocks (indicadores, tomas, citas, expediente) y se aplica la MISMA fórmula (computeIpcp)
// que irá al backend. Cuando exista GET /ipcp, reemplazar fetchMockIpcp por apiClient sin tocar
// las pantallas.
import { fetchMockAppointments } from '@/features/appointments/api/mock-appointments';
import { fetchMockHealthIndicators } from '@/features/health-indicators/api/mock-health-indicators';
import {
  fetchMockDiagnoses,
  fetchMockHistory,
  fetchMockPatientProfile,
} from '@/features/medical-record/api/mock-medical-record';
import { fetchMockMedications } from '@/features/medications/api/mock-medications';
import { fetchMockDoseLog } from '@/features/reminders/api/mock-dose-log';
import { fetchMockMedicationReminders } from '@/features/reminders/api/mock-reminders';
import { buildDueDoses } from '@/features/reminders/domain/dose-schedule';
import type { IpcpResult } from '../domain/ipcp-model';
import { computeIpcp, IPCP_WINDOW_DAYS } from '../domain/ipcp-score';
import { buildIpcpSnapshot } from '../domain/ipcp-snapshot';

const DAY_MS = 24 * 60 * 60 * 1000;

export type IpcpReport = IpcpResult & {
  /** el backend avisa al hospital de confianza y al cuidador cuando el riesgo es alto */
  alertSent: boolean;
};

export type ReadyIpcpReport = Extract<IpcpReport, { status: 'ready' }>;

export async function fetchMockIpcp(): Promise<IpcpReport> {
  const [indicators, appointments, diagnoses, history, profile, medications, reminders, doseLog] =
    await Promise.all([
      fetchMockHealthIndicators(),
      fetchMockAppointments(),
      fetchMockDiagnoses(),
      fetchMockHistory(),
      fetchMockPatientProfile(),
      fetchMockMedications(),
      fetchMockMedicationReminders(),
      fetchMockDoseLog(),
    ]);

  const now = new Date();
  const doses = buildDueDoses({
    reminders,
    activeMedicationIds: new Set(medications.filter((m) => m.active).map((m) => m.id)),
    log: doseLog,
    from: new Date(now.getTime() - IPCP_WINDOW_DAYS * DAY_MS),
    to: now,
  });

  const result = computeIpcp(
    buildIpcpSnapshot({
      now,
      indicators,
      doses,
      appointments,
      diagnoses,
      history,
      birthDate: profile.birthDate,
    }),
  );

  // TODO: el backend decide si envía la alerta
  return { ...result, alertSent: result.status === 'ready' && result.level === 'high' };
}

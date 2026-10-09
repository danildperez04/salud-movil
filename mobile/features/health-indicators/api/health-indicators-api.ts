// features/health-indicators/api/health-indicators-api.ts
import { apiClient } from '@/lib/api-client';
import {
  toIndicatorRecord,
  type ApiHealthIndicator,
  type HealthIndicatorRecord,
  type IndicatorType,
} from '../domain/indicator-record';

/** Mediciones del propio paciente, de la más reciente a la más antigua. */
export async function fetchHealthIndicators(): Promise<HealthIndicatorRecord[]> {
  const indicators = await apiClient.get<ApiHealthIndicator[]>('/patients/me/health-indicators');
  return indicators.map(toIndicatorRecord);
}

export type NewHealthIndicator = {
  typeIndicatorId: number;
  value: number;
  /** diastólica, solo en presión arterial */
  valueSecondary?: number;
  dateHour: Date;
  notes?: string;
};

export async function createHealthIndicator(
  indicator: NewHealthIndicator,
): Promise<HealthIndicatorRecord> {
  const created = await apiClient.post<ApiHealthIndicator>('/patients/me/health-indicators', {
    ...indicator,
    dateHour: indicator.dateHour.toISOString(),
  });
  return toIndicatorRecord(created);
}

export function fetchIndicatorTypes(): Promise<IndicatorType[]> {
  return apiClient.get<IndicatorType[]>('/catalogues/type-indicators');
}

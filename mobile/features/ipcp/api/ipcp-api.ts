// features/ipcp/api/ipcp-api.ts
import { apiClient } from '@/lib/api-client';
import type { IpcpReport } from '../domain/ipcp-model';
import { toIpcpReport, type ApiIpcp } from '../domain/ipcp-report';

/** IPCP del propio paciente; el backend lo calcula y lo mantiene en caché unos minutos. */
export async function fetchIpcp(): Promise<IpcpReport> {
  return toIpcpReport(await apiClient.get<ApiIpcp>('/patients/me/ipcp'));
}

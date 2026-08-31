// features/health-indicators/api/mock-health-indicators.ts
//
// Mock temporal mientras POST/GET /health-indicators no existan en el backend
// (README: "entidad definida, sin controlador/servicio"). Mantiene la misma
// forma de datos que se espera del endpoint real — cuando exista, el cambio
// es reemplazar estas dos funciones por llamadas a apiClient, sin tocar
// componentes ni pantallas.
import type { IndicatorStatus } from '../components/HealthIndicatorCard';

export type HealthIndicatorRecord = {
  id: string;
  typeName: string;
  value: string;
  unit: string;
  status: IndicatorStatus;
  dateHour: string;
};

const UNIT_BY_TYPE: Record<string, string> = {
  'Blood pressure': 'mmhg',
  Glucose: 'mg/dl',
  Weight: 'kg',
  Temperature: 'C',
};

let mockIndicators: HealthIndicatorRecord[] = [
  {
    id: '1',
    typeName: 'Blood pressure',
    value: '120/80',
    unit: 'mmhg',
    status: 'normal',
    dateHour: new Date().toISOString(),
  },
  {
    id: '2',
    typeName: 'Glucose',
    value: '110',
    unit: 'mg/dl',
    status: 'normal',
    dateHour: new Date().toISOString(),
  },
  {
    id: '3',
    typeName: 'Weight',
    value: '72.5',
    unit: 'kg',
    status: 'normal',
    dateHour: new Date().toISOString(),
  },
  {
    id: '4',
    typeName: 'Temperature',
    value: '36.6',
    unit: 'C',
    status: 'normal',
    dateHour: new Date().toISOString(),
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockHealthIndicators(): Promise<HealthIndicatorRecord[]> {
  await delay(300); // simula latencia real, para que loading states se vean también
  return mockIndicators;
}

export async function createMockHealthIndicator(payload: {
  typeName: string;
  value: string;
  dateHour: Date;
}): Promise<HealthIndicatorRecord> {
  await delay(300);
  const record: HealthIndicatorRecord = {
    id: String(Date.now()),
    typeName: payload.typeName,
    value: payload.value,
    unit: UNIT_BY_TYPE[payload.typeName] ?? '',
    status: 'normal', // TODO: calcular status real cuando se defina la lógica de rangos
    dateHour: payload.dateHour.toISOString(),
  };
  mockIndicators = [record, ...mockIndicators];
  return record;
}

export type HealthIndicatorRecord = {
  id: string;
  typeName: string;
  value: string;
  unit: string;
  dateHour: string;
  notes?: string;
};

const UNIT_BY_TYPE: Record<string, string> = {
  'Blood pressure': 'mmHg',
  Glucose: 'mg/dL',
  Weight: 'kg',
  Temperature: '°C',
};

let mockIndicators: HealthIndicatorRecord[] = [
  {
    id: '1',
    typeName: 'Blood pressure',
    value: '120/80',
    unit: 'mmHg',
    dateHour: new Date().toISOString(),
  },
  {
    id: '2',
    typeName: 'Glucose',
    value: '110',
    unit: 'mg/dL',
    dateHour: new Date().toISOString(),
  },
  {
    id: '3',
    typeName: 'Weight',
    value: '72.5',
    unit: 'kg',
    dateHour: new Date().toISOString(),
  },
  {
    id: '4',
    typeName: 'Temperature',
    value: '36.6',
    unit: '°C',
    dateHour: new Date().toISOString(),
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockHealthIndicators(): Promise<HealthIndicatorRecord[]> {
  await delay(300);
  return mockIndicators;
}

export async function createMockHealthIndicator(payload: {
  typeName: string;
  value: string;
  dateHour: Date;
  notes?: string;
}): Promise<HealthIndicatorRecord> {
  await delay(300);
  const record: HealthIndicatorRecord = {
    id: String(Date.now()),
    typeName: payload.typeName,
    value: payload.value,
    unit: UNIT_BY_TYPE[payload.typeName] ?? '',
    dateHour: payload.dateHour.toISOString(),
    notes: payload.notes,
  };
  mockIndicators = [record, ...mockIndicators];
  return record;
}

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

const now = new Date();

const currentIndicators: HealthIndicatorRecord[] = [
  { id: '1', typeName: 'Blood pressure', value: '120/80', unit: 'mmHg' },
  { id: '2', typeName: 'Glucose', value: '110', unit: 'mg/dL' },
  { id: '3', typeName: 'Weight', value: '72.5', unit: 'kg' },
  { id: '4', typeName: 'Temperature', value: '36.6', unit: '°C' },
].map((record) => ({ ...record, dateHour: now.toISOString() }));

type HistorySeed = {
  typeName: string;
  unit: string;
  /** cada cuántos días hay una medición */
  everyDays: number;
  hour: number;
  minute: number;
  /** valor de la medición número `i` hacia atrás (i = 1 es la más reciente del historial) */
  valueAt: (i: number) => string;
  notes?: string[];
};

const HISTORY_DAYS = 90;

// Variación determinista (no aleatoria) para que el mock sea estable entre recargas.
const HISTORY_SEEDS: HistorySeed[] = [
  {
    typeName: 'Blood pressure',
    unit: 'mmHg',
    everyDays: 2,
    hour: 8,
    minute: 30,
    valueAt: (i) =>
      `${120 + Math.round(4 * Math.sin(i * 0.9))}/${80 + Math.round(3 * Math.sin(i * 1.3))}`,
    notes: ['Después del desayuno', 'En reposo'],
  },
  {
    typeName: 'Glucose',
    unit: 'mg/dL',
    everyDays: 3,
    hour: 7,
    minute: 45,
    valueAt: (i) => String(105 + Math.round(12 * Math.sin(i * 0.8))),
    notes: ['En ayunas'],
  },
  {
    typeName: 'Weight',
    unit: 'kg',
    everyDays: 7,
    hour: 7,
    minute: 0,
    valueAt: (i) => (72.5 + i * 0.2).toFixed(1),
  },
  {
    typeName: 'Temperature',
    unit: '°C',
    everyDays: 5,
    hour: 20,
    minute: 15,
    valueAt: (i) => (36.6 + 0.3 * Math.sin(i * 1.1)).toFixed(1),
  },
];

function buildHistory(): HealthIndicatorRecord[] {
  return HISTORY_SEEDS.flatMap((seed) => {
    const count = Math.floor(HISTORY_DAYS / seed.everyDays);
    return Array.from({ length: count }, (_, index) => {
      const i = index + 1;
      const date = new Date(now);
      date.setDate(date.getDate() - i * seed.everyDays);
      date.setHours(seed.hour, seed.minute, 0, 0);
      // se alternan las notas del seed con mediciones sin observaciones
      const noteSlot = seed.notes ? i % (seed.notes.length + 1) : 0;
      const note = noteSlot === 0 ? undefined : seed.notes?.[noteSlot - 1];
      return {
        id: `${seed.typeName}-${i}`,
        typeName: seed.typeName,
        value: seed.valueAt(i),
        unit: seed.unit,
        dateHour: date.toISOString(),
        notes: note,
      };
    });
  });
}

// Los registros "actuales" van primero (el Home toma el [0]); el historial, del más reciente al más antiguo.
let mockIndicators: HealthIndicatorRecord[] = [
  ...currentIndicators,
  ...buildHistory().sort((a, b) => Date.parse(b.dateHour) - Date.parse(a.dateHour)),
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

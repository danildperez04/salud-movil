// features/ipcp/domain/clinical-bands.ts
// Gravedad (normal / alerta / crítica) de una lectura. Sin dependencias de React.
//
// TODO: espejo TEMPORAL de CLINICAL_RANGE_BANDS (api/src/database/seed-data.ts). Cuando el backend
// calcule el IPCP, la gravedad llega ya resuelta desde clinical_range_band y esto se elimina.
// ⚠️ Cortes PROVISIONALES, pendientes de validación médica (igual que en el backend).
//
// Diferencia con el backend: aquí gana la banda MÁS GRAVE entre las que contienen el valor. El
// backend toma la primera por orden de siembra, y por ese orden "Hipotermia" (≤ 35) nunca se
// alcanza porque "Hipotermia leve" (≤ 35.49) se evalúa antes.
import { parseComponents } from '@/features/health-indicators/domain/indicator-range';
import type { IndicatorType, Severity } from './ipcp-model';

type Band = { severity: Severity; min: number | null; max: number | null };

/** Una lista de bandas por componente del valor: presión arterial tiene sistólica y diastólica. */
const BANDS: Record<IndicatorType, Band[][]> = {
  bloodPressure: [
    [
      { severity: 'critical', min: 160, max: null },
      { severity: 'alert', min: 140, max: 159.99 },
      { severity: 'normal', min: 90, max: 139.99 },
      { severity: 'alert', min: null, max: 89.99 },
    ],
    [
      { severity: 'critical', min: 110, max: null },
      { severity: 'alert', min: 90, max: 109.99 },
      { severity: 'normal', min: 60, max: 89.99 },
      { severity: 'alert', min: null, max: 59.99 },
    ],
  ],
  glucose: [
    [
      { severity: 'critical', min: 200, max: null },
      { severity: 'alert', min: 126, max: 199.99 },
      { severity: 'normal', min: 70, max: 125.99 },
      { severity: 'alert', min: null, max: 69.99 },
    ],
  ],
  temperature: [
    [
      { severity: 'critical', min: 39, max: null },
      { severity: 'alert', min: 37.5, max: 38.99 },
      { severity: 'normal', min: 35.5, max: 37.49 },
      { severity: 'alert', min: null, max: 35.49 },
      { severity: 'critical', min: null, max: 35 },
    ],
  ],
};

/** Nombre del tipo en el catálogo (cat_type_indicator) -> indicador del IPCP. Peso no tiene bandas. */
const INDICATOR_BY_TYPE_NAME: Record<string, IndicatorType> = {
  'Blood pressure': 'bloodPressure',
  Glucose: 'glucose',
  Temperature: 'temperature',
};

const RANK: Record<Severity, number> = { normal: 0, alert: 1, critical: 2 };
const worse = (a: Severity, b: Severity): Severity => (RANK[b] > RANK[a] ? b : a);

const contains = ({ min, max }: Band, value: number) =>
  (min === null || value >= min) && (max === null || value <= max);

/** Gravedad de un componente. Un valor en un hueco entre bandas se trata como alerta (lo prudente). */
function severityOfComponent(bands: Band[], value: number): Severity {
  const matching = bands.filter((band) => contains(band, value));
  return matching.length === 0 ? 'alert' : matching.map((b) => b.severity).reduce(worse, 'normal');
}

/**
 * Clasifica una lectura registrada ("120/80", "110"). Devuelve null si el tipo no tiene bandas
 * o el valor no es numérico. En presión arterial prevalece el componente más grave.
 */
export function classifyReading(
  typeName: string,
  rawValue: string,
): { type: IndicatorType; severity: Severity } | null {
  const type = INDICATOR_BY_TYPE_NAME[typeName];
  if (!type) return null;

  const values = parseComponents(rawValue);
  const severities = BANDS[type].flatMap((bands, i) =>
    Number.isFinite(values[i]) ? [severityOfComponent(bands, values[i])] : [],
  );
  if (severities.length === 0) return null;

  return { type, severity: severities.reduce(worse, 'normal') };
}

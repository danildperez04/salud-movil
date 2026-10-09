// features/health-indicators/domain/indicator-range.ts
// Lógica de rangos de referencia: clasifica un valor en bajo/normal/alto y lo
// ubica en la barra de medición. Sin dependencias de React ni de UI.

export type IndicatorStatus = 'low' | 'normal' | 'high';

/**
 * La barra se divide en tres zonas de ancho fijo (bajo / normal / alto) sin
 * importar la escala real del indicador, para que la zona normal siempre sea
 * legible. Dentro de cada zona el valor se interpola linealmente.
 */
export const ZONE_BOUNDARIES = { lowEnd: 0.25, highStart: 0.75 } as const;

export type IndicatorEvaluation = {
  status: IndicatorStatus;
  /** 0 a 1, posición del valor sobre la barra */
  position: number;
};

type IndicatorRangeConfig = {
  /** límite inferior del rango considerado normal (inclusive) */
  normalMin: number;
  /** límite superior del rango considerado normal (inclusive) */
  normalMax: number;
  /** valor que se dibuja en el extremo izquierdo de la barra */
  scaleMin: number;
  /** valor que se dibuja en el extremo derecho de la barra */
  scaleMax: number;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export class IndicatorRange {
  constructor(private readonly config: IndicatorRangeConfig) {
    const { scaleMin, normalMin, normalMax, scaleMax } = config;
    if (!(scaleMin < normalMin && normalMin < normalMax && normalMax < scaleMax)) {
      throw new Error('IndicatorRange: se requiere scaleMin < normalMin < normalMax < scaleMax');
    }
  }

  evaluate(value: number): IndicatorEvaluation {
    return { status: this.statusOf(value), position: this.positionOf(value) };
  }

  private statusOf(value: number): IndicatorStatus {
    if (value < this.config.normalMin) return 'low';
    if (value > this.config.normalMax) return 'high';
    return 'normal';
  }

  private positionOf(value: number): number {
    const { scaleMin, normalMin, normalMax, scaleMax } = this.config;
    const { lowEnd, highStart } = ZONE_BOUNDARIES;

    if (value < normalMin) {
      return clamp01((value - scaleMin) / (normalMin - scaleMin)) * lowEnd;
    }
    if (value > normalMax) {
      return highStart + clamp01((value - normalMax) / (scaleMax - normalMax)) * (1 - highStart);
    }
    return lowEnd + ((value - normalMin) / (normalMax - normalMin)) * (highStart - lowEnd);
  }
}

// TODO: valores provisionales de referencia general, pendientes de validación
// médica (mismos cortes provisionales que clinical_range en el backend).
// Cuando exista el endpoint de rangos, esto debe venir de la API.
// Un tipo puede tener varios rangos (uno por componente del valor): la presión
// arterial es sistólica/diastólica. Peso no tiene rango porque el IMC requiere
// la estatura del paciente, que todavía no se captura.
const RANGES_BY_TYPE: Record<string, IndicatorRange[]> = {
  'Blood pressure': [
    new IndicatorRange({ scaleMin: 60, normalMin: 90, normalMax: 129, scaleMax: 180 }),
    new IndicatorRange({ scaleMin: 40, normalMin: 60, normalMax: 84, scaleMax: 120 }),
  ],
  Glucose: [new IndicatorRange({ scaleMin: 40, normalMin: 70, normalMax: 139, scaleMax: 250 })],
  Temperature: [new IndicatorRange({ scaleMin: 34, normalMin: 36, normalMax: 37.5, scaleMax: 41 })],
};

/** "120/80" -> [120, 80]; "110" -> [110]. Partes inválidas quedan como NaN para conservar el índice. */
export function parseComponents(rawValue: string): number[] {
  return rawValue.split('/').map((part) => Number.parseFloat(part.trim().replace(',', '.')));
}

/**
 * Evalúa el valor registrado contra el rango de su tipo. Devuelve null si el
 * tipo no tiene rango de referencia o el valor no es numérico.
 * Si algún componente sale de rango, ese prevalece (ej. diastólica alta con
 * sistólica normal => alto).
 */
export function evaluateIndicator(typeName: string, rawValue: string): IndicatorEvaluation | null {
  const ranges = RANGES_BY_TYPE[typeName];
  if (!ranges) return null;

  const values = parseComponents(rawValue);
  const evaluations = ranges.flatMap((range, i) =>
    Number.isFinite(values[i]) ? [range.evaluate(values[i])] : [],
  );

  return evaluations.find((e) => e.status !== 'normal') ?? evaluations[0] ?? null;
}

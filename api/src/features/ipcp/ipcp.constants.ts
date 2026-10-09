/**
 * Constantes del IPCP (Índice Prioritario de Control de Pacientes).
 *
 * ⚠️ **LOS PESOS Y LOS CORTES DE ESTE ARCHIVO SON PROVISIONALES.**
 * Son un punto de partida razonable para que el índice sea explicable y
 * auditable, pero **no están validados clínicamente**. El equipo médico debe
 * confirmarlos contra guías clínicas antes de que el índice se use para
 * priorizar pacientes reales.
 *
 * Están aislados aquí a propósito: cuando llegue la validación se cambian estas
 * constantes y sus pruebas, sin tocar la lógica del cálculo.
 */

/** Peso de cada variable en el índice. Deben sumar 100. */
export const IPCP_WEIGHTS = {
  /** En qué banda de gravedad caen los últimos indicadores medidos. */
  indicatorDeviation: 40,
  /** Tomas de medicamento no confirmadas sobre las generadas. */
  adherence: 25,
  /** Citas no asistidas o canceladas sobre el total de citas. */
  appointmentControl: 20,
  /** Si el indicador mejora o empeora entre lecturas. */
  trend: 15,
} as const;

/** Cortes del índice normalizado. Coherentes con `IpcpLevel`. */
export const IPCP_LEVEL_CUTS = {
  moderate: 40,
  high: 70,
} as const;

/** Puntuación de una banda de gravedad clínica. */
export const IPCP_SEVERITY_SCORE = {
  normal: 0,
  alert: 50,
  critical: 100,
} as const;

/**
 * Puntuación de la tendencia. La comparación se hace con las bandas, no con el
 * valor crudo, porque "subió" no significa "empeoró": una temperatura de 38 a
 * 37 °C mejora aunque el número suba.
 */
export const IPCP_TREND_SCORE = {
  improving: 0,
  stable: 50,
  worsening: 100,
} as const;

/**
 * TTL del cache de IPCP, en **milisegundos** (así lo interpreta
 * `CacheModule.register`). Se alinea con el cron de refresco: el valor en cache
 * nunca vive más que el intervalo en que se recalcula, de modo que la pantalla
 * nunca muestra un índice más viejo que 30 minutos.
 */
export const IPCP_CACHE_TTL_MS = 10 * 60 * 1000;

/** Prefijo de las claves de cache. Una por paciente: `ipcp:<patientId>`. */
export const IPCP_CACHE_PREFIX = 'ipcp:';

/** Ventanas de observación de cada variable. */
export const IPCP_WINDOWS = {
  /** Tomas de medicamento. */
  adherenceDays: 30,
  /** Citas. */
  appointmentDays: 90,
  /** Lecturas por tipo de indicador necesarias para evaluar la tendencia. */
  trendReadings: 2,
} as const;

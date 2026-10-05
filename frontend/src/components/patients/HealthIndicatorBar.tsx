import type { IndicatorSeverity } from "../../types";

interface HealthIndicatorBarProps {
  label: string;
  /** Valor ya formateado por el componente padre, ej. "120/80" o "110". */
  value: string;
  severity: IndicatorSeverity;
  /** Etiqueta de la banda clínica, ej. "Sistólica elevada". */
  band: string | null;
  /** Límites de normalidad de la API, para dibujar la zona normal. */
  minValue: number | null;
  maxValue: number | null;
}

/** Color por gravedad de la banda clínica. */
const SEVERITY_COLORS: Record<"normal" | "alert" | "critical", string> = {
  normal: "#2DB79A",
  alert: "#F5A524",
  critical: "#EF4444",
};

const SEVERITY_TEXT: Record<"normal" | "alert" | "critical", string> = {
  normal: "text-primary-dark",
  alert: "text-amber-600",
  critical: "text-red-600",
};

/**
 * Fila de "Indicadores de salud": nombre, barra con la zona de normalidad y un
 * marcador en la posición real del valor, más el valor a la derecha.
 *
 * La posición del marcador **no** es un porcentaje de riesgo inventado: sale de
 * dónde cae el valor entre `minValue` y `maxValue`, que son los límites reales
 * que devuelve `GET /patients/:id/health-indicators/summary`. Si el valor cae
 * fuera de ellos, se ancla al extremo correspondiente.
 *
 * Cuando la API no tiene bandas para ese tipo de indicador, `severity` llega
 * `null` y la fila se muestra sin marcador ni color de gravedad, en vez de
 * inventar una posición.
 */
export function HealthIndicatorBar({
  label,
  value,
  severity,
  band,
  minValue,
  maxValue,
}: HealthIndicatorBarProps) {
  // La zona normal se pinta con los límites que devuelve la API. Sin ellos no
  // hay referencia real que dibujar.
  const hasRange = minValue !== null && maxValue !== null && maxValue > minValue;

  const parsedValue = Number.parseFloat(value);
  const anchor =
    hasRange && !Number.isNaN(parsedValue)
      ? Math.min(100, Math.max(0, ((parsedValue - minValue!) / (maxValue! - minValue!)) * 100))
      : null;

  const color =
    severity && severity !== 'normal' ? SEVERITY_COLORS[severity] : SEVERITY_COLORS.normal;
  const textColor = severity ? SEVERITY_TEXT[severity] : 'text-navy';

  return (
    <div className="flex items-center gap-4 py-2.5">
      <span className="w-32 shrink-0 font-body text-sm font-medium text-navy">
        {label}
      </span>
      <div className="relative h-1.5 flex-1 rounded-full bg-slate-200">
        {hasRange ? (
          <span
            className="absolute inset-y-0 left-0 right-0 rounded-full opacity-30"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        ) : null}
        {anchor !== null ? (
          <span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-navy bg-white"
            style={{ left: `${anchor}%` }}
            aria-hidden="true"
          />
        ) : null}
      </div>
      <span className={`w-28 shrink-0 text-right font-body text-sm font-semibold ${textColor}`}>
        {value}
      </span>
      {band ? (
        <span
          className={`w-32 shrink-0 truncate font-body text-xs ${textColor}`}
          title={band}
        >
          {band}
        </span>
      ) : (
        <span className="w-32 shrink-0 font-body text-xs text-muted">
          {severity ? "Sin banda" : "—"}
        </span>
      )}
    </div>
  );
}
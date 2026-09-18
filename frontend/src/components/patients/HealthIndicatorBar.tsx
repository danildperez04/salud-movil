interface HealthIndicatorBarProps {
  label: string;
  value: string;
  /** 0 = extremo seguro (verde), 100 = extremo de riesgo (rojo). */
  riskPosition: number;
}

/**
 * Fila de "Indicadores de salud": nombre, barra de riesgo verde→rojo con un
 * marcador circular en la posición del valor, y el valor a la derecha.
 * La línea punteada es una guía visual decorativa (umbral normal/elevado),
 * no representa un dato real todavía.
 */
export function HealthIndicatorBar({
  label,
  value,
  riskPosition,
}: HealthIndicatorBarProps) {
  const clamped = Math.min(100, Math.max(0, riskPosition));

  return (
    <div className="flex items-center gap-4 py-2.5">
      <span className="w-32 shrink-0 font-body text-sm font-medium text-navy">
        {label}
      </span>
      <div
        className="relative h-1.5 flex-1 rounded-full"
        style={{
          background:
            "linear-gradient(to right, #2DB79A 0%, #F5A524 55%, #EF4444 100%)",
        }}
      >
        <span
          className="absolute top-1/2 left-[55%] h-3 w-px -translate-y-1/2 border-l border-dashed border-slate-300"
          aria-hidden="true"
        />
        <span
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-navy bg-white"
          style={{ left: `${clamped}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="w-28 shrink-0 text-right font-body text-sm font-semibold text-navy">
        {value}
      </span>
    </div>
  );
}

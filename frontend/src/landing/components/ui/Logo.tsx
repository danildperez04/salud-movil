type LogoProps = {
  /** Dibuja el pulso y enciende los puntos al montar. Desactívalo en el footer. */
  animated?: boolean;
};

export function Logo({ animated = true }: LogoProps) {
  return (
    <a href="#inicio" aria-label="Salud Móvil" className="flex items-center">
      <svg viewBox="0 0 687 232" aria-hidden="true" className="h-14 w-auto">
        {/* Pulso: entrada plana → joroba → caída → pico → regresa a la línea base y continúa.
            pathLength=1 normaliza el trazo para poder "dibujarlo" con stroke-dashoffset. */}
        <path
          d="M27 145.5 L95 145.5 L117 98 L145 196 L191 47 L212 145.5 L549 145.5"
          fill="none"
          pathLength={1}
          className={`stroke-mint ${animated ? "animate-draw [stroke-dasharray:1]" : ""}`}
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Los 3 puntos, debajo de "vil" */}
        {[573.5, 595, 616.5].map((cx, index) => (
          <circle
            key={cx}
            cx={cx}
            cy="145.5"
            r="6.75"
            className={`fill-mint ${animated ? "animate-dot-in" : ""}`}
            style={
              animated
                ? {
                    animationDelay: `${1.2 + index * 0.18}s`,
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }
                : undefined
            }
          />
        ))}

        {/* Texto como parte del mismo SVG, para que quede perfectamente alineado con el trazo */}
        <text
          x="229"
          y="111"
          style={{ fontFamily: "Poppins, sans-serif" }}
          fontWeight={800}
          fontSize="66"
          className="fill-navy"
        >
          Salud
        </text>
        <text
          x="447"
          y="111"
          style={{ fontFamily: "Poppins, sans-serif" }}
          fontWeight={800}
          fontSize="66"
          className="fill-mint"
        >
          Móvil
        </text>
      </svg>
    </a>
  );
}

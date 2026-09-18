export function Logo() {
  return (
    <a href="#inicio" aria-label="Salud Móvil" className="flex items-center">
      <svg viewBox="0 0 687 232" aria-hidden="true" className="h-14 w-auto">
        {/* Pulso: entrada plana → joroba → caída → pico → regresa a la línea base y continúa */}
        <path
          d="M27 145.5 L95 145.5 L117 98 L145 196 L191 47 L212 145.5 L549 145.5"
          fill="none"
          className="stroke-mint"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Los 3 puntos, debajo de "vil" */}
        <circle cx="573.5" cy="145.5" r="6.75" className="fill-mint" />
        <circle cx="595" cy="145.5" r="6.75" className="fill-mint" />
        <circle cx="616.5" cy="145.5" r="6.75" className="fill-mint" />

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

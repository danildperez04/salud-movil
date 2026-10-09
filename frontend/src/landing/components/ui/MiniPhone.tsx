type MiniPhoneProps = {
  src: string;
  alt: string;
  secondary?: boolean;
  /** Flotación suave. Desactívala si el padre ya anima el teléfono. */
  floating?: boolean;
  /** Desfase de la flotación en ms, para que dos teléfonos no suban a la vez. */
  floatOffset?: number;
  /** Posición, rotación y animación de entrada: van en el wrapper exterior. */
  className?: string;
};

export function MiniPhone({
  src,
  alt,
  secondary = false,
  floating = true,
  floatOffset = 0,
  className = "",
}: MiniPhoneProps) {
  const width = secondary
    ? "w-[var(--mini-phone-secondary-width,190px)] opacity-[0.88]"
    : "w-[var(--mini-phone-width,230px)]";

  return (
    // Tres capas a propósito: el wrapper recibe posición/rotación/entrada, la
    // capa intermedia la flotación y el marco solo el aspecto del teléfono.
    // Así ninguna animación pisa la `transform` de otra.
    <div className={className}>
      <div
        className={floating ? "animate-float-slow" : undefined}
        style={
          floating ? { animationDelay: `${-floatOffset}ms` } : undefined
        }
      >
        <div
          className={`${width} flex-none rounded-[35px] bg-navy p-1.75 shadow-[0_25px_60px_rgba(0,0,0,0.28)]`}
        >
          <img
            src={src}
            alt={alt}
            width={390}
            height={844}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full rounded-[29px]"
          />
        </div>
      </div>
    </div>
  );
}

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export type RevealDirection = "up" | "left" | "right" | "scale" | "fade";

type FadeInOnScrollProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Retraso en ms. Sirve para escalonar hermanos: `index * 90`. */
  delay?: number;
  /** De dónde llega el elemento al revelarse. */
  direction?: RevealDirection;
};

// El efecto va en este wrapper y no en la tarjeta que contiene: así los
// estados hover de la tarjeta (translate, sombra) no heredan el retraso ni la
// duración del reveal.
export function FadeInOnScroll({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  direction = "up",
}: FadeInOnScrollProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <Tag
      ref={ref}
      data-reveal={direction}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}

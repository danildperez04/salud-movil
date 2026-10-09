import type { ReactNode } from "react";
import { Badge } from "./Badge";
import { FadeInOnScroll } from "./FadeInOnScroll";

type SectionHeaderProps = {
  badge: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
};

// Encabezado común de las secciones: badge, título y bajada que entran uno tras
// otro. Antes cada sección repetía este bloque con tamaños de título distintos
// (35, 36, 38px…); ahora comparten escala.
export function SectionHeader({
  badge,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto max-w-210 text-center" : ""} ${className}`}>
      <FadeInOnScroll>
        <Badge>{badge}</Badge>
      </FadeInOnScroll>
      <FadeInOnScroll delay={90}>
        <h2 className="my-3.5 text-[clamp(36px,4.6vw,64px)] leading-[1.04] tracking-[-0.035em] text-navy">
          {title}
        </h2>
      </FadeInOnScroll>
      {description && (
        <FadeInOnScroll delay={180}>
          <p
            className={`mt-4 text-[18px] leading-[1.7] text-muted landing-sm:text-[19px] ${
              centered ? "mx-auto max-w-190" : "max-w-175"
            }`}
          >
            {description}
          </p>
        </FadeInOnScroll>
      )}
    </div>
  );
}

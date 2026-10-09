import { Badge } from "../ui/Badge";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";

export function ComingSoonSection() {
  return (
    <section
      id="proximamente"
      className="py-18 pb-21.5 bg-[linear-gradient(180deg,#ffffff_0%,var(--color-mint-soft-2)_100%)]"
    >
      <div className="container-x">
        <FadeInOnScroll
          direction="scale"
          className="rounded-[30px] border border-mint-line bg-[linear-gradient(145deg,#ffffff,var(--color-mint-soft))] px-6 py-12 text-center shadow-soft landing-sm:px-7"
        >
          <Badge>Salud Móvil</Badge>
          <h2
            aria-label="Próximamente"
            className="my-3.5 mb-2.5 text-[38px] leading-none tracking-[-0.035em] text-navy landing-sm:text-[clamp(44px,5.4vw,78px)]"
          >
            Próximamente
            {/* Tres puntos que rebotan en cadena: eco de los puntos del logo */}
            <span
              aria-hidden="true"
              className="ml-1.5 inline-flex items-end gap-1.5 align-baseline"
            >
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-2 w-2 animate-bounce-dot rounded-full bg-mint landing-sm:h-3.5 landing-sm:w-3.5"
                  style={{ animationDelay: `${dot * 160}ms` }}
                />
              ))}
            </span>
          </h2>
          <p className="mx-auto max-w-170 text-[18px] leading-[1.7] text-muted">
            Estamos preparando la experiencia para que Salud Móvil esté cada vez
            más cerca de ti.
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

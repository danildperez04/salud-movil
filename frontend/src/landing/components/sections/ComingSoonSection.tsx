import { FadeInOnScroll } from "../ui/FadeInOnScroll";

export function ComingSoonSection() {
  return (
    <section
      id="proximamente"
      className="py-18 pb-21.5 bg-[linear-gradient(180deg,#ffffff_0%,var(--color-mint-soft-2)_100%)]"
    >
      <div className="container-x">
        <FadeInOnScroll className="rounded-[30px] border border-mint-line bg-[linear-gradient(145deg,#ffffff,var(--color-mint-soft))] px-7 py-13.5 text-center shadow-soft">
          <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-3 py-2 text-xs font-[850] tracking-[0.02em] text-mint-dark">
            <span className="h-1.75 w-1.75 rounded-full bg-mint" />
            Salud Móvil
          </span>
          <h2 className="my-3.5 mb-2.5 text-[clamp(40px,5vw,68px)] leading-none tracking-[-2px] text-navy">
            Próximamente...
          </h2>
          <p className="mx-auto max-w-155 text-[16px] leading-[1.7] text-muted">
            Estamos preparando la experiencia para que Salud Móvil esté cada vez
            más cerca de ti.
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

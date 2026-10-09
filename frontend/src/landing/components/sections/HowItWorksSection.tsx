import { ChevronRight } from "lucide-react";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { IconTile } from "../ui/IconTile";
import { SectionHeader } from "../ui/SectionHeader";
import { ICONS } from "../../data/icons";
import { steps } from "../../data/features";

export function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="py-16 bg-[linear-gradient(180deg,#f7fbfa,#fff)] landing-sm:py-22"
    >
      <div className="container-x">
        <SectionHeader
          badge="Simple desde el primer día"
          title="Tu salud organizada en tres pasos."
          description="Diseñada para reducir fricción y hacer que la información importante sea más fácil de consultar."
          className="mb-13.5"
        />

        <ol className="m-0 grid list-none grid-cols-1 gap-5.5 p-0 landing-md:grid-cols-3">
          {steps.map((step, index) => (
            <FadeInOnScroll
              key={step.num}
              as="li"
              delay={index * 140}
              className="relative flex"
            >
              <article className="group relative flex-1 overflow-hidden rounded-3xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-mint-line-strong hover:shadow-soft landing-sm:p-7">
                {/* Numeral grande de fondo: da ritmo a la fila y refuerza el orden */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-1 -top-3 font-display text-[104px] font-black leading-none text-mint-soft transition-colors duration-300 group-hover:text-mint-line"
                >
                  {step.num}
                </span>
                <IconTile
                  icon={ICONS[step.icon]}
                  size="lg"
                  className="relative mb-7"
                />
                <div className="relative mb-2 text-[14px] font-black tracking-[0.12em] text-mint-dark">
                  {step.num} · {step.label}
                </div>
                <h3 className="relative mb-2.25 text-[24px] font-bold text-navy">
                  {step.title}
                </h3>
                <p className="relative m-0 text-[15px] leading-[1.7] text-muted">
                  {step.text}
                </p>
              </article>

              {/* Flecha que une cada paso con el siguiente (solo en fila) */}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-6.75 top-1/2 z-2 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-mint-line bg-white text-mint-dark shadow-soft landing-md:grid"
                >
                  <ChevronRight size={16} strokeWidth={2.4} />
                </span>
              )}
            </FadeInOnScroll>
          ))}
        </ol>
      </div>
    </section>
  );
}

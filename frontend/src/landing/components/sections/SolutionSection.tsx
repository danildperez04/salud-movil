import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { IconTile } from "../ui/IconTile";
import { SectionHeader } from "../ui/SectionHeader";
import { ICONS } from "../../data/icons";
import { features } from "../../data/features";

export function SolutionSection() {
  return (
    <section id="funciones" className="bg-surface py-19.5 landing-sm:py-27.5">
      <div className="container-x">
        <SectionHeader
          badge="Una app pensada para acompañarte"
          title="Todo lo que necesitas para cuidar tu salud."
          description="Una experiencia que conecta organización, seguimiento y acceso a información desde el mismo lugar."
          className="mb-13.5"
        />

        <div className="grid grid-cols-1 gap-4.5 landing-sm:grid-cols-2 landing-md:grid-cols-3">
          {features.map((feature, index) => (
            <FadeInOnScroll
              key={feature.title}
              delay={(index % 3) * 100}
              className="flex"
            >
              <article
                className={`group relative flex-1 overflow-hidden rounded-3xl border p-6 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-strong ${
                  feature.highlight
                    ? "border-transparent bg-[linear-gradient(145deg,var(--color-navy),var(--color-navy-2))] text-white"
                    : "border-line bg-white hover:border-mint-line-strong"
                }`}
              >
                {/* Resplandor que respira en la tarjeta destacada */}
                {feature.highlight && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-glow rounded-full bg-mint/30 blur-2xl"
                  />
                )}
                <IconTile
                  icon={ICONS[feature.icon]}
                  size="lg"
                  tone={feature.highlight ? "dark" : "soft"}
                  className="relative mb-5"
                />
                <h3
                  className={`relative mb-2.25 text-[18px] font-bold ${
                    feature.highlight ? "text-white" : "text-navy"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`relative m-0 text-[13px] leading-[1.65] ${
                    feature.highlight ? "text-[#bdd0da]" : "text-muted"
                  }`}
                >
                  {feature.text}
                </p>
              </article>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

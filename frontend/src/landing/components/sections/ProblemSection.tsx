import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { IconTile } from "../ui/IconTile";
import { SectionHeader } from "../ui/SectionHeader";
import { ICONS } from "../../data/icons";
import { problemCards } from "../../data/features";

export function ProblemSection() {
  return (
    <section id="beneficios" className="bg-white py-19.5 landing-sm:py-27.5">
      <div className="container-x grid grid-cols-1 items-center gap-11.25 landing-md:grid-cols-[0.9fr_1.1fr] landing-md:gap-17.5">
        <SectionHeader
          align="left"
          badge="El problema"
          title="Tu salud no debería vivir entre papeles, chats y recordatorios sueltos."
          description="Cuando la información está dispersa, recordar una cita, seguir un tratamiento o encontrar un dato clínico puede convertirse en una tarea complicada. Salud Móvil busca reunir lo importante en una experiencia sencilla."
        />

        <div className="grid grid-cols-1 gap-3.5 landing-sm:grid-cols-2">
          {problemCards.map((card, index) => (
            <FadeInOnScroll
              key={card.title}
              delay={(index % 2) * 100 + Math.floor(index / 2) * 100}
              className="flex"
            >
              <article className="group flex-1 rounded-[22px] border border-line bg-white p-5.5 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-mint-line-strong hover:shadow-strong">
                <IconTile icon={ICONS[card.icon]} className="mb-4" />
                <h3 className="mb-2 text-[16px] font-bold text-navy">
                  {card.title}
                </h3>
                <p className="m-0 text-xs leading-[1.6] text-muted">
                  {card.text}
                </p>
              </article>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

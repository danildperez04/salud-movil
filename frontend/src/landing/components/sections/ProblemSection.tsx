import { Badge } from "../ui/Badge";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { problemCards } from "../../data/content";

export function ProblemSection() {
  return (
    <section id="beneficios" className="bg-white py-19.5 landing-sm:py-27.5">
      <div className="container-x grid grid-cols-1 items-center gap-11.25 landing-md:grid-cols-[0.9fr_1.1fr] landing-md:gap-17.5">
        <FadeInOnScroll>
          <Badge>El problema</Badge>
          <h2 className="my-3.75 mb-5 text-[clamp(35px,4.2vw,57px)] leading-[1.03] tracking-[-2px] text-navy">
            Tu salud no debería vivir entre papeles, chats y recordatorios
            sueltos.
          </h2>
          <p className="text-[16px] leading-[1.75] text-muted">
            Cuando la información está dispersa, recordar una cita, seguir un
            tratamiento o encontrar un dato clínico puede convertirse en una
            tarea complicada. Salud Móvil busca reunir lo importante en una
            experiencia sencilla.
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll className="grid grid-cols-1 gap-3.5 landing-sm:grid-cols-2">
          {problemCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[22px] border border-line bg-white p-6 shadow-soft"
            >
              <div className="mb-4.5 grid h-11 w-11 place-items-center rounded-full bg-mint-soft text-xl text-mint-dark">
                {card.icon}
              </div>
              <h3 className="mb-2 text-[16px] font-bold text-navy">
                {card.title}
              </h3>
              <p className="m-0 text-xs leading-[1.6] text-muted">
                {card.text}
              </p>
            </div>
          ))}
        </FadeInOnScroll>
      </div>
    </section>
  );
}

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { heroPoints, heroFloatCards } from "../../data/content";

const FLOAT_CARD_POSITIONS: Record<string, string> = {
  fc1: "left-[-2%] top-[17%] landing-sm:left-[2%] landing-sm:top-[20%]",
  fc2: "right-[-3%] top-[44%] landing-sm:right-0 landing-sm:top-[43%]",
  fc3: "left-0 bottom-[7%] landing-sm:left-[8%] landing-sm:bottom-[13%]",
};

const FLOAT_CARD_DELAYS: Record<string, string> = {
  fc1: "[animation-delay:-1s]",
  fc2: "[animation-delay:-2.3s]",
  fc3: "[animation-delay:-3.4s]",
};

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative pb-17 pt-27 bg-[radial-gradient(circle_at_82%_20%,color-mix(in_oklab,var(--color-mint)_18%,transparent),transparent_24%),radial-gradient(circle_at_8%_72%,color-mix(in_oklab,var(--color-navy-2)_8%,transparent),transparent_22%),linear-gradient(180deg,#fff_0%,#f8fcfb_100%)] landing-sm:pb-22 landing-sm:pt-28.75 landing-md:pt-35.25"
    >
      <div className="container-x grid grid-cols-1 items-center gap-16 landing-md:grid-cols-[1.02fr_0.98fr]">
        <FadeInOnScroll>
          <Badge>Tu salud, organizada en un solo lugar</Badge>
          <h1 className="my-4.5 mb-6 max-w-190 text-[48px] leading-[0.96] tracking-[-2.4px] text-navy landing-sm:text-[clamp(48px,6.2vw,79px)] landing-sm:tracking-[-3.5px]">
            Tu salud. Más clara. Más cerca.{" "}
            <em className="not-italic text-mint">Siempre contigo.</em>
          </h1>
          <p className="mb-7.5 max-w-160 text-[16px] leading-[1.7] text-muted landing-sm:text-[18px]">
            Salud Móvil reúne tus citas, medicamentos, indicadores y expediente
            clínico para que cuidar de ti sea más simple, organizado y accesible
            desde tu celular.
          </p>
          <div className="mb-6.5 flex flex-wrap gap-3">
            <Button href="#descubre">Descubre Salud Móvil →</Button>
            <Button href="#funciones" variant="secondary">
              Ver funcionalidades
            </Button>
          </div>
          <div className="flex flex-wrap gap-5 text-xs font-bold text-muted">
            {heroPoints.map((point) => (
              <span key={point} className="flex items-center gap-1.75">
                <b className="grid h-4.75 w-4.75 place-items-center rounded-full bg-mint-soft text-[11px] font-black text-mint-dark">
                  ✓
                </b>{" "}
                {point}
              </span>
            ))}
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll className="relative grid min-h-130 place-items-center landing-sm:min-h-152.5 landing-md:min-h-162.5">
          <div className="absolute left-1/2 top-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-mint/28 after:absolute after:inset-13.75 after:rounded-full after:border after:border-dashed after:border-navy-2/18 after:content-[''] landing-sm:h-130 landing-sm:w-130" />
          <div className="relative z-4 w-63 rotate-[2.2deg] rounded-[45px] bg-navy p-2.25 shadow-phone before:absolute before:left-1/2 before:top-1.75 before:z-3 before:h-5.5 before:w-22.5 before:-translate-x-1/2 before:rounded-b-[13px] before:bg-navy before:content-[''] landing-sm:w-76.5">
            <img
              src="/assets/mockups/hero-main.webp"
              alt="Pantalla principal de Salud Móvil"
              className="block w-full rounded-[37px]"
            />
          </div>
          {heroFloatCards.map((card) => (
            <div
              key={card.title}
              className={`absolute z-6 animate-[float_5s_ease-in-out_infinite] rounded-[18px] border border-line bg-[rgba(255,255,255,0.96)] p-[11px_12px] shadow-soft landing-sm:p-[14px_16px] ${FLOAT_CARD_POSITIONS[card.className] ?? ""} ${FLOAT_CARD_DELAYS[card.className] ?? ""}`}
            >
              <div className="mb-2.25 grid h-8 w-8 place-items-center rounded-full bg-mint-soft text-xl font-black text-mint-dark">
                {card.icon}
              </div>
              <strong className="mb-1 block text-xs text-navy">
                {card.title}
              </strong>
              <small className="text-[10px] text-muted">{card.text}</small>
            </div>
          ))}
        </FadeInOnScroll>
      </div>
    </section>
  );
}

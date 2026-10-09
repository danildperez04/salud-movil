import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { CheckBadge } from "../ui/CheckBadge";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { ICONS } from "../../data/icons";
import {
  heroHeadline,
  heroPoints,
  heroFloatCards,
  type HeroFloatCardId,
} from "../../data/hero";

const FLOAT_CARD_POSITIONS: Record<HeroFloatCardId, string> = {
  cita: "left-[-2%] top-[17%] landing-sm:left-[2%] landing-sm:top-[20%]",
  medicamentos:
    "right-[-3%] top-[44%] landing-sm:right-0 landing-sm:top-[43%]",
  indicadores:
    "left-0 bottom-[7%] landing-sm:left-[8%] landing-sm:bottom-[13%]",
};

// Desfases negativos: cada tarjeta arranca en un punto distinto de su ciclo.
const FLOAT_CARD_DELAYS: Record<HeroFloatCardId, string> = {
  cita: "[animation-delay:-1s]",
  medicamentos: "[animation-delay:-2.3s]",
  indicadores: "[animation-delay:-3.4s]",
};

export function Hero() {
  const lineCount = heroHeadline.lines.length;

  return (
    <section
      id="inicio"
      className="relative overflow-hidden pb-17 pt-27 bg-[radial-gradient(circle_at_82%_20%,color-mix(in_oklab,var(--color-mint)_18%,transparent),transparent_24%),radial-gradient(circle_at_8%_72%,color-mix(in_oklab,var(--color-navy-2)_8%,transparent),transparent_22%),linear-gradient(180deg,#fff_0%,#f8fcfb_100%)] landing-sm:pb-22 landing-sm:pt-28.75 landing-md:pt-35.25"
    >
      {/* Manchas de color que se desplazan despacio detrás del contenido */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-16 h-104 w-104 animate-drift rounded-full bg-mint/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-32 h-88 w-88 animate-drift-reverse rounded-full bg-teal/15 blur-3xl"
      />

      <div className="container-x relative grid grid-cols-1 items-center gap-16 landing-md:grid-cols-[1.02fr_0.98fr]">
        <div>
          <FadeInOnScroll>
            <Badge>Tu salud, organizada en un solo lugar</Badge>
          </FadeInOnScroll>

          {/* Cada frase es un bloque: el salto de línea cae entre frases, no a
              mitad de una ("Más / clara"), y entran una tras otra. */}
          <h1 className="my-4.5 mb-6 max-w-210 text-[48px] leading-[0.98] tracking-[-0.045em] text-navy landing-sm:text-[clamp(48px,5.6vw,82px)]">
            {heroHeadline.lines.map((line, index) => (
              <FadeInOnScroll
                key={line}
                as="span"
                delay={120 + index * 110}
                className="block"
              >
                {line}
              </FadeInOnScroll>
            ))}
            <FadeInOnScroll
              as="span"
              delay={120 + lineCount * 110}
              className="block"
            >
              <em className="animate-shimmer bg-linear-to-r from-mint via-mint-light to-mint bg-size-[200%_auto] bg-clip-text not-italic text-transparent">
                {heroHeadline.accent}
              </em>
            </FadeInOnScroll>
          </h1>

          <FadeInOnScroll delay={600}>
            <p className="mb-7.5 max-w-175 text-[18px] leading-[1.7] text-muted landing-sm:text-[21px]">
              Salud Móvil reúne tus citas, medicamentos, indicadores y
              expediente clínico para que cuidar de ti sea más simple,
              organizado y accesible desde tu celular.
            </p>
          </FadeInOnScroll>

          <FadeInOnScroll delay={720}>
            <div className="mb-6.5 flex flex-wrap gap-3">
              <Button href="#descubre">
                Descubre Salud Móvil
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
              <Button href="#funciones" variant="secondary">
                Ver funcionalidades
              </Button>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={840}>
            <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2.5 p-0 text-[14px] font-bold text-muted">
              {heroPoints.map((point) => (
                <li key={point} className="flex items-center gap-1.75">
                  <CheckBadge />
                  {point}
                </li>
              ))}
            </ul>
          </FadeInOnScroll>
        </div>

        <FadeInOnScroll
          direction="scale"
          delay={250}
          className="relative grid min-h-130 place-items-center landing-sm:min-h-152.5 landing-md:min-h-162.5"
        >
          {/* Órbitas punteadas que giran en sentidos opuestos */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 landing-sm:h-130 landing-sm:w-130"
          >
            <div className="absolute inset-0 animate-orbit rounded-full border border-dashed border-mint/30" />
            <div className="absolute inset-13.75 animate-orbit-reverse rounded-full border border-dashed border-navy-2/20" />
          </div>
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-glow rounded-full bg-mint/25 blur-3xl"
          />

          <div className="relative z-4 animate-float-slow">
            <div className="w-63 rotate-[2.2deg] rounded-[45px] bg-navy p-2.25 shadow-phone before:absolute before:left-1/2 before:top-1.75 before:z-3 before:h-5.5 before:w-22.5 before:-translate-x-1/2 before:rounded-b-[13px] before:bg-navy before:content-[''] landing-sm:w-76.5">
              <img
                src="/assets/mockups/hero-main.webp"
                alt="Pantalla principal de Salud Móvil"
                width={390}
                height={844}
                className="block h-auto w-full rounded-[37px]"
              />
            </div>
          </div>

          {heroFloatCards.map((card, index) => {
            const Icon = ICONS[card.icon];
            return (
              <FadeInOnScroll
                key={card.id}
                direction="scale"
                delay={700 + index * 160}
                className={`absolute z-6 ${FLOAT_CARD_POSITIONS[card.id]}`}
              >
                <div
                  className={`animate-float rounded-[18px] border border-line bg-white/95 p-[11px_12px] shadow-soft backdrop-blur-sm landing-sm:p-[14px_16px] ${FLOAT_CARD_DELAYS[card.id]}`}
                >
                  <div className="mb-2.25 grid h-8 w-8 place-items-center rounded-full bg-mint-soft text-mint-dark">
                    <Icon size={17} strokeWidth={2.2} aria-hidden="true" />
                  </div>
                  <strong className="mb-1 block text-[14px] text-navy">
                    {card.title}
                  </strong>
                  <small className="text-[12px] text-muted">{card.text}</small>
                </div>
              </FadeInOnScroll>
            );
          })}
        </FadeInOnScroll>
      </div>
    </section>
  );
}

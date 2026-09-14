import { Badge } from "../ui/Badge";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { features } from "../../data/content";

export function SolutionSection() {
  return (
    <section id="funciones" className="bg-surface py-19.5 landing-sm:py-27.5">
      <div className="container-x">
        <FadeInOnScroll className="mx-auto mb-13.5 max-w-190 text-center">
          <Badge>Una app pensada para acompañarte</Badge>
          <h2 className="my-3.5 mb-4 text-[clamp(32px,4vw,54px)] leading-[1.04] tracking-[-1.8px] text-navy">
            Todo lo que necesitas para cuidar tu salud.
          </h2>
          <p className="mx-auto max-w-175 text-[17px] leading-[1.65] text-muted">
            Una experiencia que conecta organización, seguimiento y acceso a
            información desde el mismo lugar.
          </p>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 gap-4.5 landing-sm:grid-cols-2 landing-md:grid-cols-3">
          {features.map((feature) => (
            <FadeInOnScroll
              key={feature.title}
              className={`min-h-55 rounded-3xl border p-6 shadow-soft ${
                feature.highlight
                  ? "border-transparent bg-[linear-gradient(145deg,var(--color-navy),var(--color-navy-2))] text-white"
                  : "border-line bg-white"
              }`}
            >
              <div
                className={`mb-6 grid h-12 w-12 place-items-center rounded-full text-xl ${
                  feature.highlight
                    ? "bg-[rgba(255,255,255,0.12)] text-mint-light"
                    : "bg-mint-soft text-mint-dark"
                }`}
              >
                {feature.icon === "svg" ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-6 w-6 fill-none stroke-current stroke-[1.9px] [stroke-linecap:round] [stroke-linejoin:round]"
                  >
                    <path d="M4 16V8" />
                    <path d="M4 16H20" />
                    <path d="M7 14l3-3 2 2 4-5 1 2" />
                  </svg>
                ) : (
                  feature.icon
                )}
              </div>
              <h3
                className={`mb-2.25 text-[18px] font-bold ${
                  feature.highlight ? "text-white" : "text-navy"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`m-0 text-[13px] leading-[1.65] ${
                  feature.highlight ? "text-[#bdd0da]" : "text-muted"
                }`}
              >
                {feature.text}
              </p>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

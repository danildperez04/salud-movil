import { Button } from "../ui/Button";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-navy py-23.75">
      <div
        aria-hidden="true"
        className="absolute -right-30 -top-42.5 h-120 w-120 rounded-full bg-mint/13"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32.5 -left-20 h-75 w-75 rounded-full border border-dashed border-[rgba(255,255,255,0.16)]"
      />
      <FadeInOnScroll className="container-x relative z-2 mx-auto max-w-200 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-mint/13 px-3 py-2 text-xs font-[850] tracking-[0.02em] text-mint-light">
          <span className="h-1.75 w-1.75 rounded-full bg-mint" />
          Salud Móvil
        </span>
        <h2 className="my-3.25 mb-4.5 text-[clamp(38px,5vw,64px)] leading-none tracking-[-2.3px] text-white">
          ¿Y si tu salud estuviera siempre contigo?
        </h2>
        <p className="mx-auto mb-7 max-w-162.5 text-[16px] leading-[1.7] text-[#bfd0d9]">
          Menos información dispersa. Más claridad para organizar tus citas,
          medicamentos, indicadores y expediente.
        </p>
        <Button href="#inicio">Tu salud, en tus manos →</Button>
      </FadeInOnScroll>
    </section>
  );
}

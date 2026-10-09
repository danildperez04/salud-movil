import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-navy py-20">
      <div
        aria-hidden="true"
        className="absolute -right-30 -top-42.5 h-120 w-120 animate-drift rounded-full bg-mint/13"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32.5 -left-20 h-75 w-75 animate-orbit rounded-full border border-dashed border-white/16"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-[12%] h-24 w-24 animate-drift-reverse rounded-full bg-teal/25 blur-xl"
      />
      <FadeInOnScroll
        direction="scale"
        className="container-x relative z-2 mx-auto max-w-220 text-center"
      >
        <Badge tone="dark">Salud Móvil</Badge>
        <h2 className="my-3.25 mb-4.5 text-[clamp(40px,5.4vw,74px)] leading-none tracking-[-0.035em] text-white">
          ¿Y si tu salud estuviera siempre contigo?
        </h2>
        <p className="mx-auto mb-7 max-w-180 text-[18px] leading-[1.7] text-[#bfd0d9]">
          Menos información dispersa. Más claridad para organizar tus citas,
          medicamentos, indicadores y expediente.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 landing-sm:flex-row">
          <Button href="#inicio">
            Tu salud, en tus manos
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Button>
          <Button href="#demo" variant="secondary">
            Solicitar una demo
          </Button>
        </div>
      </FadeInOnScroll>
    </section>
  );
}

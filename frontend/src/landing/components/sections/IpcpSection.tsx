import { Info } from "lucide-react";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { MiniPhone } from "../ui/MiniPhone";
import { SectionHeader } from "../ui/SectionHeader";

export function IpcpSection() {
  return (
    <section id="prioridad" className="bg-white py-16 landing-sm:py-22">
      <div className="container-x grid grid-cols-1 items-center gap-12 landing-md:grid-cols-2 landing-md:gap-17.5">
        <FadeInOnScroll
          direction="left"
          className="relative grid min-h-112.5 place-items-center [--mini-phone-width:165px] landing-sm:min-h-135 landing-sm:[--mini-phone-width:215px] landing-md:min-h-155 landing-md:[--mini-phone-width:265px]"
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 landing-sm:h-110 landing-sm:w-110"
          >
            <div className="absolute inset-0 animate-orbit rounded-full border border-dashed border-mint/35" />
            <div className="absolute inset-9 rounded-full bg-mint/10 blur-2xl" />
          </div>

          {/* Dos teléfonos solapados: el segundo baja un poco para dar profundidad */}
          <div className="relative flex items-center justify-center">
            <MiniPhone
              src="/assets/mockups/ipcp-1.webp"
              alt="Pantalla Mi prioridad IPCP"
              className="relative z-1 -rotate-6"
            />
            <MiniPhone
              src="/assets/mockups/ipcp-2.webp"
              alt="Indicadores de salud"
              floatOffset={2600}
              className="relative z-2 -ml-12 mt-16 rotate-6 landing-sm:-ml-16"
            />
          </div>
        </FadeInOnScroll>

        <div>
          <SectionHeader
            align="left"
            badge="IPCP · Mi prioridad"
            title="Una guía para saber cuándo prestar más atención."
          />

          <FadeInOnScroll delay={180} className="mt-4 flex flex-col gap-4">
            <p className="m-0 text-[17px] leading-[1.7] text-muted">
              “Mi prioridad” reúne información ingresada por el usuario para
              mostrar un nivel de prioridad visual y ofrecer orientación sobre
              el siguiente paso.
            </p>
            <p className="m-0 text-[17px] leading-[1.7] text-muted">
              Además, Salud Móvil presenta indicadores con rangos fáciles de
              interpretar y acceso al historial de mediciones.
            </p>
          </FadeInOnScroll>

          <FadeInOnScroll delay={280} className="mt-6">
            <div className="flex items-start gap-3 rounded-[18px] border border-mint-line bg-mint-soft-2 p-4 text-[14px] leading-[1.6] text-muted">
              <Info
                size={18}
                strokeWidth={2.2}
                aria-hidden="true"
                className="mt-px shrink-0 text-mint-dark"
              />
              <p className="m-0">
                <strong className="text-navy">Importante:</strong> Salud Móvil
                es una herramienta de apoyo y organización. No sustituye la
                evaluación, el diagnóstico ni la atención de un profesional de
                la salud.
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}

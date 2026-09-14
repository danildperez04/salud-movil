import { Badge } from "../ui/Badge";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { MiniPhone } from "../ui/MiniPhone";

export function IpcpSection() {
  return (
    <section id="prioridad" className="bg-white py-19.5 landing-sm:py-27.5">
      <div className="container-x grid grid-cols-1 items-center gap-17.5 landing-md:grid-cols-2">
        <FadeInOnScroll className="relative grid min-h-120 place-items-center landing-sm:min-h-140 landing-md:min-h-150">
          <MiniPhone
            src="/assets/mockups/ipcp-1.webp"
            alt="Pantalla Mi prioridad IPCP"
            className="rotate-[-5deg] landing-sm:-ml-17.5 landing-md:-ml-30"
          />
          <MiniPhone
            src="/assets/mockups/ipcp-2.webp"
            alt="Indicadores de salud"
            className="absolute bottom-2.5 right-1.25 rotate-[7deg] landing-sm:right-10"
          />
        </FadeInOnScroll>

        <FadeInOnScroll>
          <Badge>IPCP · Mi prioridad</Badge>
          <h2 className="my-3.5 mb-4.5 text-[clamp(36px,4.2vw,56px)] leading-[1.03] tracking-[-2px] text-navy">
            Una guía para saber cuándo prestar más atención.
          </h2>
          <p className="text-[15px] leading-[1.7] text-muted">
            “Mi prioridad” reúne información ingresada por el usuario para
            mostrar un nivel de prioridad visual y ofrecer orientación sobre el
            siguiente paso.
          </p>
          <p className="text-[15px] leading-[1.7] text-muted">
            Además, Salud Móvil presenta indicadores con rangos fáciles de
            interpretar y acceso al historial de mediciones.
          </p>
          <div className="mt-5.5 rounded-[18px] border border-mint-line bg-mint-soft-2 p-[16px_18px] text-xs leading-[1.6] text-muted">
            <strong className="text-navy">Importante:</strong> Salud Móvil es
            una herramienta de apoyo y organización. No sustituye la evaluación,
            el diagnóstico ni la atención de un profesional de la salud.
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

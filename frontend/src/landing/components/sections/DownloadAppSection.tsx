import { Download } from "lucide-react";
import { FaApple, FaAndroid } from "react-icons/fa6";
import { Button } from "../ui/Button";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { SectionHeader } from "../ui/SectionHeader";

export function DownloadAppSection() {
  return (
    <section
      id="descargar"
      className="py-19.5 bg-[linear-gradient(180deg,#ffffff_0%,var(--color-mint-soft-2)_100%)] landing-sm:py-27.5"
    >
      <div className="container-x grid grid-cols-1 items-center gap-12 landing-md:grid-cols-[0.92fr_1.08fr] landing-md:gap-16">
        <SectionHeader
          align="left"
          badge="Lleva Salud Móvil contigo"
          title="Tu salud, también desde tu celular."
          description="Accede a tus citas, medicamentos, indicadores y expediente desde Salud Móvil. La versión para Android podrá descargarse directamente, mientras que la versión para iOS estará disponible próximamente."
        />

        <div className="grid grid-cols-1 gap-4 landing-sm:grid-cols-2">
          <FadeInOnScroll direction="right" delay={120} className="flex">
            <article className="group flex-1 rounded-3xl border border-line bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-mint-line-strong hover:shadow-strong">
              <div className="mb-5 grid h-13.5 w-13.5 place-items-center rounded-[18px] bg-mint-soft text-[25px] text-mint-dark transition duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-mint group-hover:text-white">
                <FaAndroid />
              </div>
              <h3 className="mb-2 text-[22px] font-bold text-navy">Android</h3>
              <p className="mb-5 text-[13px] leading-[1.65] text-muted landing-sm:min-h-16">
                Descarga Salud Móvil para Android y lleva tus herramientas de
                seguimiento de salud siempre contigo.
              </p>
              <Button href="/public/salud_movil.apk" download>
                Descargar para Android
                <Download
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </Button>
            </article>
          </FadeInOnScroll>

          <FadeInOnScroll direction="right" delay={260} className="flex">
            <article className="group flex-1 rounded-3xl border border-transparent bg-[linear-gradient(145deg,var(--color-navy),var(--color-navy-2))] p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-strong">
              <div className="mb-5 grid h-13.5 w-13.5 place-items-center rounded-[18px] bg-white/10 text-[25px] text-mint-light transition duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <FaApple />
              </div>
              <h3 className="mb-2 text-[22px] font-bold text-white">iOS</h3>
              <p className="mb-5 text-[13px] leading-[1.65] text-[#c2d1d8] landing-sm:min-h-16">
                Estamos preparando la experiencia de Salud Móvil para iPhone.
              </p>
              <span className="inline-flex items-center gap-2.5 rounded-full bg-mint/12 px-3.5 py-2.5 text-[11px] font-[850] text-mint-light">
                <span className="relative grid h-1.75 w-1.75 place-items-center">
                  <span className="absolute inset-0 animate-ping-soft rounded-full bg-mint" />
                  <span className="relative h-full w-full rounded-full bg-mint" />
                </span>
                Disponible pronto
              </span>
            </article>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}

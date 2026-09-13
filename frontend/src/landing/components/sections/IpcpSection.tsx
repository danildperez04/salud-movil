import { Badge } from '../ui/Badge';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { MiniPhone } from '../ui/MiniPhone';

export function IpcpSection() {
  return (
    <section id='prioridad' className='bg-white py-[78px] landing-sm:py-[110px]'>
      <div className='container-x grid grid-cols-1 items-center gap-[70px] landing-md:grid-cols-2'>
        <FadeInOnScroll className='relative grid min-h-[480px] place-items-center landing-sm:min-h-[560px] landing-md:min-h-[600px]'>
          <MiniPhone
            src='/assets/mockups/ipcp-1.webp'
            alt='Pantalla Mi prioridad IPCP'
            className='rotate-[-5deg] landing-sm:-ml-[70px] landing-md:-ml-[120px]'
          />
          <MiniPhone
            src='/assets/mockups/ipcp-2.webp'
            alt='Indicadores de salud'
            className='absolute bottom-[10px] right-[5px] rotate-[7deg] landing-sm:right-[40px]'
          />
        </FadeInOnScroll>

        <FadeInOnScroll>
          <Badge>IPCP · Mi prioridad</Badge>
          <h2 className='my-[14px] mb-[18px] text-[clamp(36px,4.2vw,56px)] leading-[1.03] tracking-[-2px] text-navy'>
            Una guía para saber cuándo prestar más atención.
          </h2>
          <p className='text-[15px] leading-[1.7] text-muted'>
            “Mi prioridad” reúne información ingresada por el usuario para
            mostrar un nivel de prioridad visual y ofrecer orientación sobre el
            siguiente paso.
          </p>
          <p className='text-[15px] leading-[1.7] text-muted'>
            Además, Salud Móvil presenta indicadores con rangos fáciles de
            interpretar y acceso al historial de mediciones.
          </p>
          <div className='mt-[22px] rounded-[18px] border border-[#d8eee8] bg-mint-soft-2 p-[16px_18px] text-xs leading-[1.6] text-[#5e7581]'>
            <strong className='text-navy'>Importante:</strong> Salud Móvil es
            una herramienta de apoyo y organización. No sustituye la evaluación,
            el diagnóstico ni la atención de un profesional de la salud.
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
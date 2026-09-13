import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';

export function DownloadAppSection() {
  return (
    <section
      id='descargar'
      className='py-[78px] bg-[linear-gradient(180deg,#ffffff_0%,var(--color-mint-soft-2)_100%)] landing-sm:py-[110px]'
    >
      <div className='container-x grid grid-cols-1 items-center gap-16 landing-md:grid-cols-[0.92fr_1.08fr]'>
        <FadeInOnScroll>
          <Badge>Lleva Salud Móvil contigo</Badge>
          <h2 className='my-[14px] mb-[18px] text-[clamp(38px,4.8vw,62px)] leading-[1.02] tracking-[-2px] text-navy'>
            Tu salud, también desde tu celular.
          </h2>
          <p className='max-w-[620px] text-[16px] leading-[1.7] text-muted'>
            Accede a tus citas, medicamentos, indicadores y expediente desde
            Salud Móvil. La versión para Android podrá descargarse directamente,
            mientras que la versión para iOS estará disponible próximamente.
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll className='grid grid-cols-1 gap-4 landing-sm:grid-cols-2'>
          <article className='rounded-3xl border border-line bg-white p-[26px] shadow-soft'>
            <div className='mb-5 grid h-[54px] w-[54px] place-items-center rounded-[18px] bg-mint-soft text-[25px] font-bold text-mint-dark'>
              A
            </div>
            <h3 className='mb-2 text-[22px] font-bold text-navy'>Android</h3>
            <p className='min-h-[64px] text-[13px] leading-[1.65] text-muted'>
              Descarga Salud Móvil para Android y lleva tus herramientas de
              seguimiento de salud siempre contigo.
            </p>
            <Button href='/SaludMovil.apk' className='mt-4' download>
              Descargar para Android ↓
            </Button>
            <p className='mt-[14px] text-[11px] text-muted'>
              El botón quedará activo cuando agregues el archivo{' '}
              <strong>SaludMovil.apk</strong> a la misma carpeta del sitio.
            </p>
          </article>

          <article className='rounded-3xl border border-transparent bg-[linear-gradient(145deg,var(--color-navy),var(--color-navy-2))] p-[26px]'>
            <div className='mb-5 grid h-[54px] w-[54px] place-items-center rounded-[18px] bg-[rgba(255,255,255,0.1)] text-[25px] text-mint-light'>
              
            </div>
            <h3 className='mb-2 text-[22px] font-bold text-white'>iOS</h3>
            <p className='min-h-[64px] text-[13px] leading-[1.65] text-[#c2d1d8]'>
              Estamos preparando la experiencia de Salud Móvil para iPhone.
            </p>
            <span className='mt-3 inline-flex items-center gap-2 rounded-full bg-mint/12 px-3 py-[10px] text-[11px] font-[850] text-mint-light'>
              ● Disponible pronto
            </span>
          </article>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
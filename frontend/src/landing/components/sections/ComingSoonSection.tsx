import { FadeInOnScroll } from '../ui/FadeInOnScroll';

export function ComingSoonSection() {
  return (
    <section
      id='proximamente'
      className='py-[72px] pb-[86px] bg-[linear-gradient(180deg,#ffffff_0%,#f4fbf9_100%)]'
    >
      <div className='container-x'>
        <FadeInOnScroll className='rounded-[30px] border border-[#d8eee8] bg-[linear-gradient(145deg,#ffffff,#ecf8f5)] px-7 py-[54px] text-center shadow-[0_18px_50px_rgba(23,52,71,0.1)]'>
          <span className='inline-flex items-center gap-2 rounded-full bg-mint-soft px-3 py-2 text-xs font-[850] tracking-[0.02em] text-mint-dark'>
            <span className='h-[7px] w-[7px] rounded-full bg-mint' />
            Salud Móvil
          </span>
          <h2 className='my-[14px] mb-[10px] text-[clamp(40px,5vw,68px)] leading-none tracking-[-2px] text-navy'>
            Próximamente...
          </h2>
          <p className='mx-auto max-w-[620px] text-[16px] leading-[1.7] text-muted'>
            Estamos preparando la experiencia para que Salud Móvil esté cada vez
            más cerca de ti.
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
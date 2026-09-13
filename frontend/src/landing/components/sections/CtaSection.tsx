import { Button } from '../ui/Button';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';

export function CtaSection() {
  return (
    <section className='relative overflow-hidden bg-navy py-[95px]'>
      <div
        aria-hidden='true'
        className='absolute -right-[120px] -top-[170px] h-[480px] w-[480px] rounded-full bg-mint/13'
      />
      <div
        aria-hidden='true'
        className='absolute -bottom-[130px] -left-[80px] h-[300px] w-[300px] rounded-full border border-dashed border-[rgba(255,255,255,0.16)]'
      />
      <FadeInOnScroll className='container-x relative z-[2] mx-auto max-w-[800px] text-center'>
        <span className='inline-flex items-center gap-2 rounded-full bg-mint/13 px-3 py-2 text-xs font-[850] tracking-[0.02em] text-mint-light'>
          <span className='h-[7px] w-[7px] rounded-full bg-mint' />
          Salud Móvil
        </span>
        <h2 className='my-[13px] mb-[18px] text-[clamp(38px,5vw,64px)] leading-none tracking-[-2.3px] text-white'>
          ¿Y si tu salud estuviera siempre contigo?
        </h2>
        <p className='mx-auto mb-7 max-w-[650px] text-[16px] leading-[1.7] text-[#bfd0d9]'>
          Menos información dispersa. Más claridad para organizar tus citas,
          medicamentos, indicadores y expediente.
        </p>
        <Button href='#inicio'>Tu salud, en tus manos →</Button>
      </FadeInOnScroll>
    </section>
  );
}
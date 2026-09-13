import { Badge } from '../ui/Badge';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { steps } from '../../data/content';

export function HowItWorksSection() {
  return (
    <section
      id='como-funciona'
      className='py-[78px] bg-[linear-gradient(180deg,#f7fbfa,#fff)] landing-sm:py-[110px]'
    >
      <div className='container-x'>
        <FadeInOnScroll className='mx-auto mb-[54px] max-w-[760px] text-center'>
          <Badge>Simple desde el primer día</Badge>
          <h2 className='my-[14px] mb-4 text-[clamp(32px,4vw,54px)] leading-[1.04] tracking-[-1.8px] text-navy'>
            Tu salud organizada en tres pasos.
          </h2>
          <p className='mx-auto max-w-[700px] text-[17px] leading-[1.65] text-muted'>
            Diseñada para reducir fricción y hacer que la información importante
            sea más fácil de consultar.
          </p>
        </FadeInOnScroll>

        <div className='grid grid-cols-1 gap-[22px] landing-md:grid-cols-3'>
          {steps.map((step) => (
            <FadeInOnScroll
              key={step.num}
              className='steps-connector rounded-3xl border border-line bg-white p-7'
            >
              <div className='mb-10 text-[12px] font-black tracking-[0.12em] text-mint-dark'>
                {step.num}
              </div>
              <h3 className='mb-[9px] text-[21px] font-bold text-navy'>
                {step.title}
              </h3>
              <p className='m-0 text-[13px] leading-[1.7] text-muted'>
                {step.text}
              </p>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
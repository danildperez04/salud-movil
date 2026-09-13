import { useState } from 'react';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { MiniPhone } from '../ui/MiniPhone';
import {
  showcaseTabs,
  showcaseScreens,
  type ShowcaseTabKey,
} from '../../data/content';

export function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState<ShowcaseTabKey>('citas');
  const screen = showcaseScreens[activeTab];

  return (
    <section id='descubre' className='bg-white py-[78px] landing-sm:py-[110px]'>
      <div className='container-x'>
        <FadeInOnScroll className='overflow-hidden rounded-[25px] bg-[linear-gradient(145deg,#173447,#244c60)] p-[18px] shadow-strong landing-sm:rounded-[34px] landing-sm:p-7'>
          <div className='mb-6 flex flex-col items-start justify-between gap-5 landing-md:flex-row landing-md:items-center'>
            <h2 className='m-0 text-[27px] tracking-[-1px] text-white landing-sm:text-[33px]'>
              Conoce Salud Móvil por dentro.
            </h2>
            <p className='m-0 max-w-[520px] text-[13px] leading-[1.6] text-[#b9ccd6]'>
              Pantallas reales del prototipo v7. Explora las funciones
              principales que acompañan el día a día del usuario.
            </p>
          </div>

          <div className='mb-6 flex flex-wrap gap-2'>
            {showcaseTabs.map((tab) => (
              <button
                key={tab.key}
                className={`cursor-pointer rounded-full border px-[13px] py-[10px] font-body text-[11px] font-extrabold ${
                  activeTab === tab.key
                    ? 'border-mint bg-mint text-white'
                    : 'border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.06)] text-[#c7d7df]'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className='grid grid-cols-1 items-center gap-[26px] landing-md:min-h-[550px] landing-md:grid-cols-[0.9fr_1.1fr]'>
            <div className='p-[10px] landing-md:p-[34px]'>
              <span className='text-[12px] font-black tracking-[0.1em] text-[#78d9c3]'>
                {screen.num}
              </span>
              <h3 className='my-3 text-[34px] leading-[1.04] tracking-[-1.4px] text-white landing-sm:text-[42px]'>
                {screen.title}
              </h3>
              <p className='max-w-[470px] text-[14px] leading-[1.7] text-[#b9ccd6]'>
                {screen.text}
              </p>
              <div className='mt-6 grid gap-[10px]'>
                {screen.list.map((item) => (
                  <div
                    key={item}
                    className='flex items-start gap-[10px] text-[12px] text-[#dfe8ec]'
                  >
                    <i className='grid h-[19px] w-[19px] flex-none place-items-center rounded-full bg-[rgba(53,191,166,0.18)] text-mint-light not-italic'>
                      ✓
                    </i>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className='relative flex min-h-[430px] items-end justify-center [--mini-phone-width:190px] [--mini-phone-secondary-width:155px] landing-sm:min-h-[500px] landing-sm:[--mini-phone-width:230px] landing-sm:[--mini-phone-secondary-width:190px]'>
              <MiniPhone src={screen.main} alt={`Pantalla de ${activeTab}`} />
              <MiniPhone
                src={screen.secondary}
                alt='Pantalla secundaria'
                secondary
                className='absolute bottom-0 right-0 rotate-[5deg] landing-sm:right-[3%]'
              />
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
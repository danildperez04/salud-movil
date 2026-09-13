import { Badge } from '../ui/Badge';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { values, teamMembers } from '../../data/content';

export function AboutTeamSection() {
  return (
    <section
      id='sobre-nosotros'
      className='bg-white py-[78px] landing-sm:py-[110px]'
    >
      <div className='container-x grid grid-cols-1 items-start gap-16 landing-md:grid-cols-[0.95fr_1.05fr]'>
        <FadeInOnScroll>
          <Badge>Sobre nosotros</Badge>
          <h2 className='my-[14px] mb-[18px] text-[clamp(38px,4.8vw,62px)] leading-[1.02] tracking-[-2px] text-navy'>
            Somos Rubber Duckies, el equipo detrás de Salud Móvil.
          </h2>
          <p className='max-w-[650px] text-[15px] leading-[1.75] text-muted'>
            Salud Móvil nace del trabajo de un equipo de cinco integrantes que
            combina tecnología, diseño, investigación y compromiso con una
            experiencia de salud más sencilla para las personas, sus familias y
            cuidadores.
          </p>
          <p className='max-w-[650px] text-[15px] leading-[1.75] text-muted'>
            Nuestro objetivo es crear una herramienta que ayude a organizar
            información de salud, facilitar el seguimiento y acercar la
            tecnología a quienes necesitan una experiencia más clara, accesible
            e inclusiva.
          </p>

          <span className='mt-2 inline-flex items-center rounded-full border border-mint-line bg-mint-soft-2 px-[13px] py-[9px] text-xs font-black tracking-[0.03em] text-mint-dark'>
            RUBBER DUCKIES
          </span>

          <div className='mt-[26px] grid grid-cols-1 gap-3 landing-sm:grid-cols-2'>
            {values.map((value) => (
              <div
                key={value.title}
                className='rounded-[18px] border border-mint-line bg-mint-soft-2 p-[18px]'
              >
                <strong className='mb-[5px] block text-[13px] font-bold text-navy'>
                  {value.title}
                </strong>
                <span className='text-[11px] leading-[1.55] text-muted'>
                  {value.text}
                </span>
              </div>
            ))}
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll className='grid grid-cols-1 gap-[14px] landing-sm:grid-cols-2'>
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className='rounded-[22px] border border-line bg-white p-[22px] shadow-soft'
            >
              <div className='mb-4 grid aspect-[4/3] w-full place-items-center rounded-[18px] border-[1.5px] border-dashed border-mint-line-strong bg-[linear-gradient(145deg,var(--color-mint-soft-2),var(--color-mint-soft))] p-4 text-center text-[11px] font-[850] text-mint-dark'>
                {member.photoLabel}
              </div>
              <span className='mb-3 inline-flex items-center rounded-full bg-mint-soft px-[10px] py-[7px] text-[10px] font-black uppercase tracking-[0.04em] text-mint-dark'>
                {member.duck}
              </span>
              <h3 className='mb-[5px] text-[18px] font-bold text-navy'>
                {member.name}
              </h3>
              <div className='mb-3 text-[11px] font-extrabold leading-[1.55] text-navy'>
                {member.role}
              </div>
              <p className='m-0 text-[11px] leading-[1.6] text-muted'>
                {member.bio}
              </p>
            </article>
          ))}

          <article className='rounded-[22px] border border-line bg-[linear-gradient(145deg,#ffffff,var(--color-mint-soft-2))] p-[22px] shadow-soft'>
            <div className='mb-4 grid aspect-[4/3] w-full place-items-center rounded-[18px] border-[1.5px] border-dashed border-mint-line-strong bg-[linear-gradient(145deg,var(--color-mint-soft),#f8fcfb)] p-4 text-center text-[11px] font-[850] text-mint-dark'>
              Espacio para foto grupal de Rubber Duckies
            </div>
            <span className='mb-3 inline-flex items-center rounded-full bg-mint-soft px-[10px] py-[7px] text-[10px] font-black uppercase tracking-[0.04em] text-mint-dark'>
              Rubber Duckies
            </span>
            <h3 className='mb-[5px] text-[18px] font-bold text-navy'>
              Nuestro equipo
            </h3>
            <p className='m-0 text-[11px] leading-[1.6] text-muted'>
              Espacio reservado para una fotografía grupal de los cinco
              integrantes de Rubber Duckies.
            </p>
          </article>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
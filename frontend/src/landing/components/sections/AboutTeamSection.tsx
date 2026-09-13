import { FaTiktok } from "react-icons/fa6";
import { Badge } from "../ui/Badge";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import {
  values,
  teamMembers,
  teamGroupPhoto,
  hackathonMemory,
  socialLinks,
} from "../../data/content";
import { SOCIAL_ICONS } from "../../data/socialIcons";

export function AboutTeamSection() {
  const tiktok = socialLinks.find((social) => social.icon === "tiktok");
  const iconSocials = socialLinks.filter((social) => social.icon !== "tiktok");

  return (
    <section
      id="sobre-nosotros"
      className="bg-white py-19.5 landing-sm:py-27.5"
    >
      <div className="container-x grid grid-cols-1 items-start gap-16 landing-md:grid-cols-[0.95fr_1.05fr]">
        <FadeInOnScroll>
          <Badge>Sobre nosotros</Badge>
          <h2 className="my-3.5 mb-4.5 text-[clamp(38px,4.8vw,62px)] leading-[1.02] tracking-[-2px] text-navy">
            Somos Rubber Duckies, el equipo detrás de Salud Móvil.
          </h2>
          <p className="max-w-162.5 text-[15px] leading-[1.75] text-muted">
            Salud Móvil nace del trabajo de un equipo de cinco integrantes que
            combina tecnología, diseño, investigación y compromiso con una
            experiencia de salud más sencilla para las personas, sus familias y
            cuidadores.
          </p>
          <p className="max-w-162.5 text-[15px] leading-[1.75] text-muted">
            Nuestro objetivo es crear una herramienta que ayude a organizar
            información de salud, facilitar el seguimiento y acercar la
            tecnología a quienes necesitan una experiencia más clara, accesible
            e inclusiva.
          </p>

          <div className="mt-6.5 grid grid-cols-1 gap-3 landing-sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-[18px] border border-mint-line bg-mint-soft-2 p-4.5"
              >
                <strong className="mb-1.25 block text-[13px] font-bold text-navy">
                  {value.title}
                </strong>
                <span className="text-[11px] leading-[1.55] text-muted">
                  {value.text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-7 border-t border-line pt-6">
            <span className="mb-3.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
              Conecta con nosotros
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {iconSocials.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid h-11 w-11 place-items-center rounded-full bg-mint-soft text-lg text-mint-dark transition-colors duration-200 hover:bg-mint hover:text-white"
                  >
                    <Icon />
                  </a>
                );
              })}

              {tiktok && (
                <a
                  href={tiktok.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[13px] font-medium text-navy transition-colors duration-200 hover:border-mint hover:text-mint-dark"
                >
                  <FaTiktok />
                  Síguenos en TikTok
                </a>
              )}
            </div>
          </div>

          {/* Foto grupal: reubicada debajo de "Conecta con nosotros",
              como tarjeta única en la columna izquierda. */}
          <article className="mt-7 overflow-hidden rounded-[22px] border border-line bg-[linear-gradient(145deg,#ffffff,var(--color-mint-soft-2))] shadow-soft">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={teamGroupPhoto.photo}
                alt={`Foto grupal de ${teamGroupPhoto.title}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-5.5">
              <span className="mb-3 inline-flex items-center rounded-full bg-mint-soft px-2.5 py-1.75 text-[10px] font-black uppercase tracking-[0.04em] text-mint-dark">
                {teamGroupPhoto.title}
              </span>
              <p className="m-0 text-[11px] leading-[1.6] text-muted">
                {teamGroupPhoto.description}
              </p>
            </div>
          </article>
        </FadeInOnScroll>

        <FadeInOnScroll className="grid grid-cols-1 items-stretch gap-3.5 landing-sm:grid-cols-2">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="flex h-full flex-col rounded-[22px] border border-line bg-white p-5.5 shadow-soft"
            >
              <div className="mb-4 aspect-4/3 w-full overflow-hidden rounded-[18px] border-[1.5px] border-mint-line-strong bg-mint-soft-2">
                <img
                  src={member.photo}
                  alt={`Foto de ${member.name}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="mb-3 inline-flex items-center self-start rounded-full bg-mint-soft px-2.5 py-1.75 text-[10px] font-black uppercase tracking-[0.04em] text-mint-dark">
                {member.duck}
              </span>
              <h3 className="mb-1.25 text-[18px] font-bold text-navy">
                {member.name}
              </h3>
              <div className="mb-3 text-[11px] font-extrabold leading-[1.55] text-navy">
                {member.role}
              </div>
              <p className="m-0 text-[11px] leading-[1.6] text-muted">
                {member.bio}
              </p>

              {/* mt-auto empuja los íconos al fondo de la tarjeta, así
                  todas las filas del grid quedan alineadas por abajo sin
                  importar si el bio es más corto o más largo. */}
              {member.socials.length > 0 && (
                <div className="mt-auto flex items-center gap-2 pt-3.5">
                  {member.socials.map((social) => {
                    const Icon = SOCIAL_ICONS[social.icon];
                    return (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="grid h-8 w-8 place-items-center rounded-full bg-mint-soft text-sm text-mint-dark transition-colors duration-200 hover:bg-mint hover:text-white"
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              )}
            </article>
          ))}

          {/* Recuerdo del Hackathon Disruptivo 2025, junto a Julio Reyes
              para cerrar el grid en pares parejos (3 filas x 2 columnas). */}
          <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-[linear-gradient(145deg,#ffffff,var(--color-mint-soft-2))] shadow-soft">
            <div className="aspect-4/3 w-full overflow-hidden">
              <img
                src={hackathonMemory.photo}
                alt={hackathonMemory.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col p-5.5">
              <span className="mb-3 inline-flex items-center self-start rounded-full bg-mint-soft px-2.5 py-1.75 text-[10px] font-black uppercase tracking-[0.04em] text-mint-dark">
                {hackathonMemory.badge}
              </span>
              <h3 className="mb-1.25 text-[18px] font-bold text-navy">
                {hackathonMemory.title}
              </h3>
              <p className="m-0 text-[11px] leading-[1.6] text-muted">
                {hackathonMemory.description}
              </p>
            </div>
          </article>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

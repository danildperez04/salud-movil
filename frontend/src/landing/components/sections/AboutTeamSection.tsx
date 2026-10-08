import { FaTiktok } from "react-icons/fa6";
import { PhotoCard } from "../cards/PhotoCard";
import { TeamMemberCard } from "../cards/TeamMemberCard";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { IconTile } from "../ui/IconTile";
import { SectionHeader } from "../ui/SectionHeader";
import { ICONS, SOCIAL_ICONS } from "../../data/icons";
import { socialLinks } from "../../data/social";
import {
  values,
  teamMembers,
  teamGroupPhoto,
  hackathonMemory,
} from "../../data/team";

export function AboutTeamSection() {
  const tiktok = socialLinks.find((social) => social.icon === "tiktok");
  const iconSocials = socialLinks.filter((social) => social.icon !== "tiktok");

  return (
    <section
      id="sobre-nosotros"
      className="bg-white py-19.5 landing-sm:py-27.5"
    >
      <div className="container-x grid grid-cols-1 items-start gap-14 landing-md:grid-cols-[0.95fr_1.05fr] landing-md:gap-16">
        <div>
          <SectionHeader
            align="left"
            badge="Sobre nosotros"
            title="Somos Rubber Duckies, el equipo detrás de Salud Móvil."
          />

          <FadeInOnScroll delay={180} className="mt-4 flex flex-col gap-4">
            <p className="m-0 max-w-162.5 text-[15px] leading-[1.75] text-muted">
              Salud Móvil nace del trabajo de un equipo de cinco integrantes que
              combina tecnología, diseño, investigación y compromiso con una
              experiencia de salud más sencilla para las personas, sus familias
              y cuidadores.
            </p>
            <p className="m-0 max-w-162.5 text-[15px] leading-[1.75] text-muted">
              Nuestro objetivo es crear una herramienta que ayude a organizar
              información de salud, facilitar el seguimiento y acercar la
              tecnología a quienes necesitan una experiencia más clara,
              accesible e inclusiva.
            </p>
          </FadeInOnScroll>

          <div className="mt-6.5 grid grid-cols-1 gap-3 landing-sm:grid-cols-2">
            {values.map((value, index) => (
              <FadeInOnScroll
                key={value.title}
                delay={index * 90}
                className="flex"
              >
                <div className="group flex-1 rounded-[18px] border border-mint-line bg-mint-soft-2 p-4 transition duration-300 hover:-translate-y-1 hover:border-mint-line-strong hover:bg-white hover:shadow-soft">
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <IconTile icon={ICONS[value.icon]} size="sm" />
                    <strong className="text-[13px] font-bold text-navy">
                      {value.title}
                    </strong>
                  </div>
                  <span className="block text-[11px] leading-[1.55] text-muted">
                    {value.text}
                  </span>
                </div>
              </FadeInOnScroll>
            ))}
          </div>

          <FadeInOnScroll className="mt-7 border-t border-line pt-6">
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
                    className="grid h-11 w-11 place-items-center rounded-full bg-mint-soft text-lg text-mint-dark transition duration-200 hover:-translate-y-0.5 hover:bg-mint hover:text-white hover:shadow-brand"
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
                  className="flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[13px] font-medium text-navy transition duration-200 hover:-translate-y-0.5 hover:border-mint hover:text-mint-dark"
                >
                  <FaTiktok />
                  Síguenos en TikTok
                </a>
              )}
            </div>
          </FadeInOnScroll>

          {/* Foto grupal: debajo de "Conecta con nosotros", como tarjeta única
              en la columna izquierda. */}
          <FadeInOnScroll className="mt-7 flex flex-col">
            <PhotoCard
              photo={teamGroupPhoto.photo}
              alt={`Foto grupal de ${teamGroupPhoto.title}`}
              badge={teamGroupPhoto.title}
              description={teamGroupPhoto.description}
              aspect="video"
            />
          </FadeInOnScroll>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-3.5 landing-sm:grid-cols-2">
          {teamMembers.map((member, index) => (
            <FadeInOnScroll
              key={member.name}
              delay={(index % 2) * 120}
              className="flex"
            >
              <TeamMemberCard member={member} />
            </FadeInOnScroll>
          ))}

          {/* Recuerdo del Hackathon Disruptivo 2025, junto a Julio Reyes para
              cerrar el grid en pares parejos (3 filas x 2 columnas). */}
          <FadeInOnScroll
            delay={(teamMembers.length % 2) * 120}
            className="flex flex-col"
          >
            <PhotoCard
              photo={hackathonMemory.photo}
              alt={hackathonMemory.title}
              badge={hackathonMemory.badge}
              title={hackathonMemory.title}
              description={hackathonMemory.description}
              className="flex-1"
            />
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}

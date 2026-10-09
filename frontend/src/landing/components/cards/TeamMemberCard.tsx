import { SOCIAL_ICONS } from "../../data/icons";
import type { TeamMember } from "../../data/team";

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="group flex flex-1 flex-col rounded-[22px] border border-line bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-mint-line-strong hover:shadow-strong">
      <div className="mb-4 aspect-4/3 w-full overflow-hidden rounded-[18px] border-[1.5px] border-mint-line-strong bg-mint-soft-2">
        <img
          src={member.photo}
          alt={`Foto de ${member.name}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <span className="mb-3 inline-flex items-center self-start rounded-full bg-mint-soft px-2.5 py-1.75 text-[12px] font-black uppercase tracking-[0.04em] text-mint-dark">
        {member.duck}
      </span>
      <h3 className="mb-1.25 text-[21px] font-bold text-navy">{member.name}</h3>
      <div className="mb-3 text-[13px] font-extrabold leading-[1.55] text-navy">
        {member.role}
      </div>
      <p className="m-0 text-[13px] leading-[1.6] text-muted">{member.bio}</p>

      {/* mt-auto empuja los íconos al fondo de la tarjeta, así todas las filas
          del grid quedan alineadas por abajo sin importar si el bio es más
          corto o más largo. */}
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
                className="grid h-8 w-8 place-items-center rounded-full bg-mint-soft text-[16px] text-mint-dark transition duration-200 hover:-translate-y-0.5 hover:bg-mint hover:text-white"
              >
                <Icon />
              </a>
            );
          })}
        </div>
      )}
    </article>
  );
}

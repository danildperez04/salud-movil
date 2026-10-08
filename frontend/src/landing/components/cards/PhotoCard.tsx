type PhotoCardProps = {
  photo: string;
  alt: string;
  badge: string;
  title?: string;
  description: string;
  /** Proporción de la foto. La del grupo es panorámica; la del recuerdo, 4/3. */
  aspect?: "video" | "4/3";
  className?: string;
};

// Tarjeta con foto arriba y texto abajo. La usan la foto del grupo y el
// recuerdo del hackathon, que antes duplicaban casi el mismo marcado.
export function PhotoCard({
  photo,
  alt,
  badge,
  title,
  description,
  aspect = "4/3",
  className = "",
}: PhotoCardProps) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-[22px] border border-line bg-[linear-gradient(145deg,#ffffff,var(--color-mint-soft-2))] shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-mint-line-strong hover:shadow-strong ${className}`}
    >
      <div
        className={`w-full overflow-hidden ${aspect === "video" ? "aspect-video" : "aspect-4/3"}`}
      >
        <img
          src={photo}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-3 inline-flex items-center self-start rounded-full bg-mint-soft px-2.5 py-1.75 text-[10px] font-black uppercase tracking-[0.04em] text-mint-dark">
          {badge}
        </span>
        {title && (
          <h3 className="mb-1.25 text-[18px] font-bold text-navy">{title}</h3>
        )}
        <p className="m-0 text-[11px] leading-[1.6] text-muted">{description}</p>
      </div>
    </article>
  );
}

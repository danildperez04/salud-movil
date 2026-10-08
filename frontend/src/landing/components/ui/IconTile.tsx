import type { LucideIcon } from "lucide-react";

type IconTileProps = {
  icon: LucideIcon;
  tone?: "soft" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
};

// Los estados `group-hover` responden al hover del padre: pon `group` en la
// tarjeta que contiene el icono.
const TONES = {
  soft: "bg-mint-soft text-mint-dark group-hover:bg-mint group-hover:text-white",
  dark: "bg-white/12 text-mint-light group-hover:bg-mint group-hover:text-white",
};

const SIZES = {
  sm: { box: "h-9 w-9", icon: 17 },
  md: { box: "h-11 w-11", icon: 20 },
  lg: { box: "h-12 w-12", icon: 22 },
};

export function IconTile({
  icon: Icon,
  tone = "soft",
  size = "md",
  className = "",
}: IconTileProps) {
  const { box, icon } = SIZES[size];

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full transition duration-300 group-hover:-rotate-6 group-hover:scale-110 ${box} ${TONES[tone]} ${className}`}
    >
      <Icon size={icon} strokeWidth={2} aria-hidden="true" />
    </span>
  );
}

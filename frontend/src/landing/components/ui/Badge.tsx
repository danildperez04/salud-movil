import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

const TONES = {
  light: { pill: "bg-mint-soft text-mint-dark", dot: "bg-mint" },
  dark: { pill: "bg-mint/13 text-mint-light", dot: "bg-mint" },
};

export function Badge({ children, tone = "light", className = "" }: BadgeProps) {
  const { pill, dot } = TONES[tone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[14px] font-[850] tracking-[0.02em] ${pill} ${className}`}
    >
      {/* Punto con pulso: marca el badge como "vivo" sin distraer del texto */}
      <span className="relative grid h-1.75 w-1.75 place-items-center">
        <span
          className={`absolute inset-0 animate-ping-soft rounded-full ${dot}`}
        />
        <span className={`relative h-full w-full rounded-full ${dot}`} />
      </span>
      {children}
    </span>
  );
}

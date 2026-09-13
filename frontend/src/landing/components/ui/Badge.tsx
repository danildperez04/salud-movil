import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-mint-soft px-3 py-2 text-xs font-[850] tracking-[0.02em] text-mint-dark ${className}`}
    >
      <span className="h-1.75 w-1.75 rounded-full bg-mint" />
      {children}
    </span>
  );
}

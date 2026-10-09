import { Check } from "lucide-react";

type CheckBadgeProps = {
  tone?: "light" | "dark";
  className?: string;
};

const TONES = {
  light: "bg-mint-soft text-mint-dark",
  dark: "bg-mint/18 text-mint-light",
};

export function CheckBadge({ tone = "light", className = "" }: CheckBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-5.5 w-5.5 flex-none place-items-center rounded-full ${TONES[tone]} ${className}`}
    >
      <Check size={13} strokeWidth={3.2} />
    </span>
  );
}

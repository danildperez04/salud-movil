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
      className={`grid h-4.75 w-4.75 flex-none place-items-center rounded-full ${TONES[tone]} ${className}`}
    >
      <Check size={11} strokeWidth={3.2} />
    </span>
  );
}

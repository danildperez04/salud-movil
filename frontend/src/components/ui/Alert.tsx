import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

type AlertVariant = "error" | "success";

const styles: Record<AlertVariant, string> = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-mint-line bg-mint-soft text-primary-dark",
};

const icons: Record<AlertVariant, typeof AlertTriangle> = {
  error: AlertTriangle,
  success: CheckCircle2,
};

export function Alert({
  variant = "error",
  children,
}: {
  variant?: AlertVariant;
  children: ReactNode;
}) {
  const Icon = icons[variant];
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-lg border px-4 py-3 font-body text-sm ${styles[variant]}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { getButtonClassName } from "./buttonStyles";
import type { ButtonVariant } from "./buttonStyles";

// Re-exportado solo como tipo: no dispara react-refresh/only-export-components
// (esa regla solo mira exports en tiempo de ejecución, y los tipos se borran
// al compilar). Así el resto del código puede seguir escribiendo
// `import type { ButtonVariant } from ".../ui/Button"` sin romperse.
export type { ButtonVariant };

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({
  children,
  loading,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClassName(variant, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}

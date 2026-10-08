import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  download?: boolean;
  /** Abre el enlace en una pestaña nueva. */
  external?: boolean;
  children: ReactNode;
};

const baseClasses =
  "group relative inline-flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-[14px] px-5 py-3.5 font-body font-[850] transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint";

const variantClasses: Record<"primary" | "secondary", string> = {
  // El `before:` es un destello que cruza el botón al pasar el cursor.
  primary:
    "bg-mint text-white shadow-brand before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:-skew-x-20 before:bg-white/25 before:transition-all before:duration-700 hover:-translate-y-0.5 hover:bg-mint-dark hover:before:left-[130%] active:translate-y-0",
  secondary:
    "border border-line bg-white text-navy hover:-translate-y-0.5 hover:border-mint-line-strong hover:bg-mint-soft-2 active:translate-y-0",
};

export function Button({
  href,
  onClick,
  variant = "primary",
  className = "",
  download = false,
  external = false,
  children,
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  const content = (
    <span className="relative inline-flex items-center justify-center gap-2.5">
      {children}
    </span>
  );

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {content}
    </button>
  );
}

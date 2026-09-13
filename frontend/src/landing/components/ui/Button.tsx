import type { ReactNode } from 'react';

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  download?: boolean;
  children: ReactNode;
};

const baseClasses =
  'inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-[14px] px-5 py-[14px] font-body font-[850] transition duration-200';

const variantClasses: Record<'primary' | 'secondary', string> = {
  primary:
    'bg-mint text-white shadow-[0_10px_26px_rgba(53,191,166,0.23)] hover:-translate-y-0.5 hover:bg-mint-dark',
  secondary:
    'border border-line bg-white text-navy hover:border-[#caede4] hover:bg-mint-soft-2',
};

export function Button({
  href,
  onClick,
  variant = 'primary',
  className = '',
  download = false,
  children,
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a className={classes} href={href} download={download || undefined}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
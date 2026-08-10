import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, actions, children, className = '' }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {title || actions ? (
        <header className='flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4'>
          {title ? (
            <h2 className='text-lg font-semibold text-slate-900'>{title}</h2>
          ) : (
            <span />
          )}
          {actions}
        </header>
      ) : null}
      <div className='p-5'>{children}</div>
    </section>
  );
}

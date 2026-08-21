import { useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, error, id, children, ...props }: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <div className='flex flex-col gap-1'>
      <label htmlFor={selectId} className='text-sm font-medium text-slate-700'>
        {label}
      </label>
      <select
        id={selectId}
        className='rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
        {...props}
      >
        {children}
      </select>
      {error ? <span className='text-sm text-red-600'>{error}</span> : null}
    </div>
  );
}

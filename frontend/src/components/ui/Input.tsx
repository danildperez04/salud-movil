import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className='flex flex-col gap-1'>
      <label htmlFor={inputId} className='text-sm font-medium text-slate-700'>
        {label}
      </label>
      <input
        id={inputId}
        className='rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
        {...props}
      />
      {error ? <span className='text-sm text-red-600'>{error}</span> : null}
    </div>
  );
}

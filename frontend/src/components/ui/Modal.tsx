import type { ReactNode } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ title, onClose, children, footer }: ModalProps) {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4'
      onClick={onClose}
    >
      <div
        className='max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl'
        onClick={(event) => event.stopPropagation()}
      >
        <header className='flex items-center justify-between border-b border-slate-200 px-5 py-4'>
          <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
          <CloseButton onClick={onClose} />
        </header>
        <div className='p-5'>{children}</div>
        {footer ? (
          <footer className='flex justify-end gap-3 border-t border-slate-200 px-5 py-4'>
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}

function CloseButton({ onClick }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      aria-label='Cerrar'
      className='rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
          clipRule='evenodd'
        />
      </svg>
    </button>
  );
}

import type { ReactNode } from 'react';

type AlertVariant = 'error' | 'success';

const styles: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export function Alert({
  variant = 'error',
  children,
}: {
  variant?: AlertVariant;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]}`}>
      {children}
    </div>
  );
}

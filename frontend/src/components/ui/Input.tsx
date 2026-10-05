import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Contenido opcional al lado derecho del label, ej. un link "¿Olvidaste tu contraseña?" */
  labelSlot?: ReactNode;
}

export function Input({
  label,
  error,
  labelSlot,
  id,
  className = "",
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="font-body text-sm font-medium text-text"
        >
          {label}
        </label>
        {labelSlot}
      </div>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`rounded-lg border px-3 py-2.5 font-body text-text placeholder:text-muted focus:outline-none focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : "border-line focus:border-primary focus:ring-primary/15"
        } ${className}`}
        {...props}
      />
      {error ? (
        <span id={errorId} className="text-sm text-red-600">
          {error}
        </span>
      ) : null}
    </div>
  );
}

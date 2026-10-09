import type { ChangeEvent } from "react";

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  /** Muestra el asterisco; la validación vive en el formulario. */
  required?: boolean;
  /** Si se indica, el campo es un `textarea` de ese número de filas. */
  rows?: number;
  autoComplete?: string;
  maxLength?: number;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

const inputClasses =
  "w-full rounded-[14px] border bg-white px-4 py-3 font-body text-[17px] text-navy placeholder:text-muted/70 transition duration-200 focus:outline-none focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60";

export function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  rows,
  autoComplete,
  maxLength,
  placeholder,
  error,
  disabled,
}: FieldProps) {
  const id = `demo-${name}`;
  const errorId = `${id}-error`;
  const common = {
    id,
    name,
    value,
    required,
    autoComplete,
    maxLength,
    placeholder,
    disabled,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    onChange: (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    className: `${inputClasses} ${
      error
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-line focus:border-mint focus:ring-mint/20"
    }`,
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[15px] font-[750] text-navy"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-mint-dark">
            *
          </span>
        )}
      </label>
      {rows ? (
        <textarea {...common} rows={rows} className={`${common.className} resize-y`} />
      ) : (
        <input {...common} type={type} />
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-[14px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

import { useRef, useEffect, useCallback } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (code: string) => void;
  onComplete?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: string;
}

export function OTPInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  error,
}: OTPInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([null, null, null, null, null, null]);

  const handleChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/\D/g, '').slice(0, 1);
      const newCode = value.split('');
      newCode[index] = newValue;
      onChange(newCode.join(''));

      if (newValue && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
      if (newCode.join('').length === 6) {
        onComplete?.();
      }
    },
    [value, onChange, onComplete],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowRight' && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [value],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      if (pasted.length === 6) {
        onChange(pasted);
        onComplete?.();
      }
    },
    [onChange, onComplete],
  );

  useEffect(() => {
    if (autoFocus) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus]);

  const baseInputClass =
    'w-12 h-12 text-center text-2xl font-mono tracking-widest rounded-lg border px-0 py-2.5 font-body text-text placeholder:text-muted focus:outline-none focus:ring-4 ' +
    (error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
      : 'border-line focus:border-primary focus:ring-primary/15') +
    (disabled ? ' bg-slate-50 cursor-not-allowed' : '');

  return (
    <div className="flex gap-2" role="group" aria-label="Código de verificación de 6 dígitos">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={baseInputClass}
          aria-label={`Dígito ${i + 1}`}
          aria-invalid={Boolean(error && i === value.length)}
        />
      ))}
      {error && (
        <span id="otp-error" className="sr-only">
          {error}
        </span>
      )}
    </div>
  );
}
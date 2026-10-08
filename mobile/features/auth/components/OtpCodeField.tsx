// features/auth/components/OtpCodeField.tsx
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FIELD_CLASS_NAME, FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { OTP_LENGTH, sanitizeOtpInput } from '../domain/otp-code';

type OtpCodeFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
  testID?: string;
  /** al completar los 6 dígitos desde el teclado (ej. enviar) */
  onSubmitEditing?: () => void;
};

/** Campo del código de 6 dígitos; el teclado numérico y el autocompletado de SMS vienen listos. */
export function OtpCodeField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  editable = true,
  autoFocus,
  testID,
  onSubmitEditing,
}: OtpCodeFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <FormField label={label} error={error?.message}>
          <Input
            testID={testID}
            className={cn(FIELD_CLASS_NAME, 'text-center text-2xl tracking-[8px]')}
            placeholder={placeholder}
            keyboardType="number-pad"
            inputMode="numeric"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={OTP_LENGTH}
            autoFocus={autoFocus}
            editable={editable}
            returnKeyType="done"
            value={(value as string | undefined) ?? ''}
            onChangeText={(text) => onChange(sanitizeOtpInput(text))}
            onBlur={onBlur}
            onSubmitEditing={onSubmitEditing}
          />
        </FormField>
      )}
    />
  );
}

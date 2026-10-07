// components/ui/controlled-fields.tsx
// Campos de formulario ya conectados a react-hook-form: etiqueta, control y
// mensaje de error en uno, para que cada pantalla solo declare qué campos tiene.
import type { KeyboardTypeOptions } from 'react-native';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FIELD_CLASS_NAME, FormField, TEXTAREA_CLASS_NAME } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { SelectField, type SelectOption } from '@/components/ui/select-field';

type BaseProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  className?: string;
};

type TextFormFieldProps<T extends FieldValues> = BaseProps<T> & {
  placeholder?: string;
  /** campo de varias líneas (notas, detalle) */
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
};

export function TextFormField<T extends FieldValues>({
  control,
  name,
  label,
  className,
  placeholder,
  multiline,
  keyboardType,
  maxLength,
}: TextFormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <FormField label={label} error={error?.message} className={className}>
          <Input
            className={multiline ? TEXTAREA_CLASS_NAME : FIELD_CLASS_NAME}
            placeholder={placeholder}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : undefined}
            keyboardType={keyboardType}
            maxLength={maxLength}
            value={(value as string | undefined) ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        </FormField>
      )}
    />
  );
}

type SelectFormFieldProps<T extends FieldValues, V extends string> = BaseProps<T> & {
  options: readonly SelectOption<V>[];
  placeholder?: string;
  disabled?: boolean;
};

export function SelectFormField<T extends FieldValues, V extends string>({
  control,
  name,
  label,
  className,
  options,
  placeholder = '',
  disabled,
}: SelectFormFieldProps<T, V>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormField label={label} error={error?.message} className={className}>
          <SelectField<V>
            value={value as V | undefined}
            options={options}
            onValueChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        </FormField>
      )}
    />
  );
}

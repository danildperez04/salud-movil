// components/ui/select-field.tsx
import { FIELD_CLASS_NAME } from '@/components/ui/form-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SelectOption<T extends string = string> = { value: T; label: string };

/** { medication: 'Medicamento', … } -> [{ value: 'medication', label: 'Medicamento' }, …] */
export function optionsFromLabels<T extends string>(labels: Record<T, string>): SelectOption<T>[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}

type SelectFieldProps<T extends string> = {
  value?: T;
  options: readonly SelectOption<T>[];
  onValueChange: (value: T) => void;
  placeholder: string;
  disabled?: boolean;
};

/** Selector de una opción entre varias, con la apariencia de campo de la app. */
export function SelectField<T extends string>({
  value,
  options,
  onValueChange,
  placeholder,
  disabled,
}: SelectFieldProps<T>) {
  const current = options.find((option) => option.value === value);

  return (
    <Select value={current} onValueChange={(option) => option && onValueChange(option.value as T)}>
      <SelectTrigger className={FIELD_CLASS_NAME} disabled={disabled}>
        <SelectValue className="text-body" placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} label={option.label} value={option.value} />
        ))}
      </SelectContent>
    </Select>
  );
}

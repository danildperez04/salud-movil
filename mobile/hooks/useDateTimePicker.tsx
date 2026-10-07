// hooks/useDateTimePicker.tsx
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState, type ReactElement } from 'react';
import { Platform } from 'react-native';

type PickerFieldConfig = {
  mode: 'date' | 'time';
  minimumDate?: Date;
  maximumDate?: Date;
};

type UseDateTimePickerOptions<F extends string> = {
  fields: Record<F, PickerFieldConfig>;
  getValue: (field: F) => Date | undefined;
  onChange: (field: F, value: Date) => void;
};

/**
 * Picker nativo de fecha/hora para varios campos de un formulario. Android abre
 * un diálogo; iOS no tiene diálogo, así que el picker se dibuja inline bajo el
 * campo con `renderIosPicker(field)`.
 */
export function useDateTimePicker<F extends string>({
  fields,
  getValue,
  onChange,
}: UseDateTimePickerOptions<F>) {
  const [iosField, setIosField] = useState<F | null>(null);

  const open = (field: F) => {
    const { mode, minimumDate, maximumDate } = fields[field];
    const current = getValue(field) ?? new Date();

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: current,
        mode,
        minimumDate,
        maximumDate,
        onValueChange: (_event, selected) => onChange(field, selected),
      });
      return;
    }

    // en iOS el picker no emite cambio hasta que el usuario lo mueve: se fija
    // el valor inicial al abrirlo para que el campo no quede vacío.
    if (!getValue(field)) onChange(field, current);
    setIosField((openField) => (openField === field ? null : field));
  };

  const renderIosPicker = (field: F): ReactElement | null => {
    if (Platform.OS !== 'ios' || iosField !== field) return null;
    const { mode, minimumDate, maximumDate } = fields[field];

    return (
      <DateTimePicker
        value={getValue(field) ?? new Date()}
        mode={mode}
        display={mode === 'date' ? 'inline' : 'spinner'}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onValueChange={(_event, selected) => onChange(field, selected)}
      />
    );
  };

  return { open, renderIosPicker };
}

// components/ui/footer-button.tsx
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';

type FooterButtonProps = {
  label: string;
  onPress: () => void;
  /** muestra un spinner en vez del texto y bloquea el botón */
  isPending?: boolean;
  /** bloquea el botón sin cambiar su contenido (ej. formulario incompleto) */
  disabled?: boolean;
};

/** Botón principal fijo al pie de una pantalla (guardar, agregar, subir…). */
export function FooterButton({
  label,
  onPress,
  isPending = false,
  disabled = false,
}: FooterButtonProps) {
  return (
    <View className="px-6 pt-2 pb-8">
      <Button size="lg" className="h-14" onPress={onPress} disabled={isPending || disabled}>
        {isPending ? (
          <Spinner size="sm" color="#FFFFFF" />
        ) : (
          <Text className="text-body text-primary-foreground">{label}</Text>
        )}
      </Button>
    </View>
  );
}

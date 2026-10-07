// components/ui/tone-badge.tsx
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';

// sufijos hex de opacidad: 1A ≈ 10 %, 4D ≈ 30 %
const FILL_ALPHA = '1A';
const BORDER_ALPHA = '4D';

type ToneBadgeProps = {
  label: string;
  /** color base (hex de 6 dígitos): se usa para el texto y, atenuado, para el fondo y el borde */
  color: string;
};

/** Píldora de estado (Normal, Revisar, Severa…) con el color de su estado. */
export function ToneBadge({ label, color }: ToneBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="px-3 py-1.5"
      style={{ backgroundColor: color + FILL_ALPHA, borderColor: color + BORDER_ALPHA }}
    >
      <Text className="text-caption font-body-semibold" style={{ color }}>
        {label}
      </Text>
    </Badge>
  );
}

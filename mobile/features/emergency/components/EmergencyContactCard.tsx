// features/emergency/components/EmergencyContactCard.tsx
import { Phone, UserRound } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { ListItemCard } from '@/components/ui/list-item-card';
import { EMERGENCY_LABELS, EMERGENCY_RELATION_LABELS } from '@/constants/labels';
import { joinParts } from '@/lib/text-format';
import { colors } from '@/lib/tokens';
import type { EmergencyContact } from '../domain/emergency-contact';

type EmergencyContactCardProps = {
  contact: EmergencyContact;
  onCall: () => void;
};

/** Contacto de emergencia con un botón para llamarle. */
export function EmergencyContactCard({ contact, onCall }: EmergencyContactCardProps) {
  return (
    <ListItemCard
      icon={UserRound}
      tone="muted"
      title={contact.name}
      subtitle={joinParts([EMERGENCY_RELATION_LABELS[contact.relation], contact.phone])}
      trailing={
        <Pressable
          onPress={onCall}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={EMERGENCY_LABELS.callContact(contact.name)}
          className="h-11 w-11 items-center justify-center rounded-full active:opacity-60"
        >
          <Phone size={22} color={colors.brandGreen} />
        </Pressable>
      }
    />
  );
}

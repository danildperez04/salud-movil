// features/security/components/DeviceCard.tsx
import { Globe, Smartphone } from '@/lib/icons';
import { Pressable } from 'react-native';
import { ListItemCard } from '@/components/ui/list-item-card';
import { Text } from '@/components/ui/text';
import { ToneBadge } from '@/components/ui/tone-badge';
import { SECURITY_LABELS } from '@/constants/labels';
import { statusColors } from '@/lib/tokens';
import type { DeviceSession } from '../api/mock-security';
import { describeSession } from '../domain/describe-session';

const { devices } = SECURITY_LABELS;

type DeviceCardProps = {
  session: DeviceSession;
  onClose: () => void;
  disabled?: boolean;
};

export function DeviceCard({ session, onClose, disabled }: DeviceCardProps) {
  return (
    <ListItemCard
      icon={session.platform === 'web' ? Globe : Smartphone}
      title={session.name}
      subtitle={describeSession(session)}
      trailing={
        session.isCurrent ? (
          <ToneBadge label={devices.current} color={statusColors.success} />
        ) : (
          <Pressable
            onPress={onClose}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={devices.closeA11y(session.name)}
            className="border-border rounded-full border px-4 py-2 active:opacity-70"
          >
            <Text className="text-caption font-body-semibold text-muted-foreground">
              {devices.close}
            </Text>
          </Pressable>
        )
      }
    />
  );
}

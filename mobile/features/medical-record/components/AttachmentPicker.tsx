// features/medical-record/components/AttachmentPicker.tsx
import { Camera, FileText, type LucideIcon } from '@/lib/icons';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { colors } from '@/lib/tokens';
import type { PickedMedia } from '@/hooks/useMediaPicker';
import { ScanImage } from './ScanImage';

export type AttachmentAction = {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  /** la primera acción suele ser `default` (relleno) y el resto `outline` */
  variant?: 'default' | 'outline';
};

type AttachmentPickerProps = {
  attachment?: PickedMedia;
  /** texto del recuadro mientras no hay archivo */
  emptyTitle: string;
  emptyDescription: string;
  error?: string;
  actions: AttachmentAction[];
};

/** Recuadro con la vista previa del archivo adjunto y los botones para elegirlo. */
export function AttachmentPicker({
  attachment,
  emptyTitle,
  emptyDescription,
  error,
  actions,
}: AttachmentPickerProps) {
  return (
    <View className="gap-4">
      {attachment?.kind === 'image' ? (
        <ScanImage uri={attachment.uri} label={attachment.name} />
      ) : (
        <View className="border-primary/40 bg-primary/5 min-h-56 items-center justify-center gap-3 rounded-3xl border border-dashed px-6 py-8">
          <View className="bg-primary/10 h-16 w-16 items-center justify-center rounded-2xl">
            {attachment ? (
              <FileText size={28} color={colors.brandGreen} />
            ) : (
              <Camera size={28} color={colors.brandGreen} />
            )}
          </View>
          <Text className="text-body font-heading-semibold text-foreground text-center">
            {attachment ? attachment.name : emptyTitle}
          </Text>
          {!attachment && (
            <Text className="text-small font-body text-muted-foreground text-center">
              {emptyDescription}
            </Text>
          )}
        </View>
      )}

      {error && <Text className="text-small text-destructive">{error}</Text>}

      <View className="gap-3">
        {actions.map(({ label, icon: Icon, onPress, variant = 'default' }) => (
          <Button key={label} size="lg" variant={variant} onPress={onPress}>
            <Icon size={20} color={variant === 'default' ? '#FFFFFF' : colors.brandGreen} />
            <Text
              className={
                variant === 'default'
                  ? 'text-body text-primary-foreground'
                  : 'text-body font-heading-semibold text-primary'
              }
            >
              {label}
            </Text>
          </Button>
        ))}
      </View>
    </View>
  );
}

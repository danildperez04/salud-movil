// features/help/components/ChatComposer.tsx
import { Send } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Input } from '@/components/ui/input';
import { HELP_LABELS } from '@/constants/labels';
import { cn } from '@/lib/utils';

type ChatComposerProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  canSend: boolean;
};

const { chat } = HELP_LABELS;

/** Campo de texto y botón de envío al pie del chat. */
export function ChatComposer({ value, onChangeText, onSend, canSend }: ChatComposerProps) {
  return (
    <View className="flex-row items-center gap-3 px-6 pt-2 pb-6">
      <Input
        className="h-12 flex-1 rounded-full px-5"
        placeholder={chat.placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSend}
        returnKeyType="send"
      />
      <Pressable
        onPress={onSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel={chat.send}
        className={cn(
          'bg-primary h-12 w-12 items-center justify-center rounded-full',
          !canSend && 'opacity-50',
        )}
      >
        <Send size={20} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

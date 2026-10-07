// features/help/components/ChatBubble.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '../hooks/useSupportChat';

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.from === 'user';

  return (
    <View
      className={cn(
        'max-w-[82%] rounded-2xl px-4 py-3',
        isUser ? 'bg-primary self-end rounded-br-md' : 'bg-muted/20 self-start rounded-bl-md',
      )}
    >
      <Text
        className={cn(
          'text-small font-body',
          isUser ? 'text-primary-foreground' : 'text-foreground',
        )}
      >
        {message.text}
      </Text>
    </View>
  );
}

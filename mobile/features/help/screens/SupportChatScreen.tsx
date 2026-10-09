// features/help/screens/SupportChatScreen.tsx
import { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SCREEN_TITLES } from '@/constants/labels';
import { ChatBubble } from '../components/ChatBubble';
import { ChatComposer } from '../components/ChatComposer';
import { useSupportChat } from '../hooks/useSupportChat';

export default function SupportChatScreen() {
  const { messages, draft, setDraft, send, canSend } = useSupportChat();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="bg-background flex-1"
    >
      <ScreenHeader title={SCREEN_TITLES.supportChat} align="center" />

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="gap-3 px-6 pt-2 pb-4"
        // cada mensaje nuevo (propio o de soporte) deja la conversación al final
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </ScrollView>

      <ChatComposer value={draft} onChangeText={setDraft} onSend={send} canSend={canSend} />
    </KeyboardAvoidingView>
  );
}

// features/help/hooks/useSupportChat.ts
import { useState } from 'react';
import { HELP_LABELS } from '@/constants/labels';
import { fetchMockSupportReply } from '../api/mock-help';

export type ChatMessage = { id: string; from: 'support' | 'user'; text: string };

const { chat } = HELP_LABELS;

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'greeting', from: 'support', text: chat.greeting },
  { id: 'topics', from: 'support', text: chat.topics },
];

let nextMessageId = 0;
const newMessage = (from: ChatMessage['from'], text: string): ChatMessage => ({
  id: `message-${nextMessageId++}`,
  from,
  text,
});

/** Conversación con soporte: mensajes, borrador y envío. */
export function useSupportChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const send = async () => {
    const text = draft.trim();
    if (!text || isReplying) return;

    setMessages((current) => [...current, newMessage('user', text)]);
    setDraft('');
    setIsReplying(true);

    const reply = await fetchMockSupportReply();
    setMessages((current) => [...current, newMessage('support', reply)]);
    setIsReplying(false);
  };

  return {
    messages,
    draft,
    setDraft,
    send,
    canSend: draft.trim().length > 0 && !isReplying,
  };
}

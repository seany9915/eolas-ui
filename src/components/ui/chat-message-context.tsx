import * as React from 'react';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessageContextValue {
  inMessage: boolean;
  role: ChatRole;
}

export const ChatMessageContext = React.createContext<ChatMessageContextValue>({
  inMessage: false,
  role: 'assistant',
});

export const useChatMessageContext = () => React.useContext(ChatMessageContext);

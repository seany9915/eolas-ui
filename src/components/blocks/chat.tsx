/**
 * Chat composite block.
 *
 * Layer: Composite Block (`src/components/blocks/`)
 * Foundation: Built strictly from primitives:
 *             - `MessageScroller` (`src/components/ui/message-scroller.tsx`)
 *             - `ChatMessage` (`src/components/ui/chat-message.tsx`)
 *             - `PromptInput` (`src/components/ui/prompt-input.tsx`)
 *             - `SuggestionChips` (`src/components/ui/suggestion-chips.tsx`)
 *             - `EmptyState` (`src/components/ui/empty-state.tsx`)
 *
 * Specification & Reference:
 * - https://ui.shadcn.com/docs/ai-elements/base/chat
 * - https://ui.shadcn.com/docs/ai-elements
 *
 * TAXONOMY & USAGE:
 * - Controlled presentational chat workspace assembling the streaming viewport engine,
 *   assistant/user messages, suggestion prompts, and message composer.
 * - Pure UI: receives items via props, emits intents via callbacks. Zero direct fetch or auth.
 * - WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive elements.
 * - Strictly follows DESIGN.md tokens: floating 2px focus ring, semantic high-contrast colors,
 *   concentric radius, zero triple-tints.
 */
import * as React from 'react';
import {
  MessageScroller,
  MessageScrollerProvider,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from '@/components/ui/message-scroller';
import { ChatMessage, type ChatMessageProps } from '@/components/ui/chat-message';
import { PromptInput } from '@/components/ui/prompt-input';
import { SuggestionChips, type SuggestionItem } from '@/components/ui/suggestion-chips';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export interface ChatMessageData extends ChatMessageProps {
  id: string;
}

/* -------------------------------------------------------------------------------------------------
 * ChatHeader
 * -----------------------------------------------------------------------------------------------*/
export interface ChatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const ChatHeader = React.forwardRef<HTMLDivElement, ChatHeaderProps>(
  ({ title, subtitle, actions, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="chat-header"
        className={cn(
          'flex items-center justify-between px-4 py-3 border-b border-outline-variant/40 bg-surface min-h-[56px] shrink-0',
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <div className="flex flex-col min-w-0">
              {title && <h3 className="font-heading text-sm font-bold text-on-surface truncate">{title}</h3>}
              {subtitle && <p className="font-sans text-xs text-on-surface-variant truncate">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </>
        )}
      </div>
    );
  }
);
ChatHeader.displayName = 'ChatHeader';

/* -------------------------------------------------------------------------------------------------
 * Chat (Root Composite Block)
 * -----------------------------------------------------------------------------------------------*/
export interface ChatProps {
  messages: ChatMessageData[];
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onSubmitMessage?: (content: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  suggestions?: (string | SuggestionItem)[];
  onSelectSuggestion?: (suggestion: string) => void;
  placeholder?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  header?: React.ReactNode;
  footerHint?: React.ReactNode;
  className?: string;
}

const ChatRoot: React.FC<ChatProps> = ({
  messages = [],
  inputValue = '',
  onInputChange,
  onSubmitMessage,
  onStop,
  isLoading = false,
  disabled = false,
  suggestions = [],
  onSelectSuggestion,
  placeholder = 'Type a message or clinical prompt...',
  emptyStateTitle = 'Clinical Consultation Workspace',
  emptyStateDescription = 'Ask clinical questions, review speech therapy plans, or verify acoustic norms.',
  header,
  footerHint,
  className,
}) => {
  const [internalValue, setInternalValue] = React.useState('');
  const currentValue = onInputChange ? inputValue : internalValue;

  const handleValueChange = (val: string) => {
    setInternalValue(val);
    onInputChange?.(val);
  };

  const handleSend = () => {
    if (!currentValue.trim() || isLoading) return;
    onSubmitMessage?.(currentValue.trim());
    if (!onInputChange) {
      setInternalValue('');
    }
  };

  const normalizedSuggestions: SuggestionItem[] = suggestions.map((s, idx) =>
    typeof s === 'string' ? { id: `sugg-${idx}`, label: s, prompt: s } : s
  );

  return (
    <div
      data-slot="chat"
      className={cn(
        'relative flex flex-col w-full h-[600px] max-h-[85vh] rounded-xl border border-outline-variant bg-surface overflow-hidden shadow-ambient',
        className
      )}
    >
      {/* Header bar */}
      {header}

      {/* Viewport Engine */}
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="flex-1 min-h-0 bg-surface-container/20">
          <MessageScrollerViewport>
            <MessageScrollerContent>
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8 min-h-[300px]">
                  <EmptyState
                    icon="forum"
                    title={emptyStateTitle}
                    description={emptyStateDescription}
                    className="max-w-md border-0 bg-transparent shadow-none"
                  />
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageScrollerItem
                    key={msg.id}
                    messageId={msg.id}
                    scrollAnchor={msg.role === 'user'}
                  >
                    <ChatMessage {...msg} />
                  </MessageScrollerItem>
                ))
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>

          {/* Jump to bottom edge control */}
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      {/* Suggestions Row */}
      {normalizedSuggestions.length > 0 && (
        <div className="px-4 py-2 border-t border-outline-variant/30 bg-surface shrink-0">
          <SuggestionChips
            suggestions={normalizedSuggestions}
            onSelect={(s) => {
              if (onSelectSuggestion) {
                onSelectSuggestion(s);
              } else {
                handleValueChange(s);
              }
            }}
          />
        </div>
      )}

      {/* Input Composer */}
      <div className="p-3.5 border-t border-outline-variant/40 bg-surface shrink-0">
        <PromptInput
          value={currentValue}
          onValueChange={handleValueChange}
          onSubmit={handleSend}
          onStop={onStop}
          isLoading={isLoading}
          disabled={disabled}
          placeholder={placeholder}
          hint={footerHint}
          minRows={2}
          maxHeight="8rem"
        />
      </div>
    </div>
  );
};
ChatRoot.displayName = 'Chat';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Chat = Object.assign(ChatRoot, {
  Header: ChatHeader,
  Message: ChatMessage,
  Input: PromptInput,
  Scroller: MessageScroller,
});

export default Chat;

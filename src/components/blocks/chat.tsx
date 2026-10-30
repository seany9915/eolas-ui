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
 * - https://ui.shadcn.com/docs/ai-elements/base/prompt-input
 *
 * TAXONOMY & USAGE:
 * - Controlled presentational chat workspace assembling the streaming viewport engine,
 *   assistant/user messages, suggestion prompts, and message composer.
 * - Supports both Docked (pinned bottom) and Floating Island (centered, floating) prompt positioning.
 * - Supports Model Selection, Reasoning Effort, and Tool Toggles.
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
import {
  PromptInput,
  type PromptInputModelOption,
  type PromptInputEffortOption,
} from '@/components/ui/prompt-input';
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
          'flex items-center justify-between px-4 py-3 border-b border-outline-variant/40 bg-surface min-h-14 shrink-0',
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
 * ChatMessages
 * -----------------------------------------------------------------------------------------------*/
export interface ChatMessagesProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ChatMessages = React.forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="chat-messages"
        className={cn('flex-1 min-h-0 flex flex-col', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatMessages.displayName = 'ChatMessages';

/* -------------------------------------------------------------------------------------------------
 * ChatFooter
 * -----------------------------------------------------------------------------------------------*/
export interface ChatFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ChatFooter = React.forwardRef<HTMLDivElement, ChatFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="chat-footer"
        className={cn('p-3.5 border-t border-outline-variant/40 bg-surface shrink-0', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatFooter.displayName = 'ChatFooter';

/* -------------------------------------------------------------------------------------------------
 * ChatStatus & ScrollAnchor
 * -----------------------------------------------------------------------------------------------*/
export interface ChatStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: string;
  isStreaming?: boolean;
  children?: React.ReactNode;
}

export const ChatStatus: React.FC<ChatStatusProps> = ({
  status,
  isStreaming = false,
  children,
  className,
  ...props
}) => {
  if (!status && !children && !isStreaming) return null;
  return (
    <div
      data-slot="chat-status"
      className={cn('flex items-center gap-2 px-4 py-1.5 text-xs font-sans text-on-surface-variant select-none', className)}
      {...props}
    >
      {isStreaming && (
        <span className="size-2 rounded-full bg-secondary animate-pulse shrink-0" aria-hidden="true" />
      )}
      {children || <span>{status}</span>}
    </div>
  );
};
ChatStatus.displayName = 'ChatStatus';

export const ChatScrollAnchor: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    data-slot="chat-scroll-anchor"
    className={cn('h-px w-full pointer-events-none select-none opacity-0', className)}
    aria-hidden="true"
    {...props}
  />
);
ChatScrollAnchor.displayName = 'ChatScrollAnchor';

/* -------------------------------------------------------------------------------------------------
 * Chat (Root Composite Block)
 * -----------------------------------------------------------------------------------------------*/
export interface ChatProps {
  children?: React.ReactNode;
  variant?: 'card' | 'canvas' | 'ghost' | 'unboxed';
  messages?: ChatMessageData[];
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
  position?: 'docked' | 'floating';
  model?: string;
  onModelChange?: (model: string) => void;
  models?: PromptInputModelOption[];
  effort?: string;
  onEffortChange?: (effort: string) => void;
  effortOptions?: PromptInputEffortOption[];
  webSearchActive?: boolean;
  onWebSearchToggle?: (active: boolean) => void;
  onFilesSelected?: (files: File[]) => void;
  attachments?: React.ReactNode;
  className?: string;
}

const ChatRoot: React.FC<ChatProps> = ({
  children,
  variant = 'card',
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
  position = 'docked',
  model,
  onModelChange,
  models,
  effort,
  onEffortChange,
  effortOptions,
  webSearchActive,
  onWebSearchToggle,
  onFilesSelected,
  attachments,
  className,
}) => {
  const isUnboxed = variant === 'canvas' || variant === 'ghost' || variant === 'unboxed';

  // If children are supplied, support declarative compound usage!
  if (children) {
    return (
      <MessageScrollerProvider autoScroll>
        <div
          data-slot="chat"
          className={cn(
            '@container relative flex flex-col w-full h-150 max-h-full overflow-hidden transition-colors duration-quick ease-standard motion-reduce:transition-none',
            isUnboxed ? 'rounded-none border-0 bg-transparent' : 'rounded-lg border border-outline-variant bg-surface',
            className
          )}
        >
          {children}
        </div>
      </MessageScrollerProvider>
    );
  }
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

  const isFloating = position === 'floating';

  const promptInputNode = (
    <PromptInput
      value={currentValue}
      onValueChange={handleValueChange}
      onSubmit={handleSend}
      onStop={onStop}
      isLoading={isLoading}
      disabled={disabled}
      floating={isFloating}
      placeholder={placeholder}
      hint={footerHint}
      model={model}
      onModelChange={onModelChange}
      models={models}
      effort={effort}
      onEffortChange={onEffortChange}
      effortOptions={effortOptions}
      webSearchActive={webSearchActive}
      onWebSearchToggle={onWebSearchToggle}
      onFilesSelected={onFilesSelected}
      attachments={attachments}
      minRows={2}
      maxHeight="8rem"
    />
  );

  return (
    <div
      data-slot="chat"
      className={cn(
        'relative flex flex-col w-full h-150 max-h-full overflow-hidden transition-colors duration-quick ease-standard motion-reduce:transition-none',
        isUnboxed ? 'rounded-none border-0 bg-transparent' : 'rounded-lg border border-outline-variant bg-surface',
        className
      )}
    >
      {/* Header bar */}
      {header}

      {/* Viewport Engine */}
      <MessageScrollerProvider autoScroll>
        <MessageScroller variant="container" className="flex-1 min-h-0">
          <MessageScrollerViewport>
            <MessageScrollerContent>
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8 min-h-75">
                  <EmptyState
                    variant="unboxed"
                    icon="forum"
                    title={emptyStateTitle}
                    description={emptyStateDescription}
                    className="max-w-md"
                  />
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <MessageScrollerItem
                      key={msg.id}
                      messageId={msg.id}
                      scrollAnchor={msg.role === 'user'}
                    >
                      <ChatMessage {...msg} />
                    </MessageScrollerItem>
                  ))}
                  {isFloating && (
                    <div className="h-32 shrink-0 select-none pointer-events-none" aria-hidden="true" />
                  )}
                </>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>

          {/* Jump to bottom edge control */}
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      {/* Suggestions Row */}
      {normalizedSuggestions.length > 0 && (
        <div className={cn(
          'px-4 py-2 bg-surface shrink-0',
          isFloating ? 'pb-2 border-t border-outline-variant/20' : 'border-t border-outline-variant/30'
        )}>
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

      {/* Input Composer: Floating vs Docked */}
      {isFloating ? (
        <div className="absolute inset-x-0 bottom-4 px-4 z-10 pointer-events-none flex justify-center">
          <div className="pointer-events-auto w-full max-w-3xl">
            {promptInputNode}
          </div>
        </div>
      ) : (
        <ChatFooter className="border-t border-outline-variant/30 bg-surface-container/20">
          {promptInputNode}
        </ChatFooter>
      )}
    </div>
  );
};
ChatRoot.displayName = 'Chat';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Chat = Object.assign(ChatRoot, {
  Header: ChatHeader,
  Messages: ChatMessages,
  Message: ChatMessage,
  Input: PromptInput,
  Composer: PromptInput,
  Footer: ChatFooter,
  Status: ChatStatus,
  ScrollAnchor: ChatScrollAnchor,
  Scroller: MessageScroller,
});

export { ChatRoot };
export default Chat;

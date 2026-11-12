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
import {
  ChatMessage,
  ChatMessageBubble,
  ChatMessageAvatar,
  ChatMessageActions,
  type ChatMessageProps,
} from '@/components/ui/chat-message';
import { Reasoning } from '@/components/ui/reasoning';
import {
  PromptInput,
  type PromptInputModelOption,
  type PromptInputEffortOption,
} from '@/components/ui/prompt-input';
import { SuggestionChips, SuggestionChip, type SuggestionItem } from '@/components/ui/suggestion-chips';
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
          'flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface min-h-14 shrink-0',
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
  showScrollButton?: boolean;
}

export const ChatMessages = React.forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ children, showScrollButton = true, className, ...props }, ref) => {
    return (
      <div className="relative flex-1 min-h-0 flex flex-col">
        <MessageScrollerViewport
          ref={ref}
          className={cn('flex-1 min-h-0 w-full overflow-y-auto overscroll-contain relative scroll-smooth', className)}
          {...props}
        >
          <MessageScrollerContent>
            {children}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        {showScrollButton && <MessageScrollerButton />}
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
        className={cn('p-3.5 border-t border-outline-variant bg-surface shrink-0', className)}
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
  status?: React.ReactNode;
  isStreaming?: boolean;
  children?: React.ReactNode;
}

export const ChatStatus = React.forwardRef<HTMLDivElement, ChatStatusProps>(
  ({ status, isStreaming = false, children, className, ...props }, ref) => {
    if (!status && !children && !isStreaming) return null;
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        data-slot="chat-status"
        className={cn(
          'flex items-center gap-2 px-4 py-1.5 text-xs font-sans text-on-surface-variant select-none',
          className
        )}
        {...props}
      >
        {isStreaming && (
          <span className="size-2 rounded-full bg-secondary animate-pulse shrink-0" aria-hidden="true" />
        )}
        {children || (typeof status === 'string' ? <span>{status}</span> : status)}
        {isStreaming && !status && !children && (
          <span className="sr-only">Generating response...</span>
        )}
      </div>
    );
  }
);
ChatStatus.displayName = 'ChatStatus';

export const ChatScrollAnchor = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="chat-scroll-anchor"
      className={cn('h-px w-full pointer-events-none select-none opacity-0', className)}
      aria-hidden="true"
      {...props}
    />
  )
);
ChatScrollAnchor.displayName = 'ChatScrollAnchor';

/* -------------------------------------------------------------------------------------------------
 * Chat (Root Composite Block)
 * -----------------------------------------------------------------------------------------------*/
export interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
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
  suggestionsLabel?: string;
  onSelectSuggestion?: (suggestion: string) => void;
  submitOnSuggestion?: boolean;
  placeholder?: string;
  emptyState?: React.ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: string;
  header?: React.ReactNode;
  footerHint?: React.ReactNode;
  status?: React.ReactNode;
  isStreaming?: boolean;
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
  onVoiceToggle?: () => void;
  isRecording?: boolean;
  attachments?: React.ReactNode;
  composerActionsStart?: React.ReactNode;
  composerActionsEnd?: React.ReactNode;
  submitLabel?: string;
  stopLabel?: string;
  autoScroll?: boolean;
  className?: string;
}

const variantStyles: Record<NonNullable<ChatProps['variant']>, string> = {
  card: 'rounded-2xl border-none shadow-ambient bg-surface',
  canvas: 'rounded-none border-0 bg-background',
  ghost: 'rounded-none border-0 bg-transparent',
  unboxed: 'rounded-none border-0 bg-transparent',
};

const ChatRoot = React.forwardRef<HTMLDivElement, ChatProps>(
  (
    {
      children,
      variant = 'card',
      messages = [],
      inputValue,
      onInputChange,
      onSubmitMessage,
      onStop,
      isLoading = false,
      disabled = false,
      suggestions = [],
      suggestionsLabel = '',
      onSelectSuggestion,
      submitOnSuggestion = false,
      placeholder = 'Type a message...',
      emptyState,
      emptyStateTitle = 'Start a conversation',
      emptyStateDescription = 'Send a message to get started.',
      emptyStateIcon = 'forum',
      header,
      footerHint,
      status,
      isStreaming = false,
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
      onVoiceToggle,
      isRecording,
      attachments,
      composerActionsStart,
      composerActionsEnd,
      submitLabel,
      stopLabel,
      autoScroll = true,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState('');

    // Controlled only when inputValue is supplied; onInputChange alone just observes changes
    const isControlled = inputValue !== undefined;
    const currentValue = isControlled ? inputValue : internalValue;

    const handleValueChange = (val: string) => {
      if (!isControlled) setInternalValue(val);
      onInputChange?.(val);
    };

    const handleSend = () => {
      if (!currentValue.trim() || isLoading) return;
      onSubmitMessage?.(currentValue.trim());
      if (!isControlled) {
        setInternalValue('');
      }
    };

    const handleSuggestionClick = (suggestionText: string) => {
      if (onSelectSuggestion) {
        onSelectSuggestion(suggestionText);
      } else if (submitOnSuggestion) {
        onSubmitMessage?.(suggestionText);
      } else {
        handleValueChange(suggestionText);
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
        onVoiceToggle={onVoiceToggle}
        isRecording={isRecording}
        attachments={attachments}
        actionsStart={composerActionsStart}
        actionsEnd={composerActionsEnd}
        submitLabel={submitLabel}
        stopLabel={stopLabel}
        minRows={2}
        maxHeight="8rem"
      />
    );

    return (
      <MessageScrollerProvider autoScroll={autoScroll}>
        <div
          ref={ref}
          data-slot="chat"
          className={cn(
            '@container relative flex flex-col w-full h-full min-h-120 overflow-hidden transition-colors duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
            variantStyles[variant] ?? variantStyles.card,
            className
          )}
          {...props}
        >
          {children ? (
            children
          ) : (
            <>
              {/* Header bar */}
              {header}

              {/* Viewport Engine */}
              <MessageScroller variant="default" className="flex-1 min-h-0">
                <MessageScrollerViewport>
                  <MessageScrollerContent>
                    {messages.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center p-8 min-h-75">
                        {emptyState ?? (
                          <EmptyState
                            variant="unboxed"
                            icon={emptyStateIcon}
                            title={emptyStateTitle}
                            description={emptyStateDescription}
                            className="max-w-md"
                          />
                        )}
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
                        {(status || isStreaming || isLoading) && (
                          <MessageScrollerItem messageId="chat-live-status">
                            <ChatStatus
                              status={status}
                              isStreaming={isStreaming || isLoading}
                            />
                          </MessageScrollerItem>
                        )}
                        {isFloating && (
                          <div
                            className={cn(
                              'shrink-0 select-none pointer-events-none',
                              normalizedSuggestions.length > 0 ? 'h-48' : 'h-32'
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </>
                    )}
                  </MessageScrollerContent>
                </MessageScrollerViewport>

                {/* Jump to bottom edge control */}
                <MessageScrollerButton
                  className={cn(
                    isFloating
                      ? normalizedSuggestions.length > 0
                        ? 'bottom-36 right-4'
                        : 'bottom-24 right-4'
                      : 'bottom-4 right-4'
                  )}
                />
              </MessageScroller>

              {/* Floating Island vs Docked Layout */}
              {isFloating ? (
                <div className="absolute inset-x-0 bottom-4 px-4 z-10 pointer-events-none flex flex-col items-center gap-2">
                  {normalizedSuggestions.length > 0 && (
                    <div className="pointer-events-auto w-full max-w-3xl">
                      <SuggestionChips
                        label={suggestionsLabel}
                        suggestions={normalizedSuggestions}
                        onSelect={handleSuggestionClick}
                      />
                    </div>
                  )}
                  <div className="pointer-events-auto w-full max-w-3xl">
                    {promptInputNode}
                  </div>
                </div>
              ) : (
                <>
                  {normalizedSuggestions.length > 0 && (
                    <div className="px-4 py-2 bg-surface shrink-0 border-t border-outline-variant">
                      <SuggestionChips
                        label={suggestionsLabel}
                        suggestions={normalizedSuggestions}
                        onSelect={handleSuggestionClick}
                      />
                    </div>
                  )}
                  <ChatFooter className="border-t border-outline-variant bg-surface">
                    {promptInputNode}
                  </ChatFooter>
                </>
              )}
            </>
          )}
        </div>
      </MessageScrollerProvider>
    );
  }
);
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
  Viewport: MessageScrollerViewport,
  Content: MessageScrollerContent,
  Item: MessageScrollerItem,
  Button: MessageScrollerButton,
  ScrollButton: MessageScrollerButton,
  Suggestions: SuggestionChips,
  Suggestion: SuggestionChip,
  EmptyState: EmptyState,
  Empty: EmptyState,
  Bubble: ChatMessageBubble,
  Avatar: ChatMessageAvatar,
  Actions: ChatMessageActions,
  Reasoning: Reasoning,
});

export { ChatRoot };
export default Chat;

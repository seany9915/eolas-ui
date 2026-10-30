/**
 * ChatMessage primitive.
 *
 * Base UI Integration: Works seamlessly with Base UI Button and Icon primitives.
 *
 * TAXONOMY & USAGE:
 * - Use ChatMessage to display conversational turns (user, assistant, system).
 * - Follows DESIGN.md:
 *   - Assistant messages use neutral surface fill (`bg-surface`), outline-variant border,
 *     calibrated ambient elevation (`shadow-ambient`), and `rounded-2xl rounded-bl-xs`.
 *   - User messages use role container fill (`bg-primary-container text-on-primary-container`),
 *     `rounded-2xl rounded-br-xs`, and right alignment.
 *   - Actions (copy, bookmark, retry) maintain accessible 44x44px touch targets.
 *   - Numeric timestamps use `tabular-nums` and `font-mono`.
 */
import * as React from 'react';
import { Button } from './button';
import { Icon } from './icon';
import { Avatar } from './avatar';
import { BotAvatar, type BotAvatarType } from './bot-avatar';
import { Trace } from './trace';
import { Reasoning } from './reasoning';
import { Tooltip } from './tooltip';
import { cn } from '@/lib/utils';

import {
  type ChatRole,
  type ChatMessageContextValue,
  ChatMessageContext,
  useChatMessageContext,
} from './chat-message-context';

export type { ChatRole, ChatMessageContextValue };
export { ChatMessageContext, useChatMessageContext };

export interface ChatMessageRootProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: ChatRole;
  align?: 'start' | 'end';
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageRoot = React.forwardRef<HTMLDivElement, ChatMessageRootProps>(
  ({ role = 'assistant', align, children, className, ...props }, ref) => {
    const resolvedAlign = align ?? (role === 'user' ? 'end' : 'start');
    return (
      <ChatMessageContext.Provider value={{ inMessage: true, role }}>
        <div
          ref={ref}
          data-role={role}
          data-align={resolvedAlign}
          className={cn(
            '@container flex w-full gap-3 py-2',
            resolvedAlign === 'end' ? 'justify-end' : 'justify-start',
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'flex flex-col gap-1.5',
              resolvedAlign === 'end'
                ? 'items-end max-w-[90%] @md:max-w-[80%]'
                : 'items-start max-w-[95%] @md:max-w-[85%]'
            )}
          >
            {children}
          </div>
        </div>
      </ChatMessageContext.Provider>
    );
  }
);
ChatMessageRoot.displayName = 'ChatMessage.Root';

export interface ChatMessageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  role: ChatRole;
  authorName?: string;
  timestamp?: number | string;
  botType?: BotAvatarType;
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageHeader: React.FC<ChatMessageHeaderProps> = ({
  role,
  authorName,
  timestamp,
  botType,
  children,
  className,
}) => {
  const defaultName = role === 'user' ? 'You' : role === 'assistant' ? 'Clinical Assistant' : 'System';
  const displayName = authorName || defaultName;

  const formattedTime = React.useMemo(() => {
    if (!timestamp) return null;
    if (typeof timestamp === 'string') return timestamp;
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  }, [timestamp]);

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-1 text-xs font-label text-on-surface-variant select-none',
        role === 'user' ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {role === 'assistant' && botType && (
        <BotAvatar type={botType} size="sm" className="shrink-0" />
      )}
      <span className="font-semibold text-on-surface">{displayName}</span>
      {formattedTime && (
        <span className="text-xs font-mono tabular-nums text-on-surface-variant/80">
          {formattedTime}
        </span>
      )}
      {children}
    </div>
  );
};
ChatMessageHeader.displayName = 'ChatMessage.Header';

export interface ChatMessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  role: ChatRole;
  variant?: 'card' | 'ghost';
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageBubble = React.forwardRef<HTMLDivElement, ChatMessageBubbleProps>(
  ({ role, variant = 'card', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-role={role}
        className={cn(
          'p-4 text-base font-sans leading-relaxed transition-colors',
          role === 'user' &&
            'bg-primary-container text-on-primary-container rounded-lg rounded-br-xs',
          role === 'assistant' &&
            (variant === 'ghost'
              ? 'bg-transparent text-on-surface border-0 p-0 rounded-none'
              : 'bg-surface text-on-surface border border-outline-variant rounded-lg rounded-bl-xs'),
          role === 'system' &&
            'bg-surface-container text-on-surface-variant rounded-lg text-sm font-medium',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatMessageBubble.displayName = 'ChatMessage.Bubble';

export interface ChatMessageAvatarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Avatar>, 'fallback'> {
  role?: ChatRole;
  botType?: BotAvatarType;
  src?: string;
  name?: string;
  fallback?: React.ReactNode;
  className?: string;
}

const ChatMessageAvatar: React.FC<ChatMessageAvatarProps> = ({
  role = 'assistant',
  botType,
  src,
  name,
  fallback,
  className,
  ...props
}) => {
  if (role === 'assistant' && botType) {
    return <BotAvatar type={botType} size="sm" className={className} />;
  }

  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : role === 'user'
    ? 'U'
    : 'AI';

  return (
    <Avatar
      src={src}
      alt={name || (role === 'user' ? 'User avatar' : 'Assistant avatar')}
      fallback={fallback || initials}
      size="sm"
      className={cn(
        'size-7 text-xs shrink-0 select-none border',
        role === 'user'
          ? 'bg-primary text-on-primary border-primary'
          : 'bg-surface-container text-on-surface border-outline-variant',
        className
      )}
      {...props}
    />
  );
};
ChatMessageAvatar.displayName = 'ChatMessage.Avatar';

export interface ChatMessageGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageGroup = React.forwardRef<HTMLDivElement, ChatMessageGroupProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn('flex flex-col gap-2 w-full', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatMessageGroup.displayName = 'ChatMessage.Group';

export interface ChatMessageAttachmentsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageAttachments = React.forwardRef<HTMLDivElement, ChatMessageAttachmentsProps>(
  ({ children, className, ...props }, ref) => {
    if (!children) return null;
    return (
      <div
        ref={ref}
        data-slot="chat-message-attachments"
        className={cn('flex flex-wrap items-center gap-2 mb-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatMessageAttachments.displayName = 'ChatMessage.Attachments';

export interface ChatMessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageActions: React.FC<ChatMessageActionsProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1 mt-1 px-1 text-on-surface-variant',
        className
      )}
    >
      {children}
    </div>
  );
};
ChatMessageActions.displayName = 'ChatMessage.Actions';

export interface ChatMessageProps {
  role: ChatRole;
  content: React.ReactNode;
  variant?: 'card' | 'ghost';
  authorName?: string;
  timestamp?: number | string;
  botType?: BotAvatarType;
  reasoning?: React.ReactNode | string;
  isReasoningStreaming?: boolean;
  reasoningDuration?: string | number;
  plan?: React.ReactNode;
  trace?: React.ReactNode;
  thoughtSteps?: string[];
  citations?: React.ReactNode;
  attachments?: React.ReactNode;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onCopy?: () => void;
  onRetry?: () => void;
  extraActions?: React.ReactNode;
  className?: string;
}

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      role,
      content,
      variant = 'card',
      authorName,
      timestamp,
      botType,
      reasoning,
      isReasoningStreaming,
      reasoningDuration,
      plan,
      trace,
      thoughtSteps,
      citations,
      attachments,
      isBookmarked,
      onBookmark,
      onCopy,
      onRetry,
      extraActions,
      className,
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
      if (onCopy) {
        onCopy();
      } else if (typeof content === 'string') {
        navigator.clipboard?.writeText(content);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <ChatMessageRoot ref={ref} role={role} className={className}>
        <ChatMessageHeader
          role={role}
          authorName={authorName}
          timestamp={timestamp}
          botType={botType}
        />

        <ChatMessageBubble role={role} variant={variant}>
          {attachments && (
            <ChatMessageAttachments>{attachments}</ChatMessageAttachments>
          )}

          {reasoning && (
            <div className="mb-3">
              {typeof reasoning === 'string' ? (
                <Reasoning
                  variant="ghost"
                  isStreaming={isReasoningStreaming}
                  duration={reasoningDuration}
                >
                  {reasoning}
                </Reasoning>
              ) : (
                reasoning
              )}
            </div>
          )}

          {plan && (
            <div className="mb-3">
              {React.isValidElement(plan) && (plan.props as { variant?: string }).variant === undefined
                ? React.cloneElement(plan as React.ReactElement<{ variant?: string }>, { variant: 'ghost' })
                : plan}
            </div>
          )}

          {(trace || (thoughtSteps && thoughtSteps.length > 0)) && (
            <div className="mb-3">
              {trace ? (
                trace
              ) : (
                <Trace variant="ghost">
                  <Trace.Collapsible defaultOpen={false}>
                    <Trace.CollapsibleTrigger>
                      <Trace.Line status="complete">
                        <Trace.Icon name="checklist" status="complete" />
                        <Trace.Title>
                          Clinical Reasoning ({thoughtSteps!.length} step{thoughtSteps!.length > 1 ? 's' : ''})
                        </Trace.Title>
                      </Trace.Line>
                    </Trace.CollapsibleTrigger>
                    <Trace.CollapsibleContent>
                      <div className="pt-1 divide-y divide-outline-variant/30">
                        {thoughtSteps!.map((step, idx) => (
                          <Trace.Line key={idx} status="complete">
                            <Trace.Icon status="complete" />
                            <Trace.Title className="font-normal font-sans text-sm text-on-surface-variant">
                              {step}
                            </Trace.Title>
                          </Trace.Line>
                        ))}
                      </div>
                    </Trace.CollapsibleContent>
                  </Trace.Collapsible>
                </Trace>
              )}
            </div>
          )}

          <div className="typeset typeset-chat">{content}</div>

          {citations && (
            <div className="mt-3 pt-2.5 border-t border-outline-variant/50">
              {React.isValidElement(citations) && (citations.props as { variant?: string }).variant === undefined
                ? React.cloneElement(citations as React.ReactElement<{ variant?: string }>, { variant: 'ghost' })
                : citations}
            </div>
          )}
        </ChatMessageBubble>

        {role === 'assistant' && (onCopy || onBookmark || onRetry || extraActions) && (
          <ChatMessageActions>
            {onCopy && (
              <Tooltip content={copied ? 'Copied to clipboard' : 'Copy response'}>
                <Button
                  variant="ghost"
                  colorRole="neutral"
                  size="sm"
                  onClick={handleCopy}
                  expandedTouchTarget
                  aria-label={copied ? 'Copied to clipboard' : 'Copy response'}
                  className="text-xs gap-1 h-8 px-2"
                >
                  <Icon name={copied ? 'check' : 'content_copy'} size="xs" aria-hidden="true" />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </Button>
              </Tooltip>
            )}

            {onBookmark && (
              <Tooltip
                content={
                  isBookmarked
                    ? 'Saved to clinical library'
                    : 'Save response to library'
                }
              >
                <Button
                  variant={isBookmarked ? 'tonal' : 'ghost'}
                  colorRole={isBookmarked ? 'primary' : 'neutral'}
                  size="sm"
                  onClick={onBookmark}
                  expandedTouchTarget
                  aria-label={
                    isBookmarked
                      ? 'Saved to clinical library'
                      : 'Save response to library'
                  }
                  className="text-xs gap-1 h-8 px-2"
                >
                  <Icon
                    name={isBookmarked ? 'bookmark_added' : 'bookmark'}
                    size="xs"
                    aria-hidden="true"
                  />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </Button>
              </Tooltip>
            )}

            {onRetry && (
              <Tooltip content="Regenerate response">
                <Button
                  variant="ghost"
                  colorRole="neutral"
                  size="sm"
                  onClick={onRetry}
                  expandedTouchTarget
                  aria-label="Regenerate response"
                  className="text-xs gap-1 h-8 px-2"
                >
                  <Icon name="refresh" size="xs" aria-hidden="true" />
                  <span>Retry</span>
                </Button>
              </Tooltip>
            )}

            {extraActions}
          </ChatMessageActions>
        )}
      </ChatMessageRoot>
    );
  }
);
ChatMessage.displayName = 'ChatMessage';

export interface ChatMessageContentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageContentWrapper = React.forwardRef<HTMLDivElement, ChatMessageContentWrapperProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="message-content"
      className={cn('flex flex-col gap-1.5 w-full', className)}
      {...props}
    >
      {children}
    </div>
  )
);
ChatMessageContentWrapper.displayName = 'ChatMessage.ContentWrapper';

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const ChatMessageCompound = Object.assign(ChatMessage, {
  Root: ChatMessageRoot,
  Header: ChatMessageHeader,
  Bubble: ChatMessageBubble,
  Content: ChatMessageBubble,
  ContentWrapper: ChatMessageContentWrapper,
  Attachments: ChatMessageAttachments,
  Actions: ChatMessageActions,
  Footer: ChatMessageActions,
  Avatar: ChatMessageAvatar,
  Group: ChatMessageGroup,
});

export {
  ChatMessageRoot,
  ChatMessageHeader,
  ChatMessageBubble,
  ChatMessageContentWrapper,
  ChatMessageAttachments,
  ChatMessageActions,
  ChatMessageAvatar,
  ChatMessageGroup,
  // shadcn AI Elements direct aliases
  ChatMessageCompound as Message,
  ChatMessageRoot as MessageRoot,
  ChatMessageHeader as MessageHeader,
  ChatMessageContentWrapper as MessageContent,
  ChatMessageBubble as MessageBubble,
  ChatMessageBubble as Bubble,
  ChatMessageAttachments as MessageAttachments,
  ChatMessageActions as MessageFooter,
  ChatMessageActions as MessageActions,
  ChatMessageAvatar as MessageAvatar,
  ChatMessageGroup as MessageGroup,
};

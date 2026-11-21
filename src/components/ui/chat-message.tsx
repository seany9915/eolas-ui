'use client';

/**
 * ChatMessage primitive.
 *
 * Base UI Integration: Works seamlessly with Base UI Button and Icon primitives.
 *
 * TAXONOMY & USAGE:
 * - Use ChatMessage to display conversational turns (user, assistant, system).
 * - Follows DESIGN.md:
 *   - Assistant messages use neutral surface fill (`bg-surface`), outline-variant border,
 *     calibrated card elevation (`shadow-card`), and `rounded-lg rounded-es-sm`.
 *   - User messages use role container fill (`bg-primary-container text-on-primary-container`),
 *     `rounded-lg rounded-ee-sm`, and right alignment.
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
    const hasAvatarChild = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (child.type === ChatMessageAvatar ||
          (child.type as { displayName?: string })?.displayName === 'ChatMessage.Avatar')
    );

    return (
      <ChatMessageContext.Provider value={{ inMessage: true, role }}>
        <div
          ref={ref}
          data-slot="message"
          data-role={role}
          data-align={resolvedAlign}
          className={cn(
            '@container flex w-full gap-3 py-2',
            resolvedAlign === 'end' ? 'justify-end' : 'justify-start',
            className
          )}
          {...props}
        >
          {hasAvatarChild ? (
            <div
              className={cn(
                'flex items-start gap-3',
                resolvedAlign === 'end'
                  ? 'flex-row-reverse max-w-[90%] @md:max-w-[80%]'
                  : 'flex-row max-w-[95%] @md:max-w-[85%]'
              )}
            >
              {children}
            </div>
          ) : (
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
          )}
        </div>
      </ChatMessageContext.Provider>
    );
  }
);
ChatMessageRoot.displayName = 'ChatMessage.Root';

export interface ChatMessageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: ChatRole;
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
  ...props
}) => {
  const chatContext = useChatMessageContext();
  const resolvedRole: ChatRole = role ?? (chatContext.inMessage ? chatContext.role : 'assistant');
  const defaultName = resolvedRole === 'user' ? 'You' : resolvedRole === 'assistant' ? 'Assistant' : 'System';
  const displayName = authorName || defaultName;
  const showDefaultName = authorName !== undefined || children === undefined;

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
      data-slot="message-header"
      {...props}
      className={cn(
        'flex items-center gap-2 text-xs font-label text-on-surface-variant select-none',
        resolvedRole === 'user' ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {resolvedRole === 'assistant' && botType && (
        <BotAvatar type={botType} size="sm" className="shrink-0" />
      )}
      {showDefaultName && (
        <span className="font-semibold text-on-surface">{displayName}</span>
      )}
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

export type BubbleVariant =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'tinted'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'card';

export interface ChatMessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: ChatRole;
  variant?: BubbleVariant;
  align?: 'start' | 'end';
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageBubble = React.forwardRef<HTMLDivElement, ChatMessageBubbleProps>(
  ({ role, variant, align, children, className, ...props }, ref) => {
    const chatContext = useChatMessageContext();
    const resolvedRole = role ?? (chatContext.inMessage ? chatContext.role : undefined);
    const resolvedAlign = align ?? (resolvedRole === 'user' ? 'end' : 'start');
    const resolvedVariant: BubbleVariant =
      variant ?? (role !== undefined ? (role === 'assistant' ? 'ghost' : 'card') : 'default');

    const cornerClass =
      resolvedVariant === 'ghost'
        ? 'rounded-none'
        : resolvedRole === 'system' && resolvedVariant === 'card'
        ? 'rounded-md'
        : resolvedAlign === 'end'
        ? 'rounded-lg rounded-ee-sm'
        : 'rounded-lg rounded-es-sm';

    const variantClass = (() => {
      switch (resolvedVariant) {
        case 'ghost':
          return 'w-full bg-transparent text-on-surface border-0 px-0 py-1';
        case 'secondary':
          return 'bg-secondary-container text-on-secondary-container';
        case 'muted':
          return 'bg-surface-container-high text-on-surface';
        case 'tinted':
          return 'bg-primary-container text-on-primary-container';
        case 'outline':
          return 'bg-surface text-on-surface border border-outline-variant';
        case 'destructive':
          return 'bg-error-container text-on-error-container';
        case 'card':
          if (resolvedRole === 'user') {
            return 'bg-primary-container text-on-primary-container';
          }
          if (resolvedRole === 'system') {
            return 'bg-surface-container text-on-surface-variant text-sm font-medium';
          }
          return 'bg-surface text-on-surface border border-outline-variant shadow-ambient';
        case 'default':
        default:
          return resolvedAlign === 'end'
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container text-on-surface';
      }
    })();

    return (
      <div
        ref={ref}
        data-slot="bubble"
        data-role={resolvedRole}
        data-align={resolvedAlign}
        data-variant={resolvedVariant}
        className={cn(
          'relative flex flex-col p-4 text-base font-sans leading-relaxed transition-colors',
          cornerClass,
          variantClass,
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

export interface BubbleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const BubbleContent = React.forwardRef<HTMLDivElement, BubbleContentProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="bubble-content"
      className={cn('typeset typeset-chat min-w-0 break-words', className)}
      {...props}
    >
      {children}
    </div>
  )
);
BubbleContent.displayName = 'Bubble.Content';

export interface BubbleReactionsProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom';
  align?: 'start' | 'end';
  children?: React.ReactNode;
  className?: string;
}

const BubbleReactions = React.forwardRef<HTMLDivElement, BubbleReactionsProps>(
  ({ side = 'bottom', align = 'start', children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="bubble-reactions"
      data-side={side}
      data-align={align}
      className={cn(
        'flex flex-wrap items-center gap-1',
        side === 'top' ? 'order-first mb-1.5 -mt-1' : 'order-last mt-1.5 -mb-1',
        align === 'end' ? 'justify-end' : 'justify-start',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
BubbleReactions.displayName = 'Bubble.Reactions';

export interface BubbleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end';
  children?: React.ReactNode;
  className?: string;
}

const BubbleGroup = React.forwardRef<HTMLDivElement, BubbleGroupProps>(
  ({ align, children, className, ...props }, ref) => {
    const chatContext = useChatMessageContext();
    const resolvedAlign = align ?? (chatContext.inMessage && chatContext.role === 'user' ? 'end' : 'start');

    return (
      <div
        ref={ref}
        role="group"
        data-slot="bubble-group"
        data-align={resolvedAlign}
        className={cn(
          'flex flex-col gap-1',
          resolvedAlign === 'end' ? 'items-end' : 'items-start',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BubbleGroup.displayName = 'Bubble.Group';

export interface ChatMessageAvatarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Avatar>, 'fallback' | 'children'> {
  role?: ChatRole;
  botType?: BotAvatarType;
  src?: string;
  name?: string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageAvatar: React.FC<ChatMessageAvatarProps> = ({
  role,
  botType,
  src,
  name,
  fallback,
  children,
  className,
  ...props
}) => {
  const chatContext = useChatMessageContext();
  const resolvedRole: ChatRole = role ?? (chatContext.inMessage ? chatContext.role : 'assistant');

  if (children !== undefined) {
    return (
      <div
        data-slot="message-avatar"
        className={cn('shrink-0 flex items-start', className)}
      >
        {children}
      </div>
    );
  }

  if (resolvedRole === 'assistant' && botType) {
    return <BotAvatar type={botType} size="sm" className={className} />;
  }

  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : resolvedRole === 'user'
    ? 'U'
    : 'AI';

  return (
    <Avatar
      src={src}
      alt={name || (resolvedRole === 'user' ? 'User avatar' : 'Assistant avatar')}
      fallback={fallback || initials}
      size="sm"
      className={cn(
        'size-7 text-xs shrink-0 select-none border',
        resolvedRole === 'user'
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

const ChatMessageActions: React.FC<ChatMessageActionsProps> = ({ children, className, ...props }) => {
  return (
    <div
      {...props}
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
  role?: ChatRole;
  align?: 'start' | 'end';
  content?: React.ReactNode;
  children?: React.ReactNode;
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
  onCopy?: () => void | Promise<void>;
  onRetry?: () => void;
  extraActions?: React.ReactNode;
  className?: string;
}

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      role: roleProp,
      align,
      content,
      children,
      variant,
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
    const role: ChatRole = roleProp ?? (align === 'end' ? 'user' : 'assistant');
    const resolvedVariant = variant ?? (role === 'assistant' ? 'ghost' : 'card');
    const [copied, setCopied] = React.useState(false);

    if (children !== undefined && content === undefined) {
      return (
        <ChatMessageRoot ref={ref} role={role} align={align} className={className}>
          {children}
        </ChatMessageRoot>
      );
    }

    const handleCopy = async () => {
      try {
        if (onCopy) {
          await onCopy();
        } else if (typeof content === 'string') {
          await navigator.clipboard.writeText(content);
        }
      } catch {
        return;
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <ChatMessageRoot ref={ref} role={role} align={align} className={className}>
        <ChatMessageHeader
          role={role}
          authorName={authorName}
          timestamp={timestamp}
          botType={botType}
        />

        <ChatMessageBubble role={role} variant={resolvedVariant}>
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
                          Reasoning ({thoughtSteps!.length} step{thoughtSteps!.length > 1 ? 's' : ''})
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
                  className="text-xs gap-1 h-8 min-h-[32px] px-2"
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
                    ? 'Saved to library'
                    : 'Save response to library'
                }
              >
                <Button
                  variant={isBookmarked ? 'soft' : 'ghost'}
                  colorRole={isBookmarked ? 'primary' : 'neutral'}
                  size="sm"
                  onClick={onBookmark}
                  expandedTouchTarget
                  aria-label={
                    isBookmarked
                      ? 'Saved to library'
                      : 'Save response to library'
                  }
                  className="text-xs gap-1 h-8 min-h-[32px] px-2"
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
                  className="text-xs gap-1 h-8 min-h-[32px] px-2"
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
      className={cn('flex flex-col gap-1.5 w-full min-w-0', className)}
      {...props}
    >
      {children}
    </div>
  )
);
ChatMessageContentWrapper.displayName = 'ChatMessage.ContentWrapper';

/* -------------------------------------------------------------------------------------------------
 * Compound Components
 * -----------------------------------------------------------------------------------------------*/
const Bubble = Object.assign(ChatMessageBubble, {
  Content: BubbleContent,
  Reactions: BubbleReactions,
  Group: BubbleGroup,
});

export const ChatMessageCompound = Object.assign(ChatMessage, {
  Root: ChatMessageRoot,
  Header: ChatMessageHeader,
  Bubble,
  BubbleContent,
  BubbleReactions,
  BubbleGroup,
  Content: ChatMessageContentWrapper,
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
  Bubble,
  BubbleContent,
  BubbleReactions,
  BubbleGroup,
  // shadcn AI Elements direct aliases
  ChatMessageCompound as Message,
  ChatMessageRoot as MessageRoot,
  ChatMessageHeader as MessageHeader,
  ChatMessageContentWrapper as MessageContent,
  ChatMessageBubble as MessageBubble,
  ChatMessageAttachments as MessageAttachments,
  ChatMessageActions as MessageFooter,
  ChatMessageActions as MessageActions,
  ChatMessageAvatar as MessageAvatar,
  ChatMessageGroup as MessageGroup,
};

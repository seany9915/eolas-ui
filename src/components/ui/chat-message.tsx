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
import { BotAvatar, type BotAvatarType } from './bot-avatar';
import { Trace } from './trace';
import { Reasoning } from './reasoning';
import { Tooltip } from './tooltip';
import { cn } from '@/lib/utils';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessageRootProps extends React.HTMLAttributes<HTMLDivElement> {
  role: ChatRole;
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageRoot = React.forwardRef<HTMLDivElement, ChatMessageRootProps>(
  ({ role, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-role={role}
        className={cn(
          '@container flex w-full gap-3 py-2',
          role === 'user' ? 'justify-end' : 'justify-start',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'flex flex-col gap-1.5',
            role === 'user'
              ? 'items-end max-w-[90%] @md:max-w-[80%]'
              : 'items-start max-w-[95%] @md:max-w-[85%]'
          )}
        >
          {children}
        </div>
      </div>
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
        <span className="text-[11px] font-mono tabular-nums text-on-surface-variant/80">
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
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageBubble = React.forwardRef<HTMLDivElement, ChatMessageBubbleProps>(
  ({ role, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-role={role}
        className={cn(
          'p-4 text-base font-sans leading-relaxed transition-[border-color,box-shadow]',
          role === 'user' &&
            'bg-primary-container text-on-primary-container rounded-2xl rounded-br-xs shadow-ambient',
          role === 'assistant' &&
            'bg-surface text-on-surface border border-outline-variant rounded-2xl rounded-bl-xs shadow-ambient',
          role === 'system' &&
            'bg-surface-container text-on-surface-variant border border-outline-variant/60 rounded-xl text-sm italic',
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

export interface ChatMessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
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

  if (src) {
    return (
      <div
        className={cn(
          'size-7 rounded-full overflow-hidden shrink-0 border border-outline-variant bg-surface-container',
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={name || (role === 'user' ? 'User avatar' : 'Assistant avatar')}
          className="size-full object-cover"
        />
      </div>
    );
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
    <div
      role="img"
      aria-label={name || (role === 'user' ? 'User avatar' : 'Assistant avatar')}
      className={cn(
        'size-7 rounded-full shrink-0 flex items-center justify-center font-label text-xs font-semibold select-none border',
        role === 'user'
          ? 'bg-primary text-on-primary border-primary'
          : 'bg-surface-container text-on-surface border-outline-variant',
        className
      )}
      {...props}
    >
      {fallback || initials}
    </div>
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

        <ChatMessageBubble role={role}>
          {reasoning && (
            <div className="mb-3">
              {typeof reasoning === 'string' ? (
                <Reasoning
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

          {plan && <div className="mb-3">{plan}</div>}

          {(trace || (thoughtSteps && thoughtSteps.length > 0)) && (
            <div className="mb-3">
              {trace ? (
                trace
              ) : (
                <Trace variant="embedded">
                  <Trace.Collapsible defaultOpen={false}>
                    <Trace.CollapsibleTrigger>
                      <Trace.Line status="complete">
                        <Trace.Icon name="psychology" status="complete" />
                        <Trace.Title>
                          Clinical Reasoning ({thoughtSteps!.length} step{thoughtSteps!.length > 1 ? 's' : ''})
                        </Trace.Title>
                      </Trace.Line>
                    </Trace.CollapsibleTrigger>
                    <Trace.CollapsibleContent>
                      <ul className="space-y-1.5 pl-1">
                        {thoughtSteps!.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-on-surface-variant">
                            <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </Trace.CollapsibleContent>
                  </Trace.Collapsible>
                </Trace>
              )}
            </div>
          )}

          <div className="typeset typeset-chat">{content}</div>

          {citations && <div className="mt-3 pt-2.5 border-t border-outline-variant/50">{citations}</div>}
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

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const ChatMessageCompound = Object.assign(ChatMessage, {
  Root: ChatMessageRoot,
  Header: ChatMessageHeader,
  Bubble: ChatMessageBubble,
  Content: ChatMessageBubble,
  Actions: ChatMessageActions,
  Footer: ChatMessageActions,
  Avatar: ChatMessageAvatar,
  Group: ChatMessageGroup,
});

export {
  ChatMessageRoot,
  ChatMessageHeader,
  ChatMessageBubble,
  ChatMessageActions,
  ChatMessageAvatar,
  ChatMessageGroup,
  // shadcn AI Elements direct aliases
  ChatMessageCompound as Message,
  ChatMessageRoot as MessageRoot,
  ChatMessageHeader as MessageHeader,
  ChatMessageBubble as MessageContent,
  ChatMessageBubble as Bubble,
  ChatMessageActions as MessageFooter,
  ChatMessageActions as MessageActions,
  ChatMessageAvatar as MessageAvatar,
  ChatMessageGroup as MessageGroup,
};
